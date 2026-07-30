package com.trainguard.backend.strava;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StravaClient {

    private final RestClient.Builder restClientBuilder;
    private final StravaProperties stravaProperties;

    public List<StravaActivityResponseRecord> fetchLastSevenActivities(String refreshToken) {
        String accessToken = refreshAccessToken(refreshToken);

        RestClient restClient = restClientBuilder
                .baseUrl("https://www.strava.com/api/v3")
                .build();

        return restClient.get()
                .uri("/athlete/activities?per_page=7&page=1")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }

    private String refreshAccessToken(String refreshToken) {
        RestClient restClient = restClientBuilder
                .baseUrl("https://www.strava.com")
                .build();

        StravaTokenResponseRecord response = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/oauth/token")
                        .queryParam("client_id", stravaProperties.clientId())
                        .queryParam("client_secret", stravaProperties.clientSecret())
                        .queryParam("refresh_token", refreshToken)
                        .queryParam("grant_type", "refresh_token")
                        .build())
                .retrieve()
                .body(StravaTokenResponseRecord.class);

        if (response == null || response.accessToken() == null) {
            throw new IllegalStateException("Failed to refresh Strava access token.");
        }

        return response.accessToken();
    }

    public StravaTokenResponseRecord exchangeAuthorizationCode(String code) {
        RestClient restClient = restClientBuilder
                .baseUrl("https://www.strava.com")
                .build();

        StravaTokenResponseRecord response = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/oauth/token")
                        .queryParam("client_id", stravaProperties.clientId())
                        .queryParam("client_secret", stravaProperties.clientSecret())
                        .queryParam("code", code)
                        .queryParam("grant_type", "authorization_code")
                        .build())
                .retrieve()
                .body(StravaTokenResponseRecord.class);

        if (response == null || response.refreshToken() == null || response.athlete() == null) {
            throw new IllegalStateException("Failed to connect Strava.");
        }

        return response;
    }

    public StravaActivityResponseRecord fetchActivityById(
            Long activityId,
            String refreshToken
    ) {
        String accessToken = refreshAccessToken(refreshToken);

        RestClient restClient = restClientBuilder
                .baseUrl("https://www.strava.com/api/v3")
                .build();

        return restClient.get()
                .uri("/activities/{id}", activityId)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(StravaActivityResponseRecord.class);
    }

    public void revokeAuthorization(String refreshToken){
        RestClient restClient = restClientBuilder
                .baseUrl("https://www.strava.com/oauth/revoke")
                .build();

                 restClient.post()
                .header("Authorization", stravaProperties.clientId(), stravaProperties.clientSecret())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(refreshToken)
                .retrieve()
                .toBodilessEntity();

    }
}
