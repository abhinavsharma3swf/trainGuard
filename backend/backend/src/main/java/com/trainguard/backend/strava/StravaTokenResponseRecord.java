package com.trainguard.backend.strava;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StravaTokenResponseRecord(
        @JsonProperty("access_token")
        String accessToken,

        @JsonProperty("refresh_token")
        String refreshToken,

        @JsonProperty("expires_at")
        Long expiresAt,

        StravaAthleteRecord athlete
) {
}