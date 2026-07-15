package com.trainguard.backend.strava;


import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "strava.webhook")
public record StravaWebhookProperties(
        String verifyToken
) {
}