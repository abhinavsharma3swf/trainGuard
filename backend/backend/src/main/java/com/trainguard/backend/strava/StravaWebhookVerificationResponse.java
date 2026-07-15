package com.trainguard.backend.strava;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StravaWebhookVerificationResponse (
        @JsonProperty("hub.challenge")
        String hubChallenge
) {}
