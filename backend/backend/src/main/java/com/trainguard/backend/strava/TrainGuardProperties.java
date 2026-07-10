package com.trainguard.backend.strava;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "train-guard")
public record TrainGuardProperties(
        String appRedirectUri
) {
}