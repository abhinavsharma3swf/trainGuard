package com.trainguard.backend.strava;


import com.fasterxml.jackson.annotation.JsonProperty;

public record StravaWebhookEventRecord(
        @JsonProperty("aspect_type")
        String aspectType,

        @JsonProperty("event_time")
        Long eventTime,

        //Object id is the strava activity id//
        @JsonProperty("object_id")
        Long objectId,

        @JsonProperty("object_type")
        String objectType,

        //Owner id is the strava athlete id//
        @JsonProperty("owner_id")
        Long ownerId,

        @JsonProperty("subscription_id")
        Long subscriptionId
) {
}
