package com.trainguard.backend.strava;


import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "strava")
public record StravaProperties(
        String clientId,
        String clientSecret,
        String refreshToken,
        String redirectUri
) {
}