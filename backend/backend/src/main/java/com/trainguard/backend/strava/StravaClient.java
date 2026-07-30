package com.trainguard.backend.strava;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class StravaClient {

    private static final String STRAVA_BASE_URL =
            "https://www.strava.com";

    private static final String STRAVA_API_BASE_URL =
            "https://www.strava.com/api/v3";

    private final RestClient.Builder restClientBuilder;
    private final StravaProperties stravaProperties;

    public List<StravaActivityResponseRecord> fetchLastSevenActivities(
            String accessToken
    ) {
        requireNonBlank(accessToken, "Strava access token");

        long sevenDaysAgo = Instant.now()
                .minus(7, ChronoUnit.DAYS)
                .getEpochSecond();

        try {
            RestClient restClient = restClientBuilder
                    .baseUrl(STRAVA_API_BASE_URL)
                    .build();

            List<StravaActivityResponseRecord> activities =
                    restClient.get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/athlete/activities")
                                    .queryParam("after", sevenDaysAgo)
                                    .queryParam("page", 1)
                                    .queryParam("per_page", 100)
                                    .build())
                            .headers(headers ->
                                    headers.setBearerAuth(accessToken)
                            )
                            .accept(MediaType.APPLICATION_JSON)
                            .retrieve()
                            .body(new ParameterizedTypeReference<>() {
                            });

            return activities == null ? List.of() : activities;

        } catch (RestClientResponseException exception) {
            throw stravaApiException(
                    "Failed to fetch recent Strava activities",
                    exception
            );
        }
    }

    public StravaActivityResponseRecord fetchActivityById(
            Long activityId,
            String accessToken
    ) {
        if (activityId == null) {
            throw new IllegalArgumentException(
                    "Strava activity ID is required."
            );
        }

        requireNonBlank(accessToken, "Strava access token");

        try {
            RestClient restClient = restClientBuilder
                    .baseUrl(STRAVA_API_BASE_URL)
                    .build();

            StravaActivityResponseRecord activity =
                    restClient.get()
                            .uri("/activities/{id}", activityId)
                            .headers(headers ->
                                    headers.setBearerAuth(accessToken)
                            )
                            .accept(MediaType.APPLICATION_JSON)
                            .retrieve()
                            .body(StravaActivityResponseRecord.class);

            if (activity == null) {
                throw new IllegalStateException(
                        "Strava returned no activity for ID: "
                                + activityId
                );
            }

            return activity;

        } catch (RestClientResponseException exception) {
            throw stravaApiException(
                    "Failed to fetch Strava activity",
                    exception
            );
        }
    }

    public StravaTokenResponseRecord refreshAccessToken(
            String refreshToken
    ) {
        requireNonBlank(refreshToken, "Strava refresh token");

        MultiValueMap<String, String> formData =
                new LinkedMultiValueMap<>();

        formData.add("client_id", stravaProperties.clientId());
        formData.add(
                "client_secret",
                stravaProperties.clientSecret()
        );
        formData.add("grant_type", "refresh_token");
        formData.add("refresh_token", refreshToken);

        try {
            RestClient restClient = restClientBuilder
                    .baseUrl(STRAVA_BASE_URL)
                    .build();

            StravaTokenResponseRecord response =
                    restClient.post()
                            .uri("/oauth/token")
                            .contentType(
                                    MediaType.APPLICATION_FORM_URLENCODED
                            )
                            .accept(MediaType.APPLICATION_JSON)
                            .body(formData)
                            .retrieve()
                            .body(StravaTokenResponseRecord.class);

            validateRefreshResponse(response);

            return response;

        } catch (RestClientResponseException exception) {
            throw stravaApiException(
                    "Failed to refresh Strava access token",
                    exception
            );
        }
    }

    public StravaTokenResponseRecord exchangeAuthorizationCode(
            String code
    ) {
        requireNonBlank(code, "Strava authorization code");

        MultiValueMap<String, String> formData =
                new LinkedMultiValueMap<>();

        formData.add("client_id", stravaProperties.clientId());
        formData.add(
                "client_secret",
                stravaProperties.clientSecret()
        );
        formData.add("code", code);
        formData.add("grant_type", "authorization_code");

        try {
            RestClient restClient = restClientBuilder
                    .baseUrl(STRAVA_BASE_URL)
                    .build();

            StravaTokenResponseRecord response =
                    restClient.post()
                            .uri("/oauth/token")
                            .contentType(
                                    MediaType.APPLICATION_FORM_URLENCODED
                            )
                            .accept(MediaType.APPLICATION_JSON)
                            .body(formData)
                            .retrieve()
                            .body(StravaTokenResponseRecord.class);

            validateAuthorizationResponse(response);

            return response;

        } catch (RestClientResponseException exception) {
            throw stravaApiException(
                    "Failed to connect Strava",
                    exception
            );
        }
    }

//    public void revokeAuthorization(String refreshToken) {
//        requireNonBlank(refreshToken, "Strava refresh token");
//
//        MultiValueMap<String, String> formData =
//                new LinkedMultiValueMap<>();
//
//        formData.add("token", refreshToken);
//        formData.add("token_type_hint", "refresh_token");
//
//        try {
//            restClientBuilder
//                    .baseUrl(STRAVA_BASE_URL)
//                    .build()
//                    .post()
//                    .uri("/oauth/revoke")
//                    .headers(headers ->
//                            headers.setBasicAuth(
//                                    stravaProperties.clientId(),
//                                    stravaProperties.clientSecret()
//                            )
//                    )
//                    .contentType(
//                            MediaType.APPLICATION_FORM_URLENCODED
//                    )
//                    .body(formData)
//                    .retrieve()
//                    .toBodilessEntity();
//
//        } catch (HttpServerErrorException.ServiceUnavailable exception) {
//            throw new IllegalStateException(
//                    "Strava returned 503 while revoking authorization.",
//                    exception
//            );
//
//        } catch (RestClientResponseException exception) {
//            throw stravaApiException(
//                    "Failed to revoke Strava authorization",
//                    exception
//            );
//        }
//    }

    public void deauthorize(String accessToken) {
        requireNonBlank(accessToken, "Strava access token");

        try {
            restClientBuilder
                    .baseUrl(STRAVA_BASE_URL)
                    .build()
                    .post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/oauth/deauthorize")
                            .queryParam(
                                    "access_token",
                                    accessToken
                            )
                            .build())
                    .retrieve()
                    .toBodilessEntity();

        } catch (RestClientResponseException exception) {
            throw stravaApiException(
                    "Failed to deauthorize Strava connection",
                    exception
            );
        }
    }

    private void validateRefreshResponse(
            StravaTokenResponseRecord response
    ) {
        if (response == null) {
            throw new IllegalStateException(
                    "Strava returned no token response."
            );
        }

        if (response.accessToken() == null
                || response.accessToken().isBlank()) {
            throw new IllegalStateException(
                    "Strava returned no access token."
            );
        }

        if (response.refreshToken() == null
                || response.refreshToken().isBlank()) {
            throw new IllegalStateException(
                    "Strava returned no refresh token."
            );
        }
    }

    private void validateAuthorizationResponse(
            StravaTokenResponseRecord response
    ) {
        validateRefreshResponse(response);

        if (response.athlete() == null) {
            throw new IllegalStateException(
                    "Strava returned no athlete."
            );
        }
    }

    private void requireNonBlank(
            String value,
            String fieldName
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    fieldName + " is required."
            );
        }
    }

    private IllegalStateException stravaApiException(
            String message,
            RestClientResponseException exception
    ) {
        return new IllegalStateException(
                message + ". Status: "
                        + exception.getStatusCode(),
                exception
        );
    }
}