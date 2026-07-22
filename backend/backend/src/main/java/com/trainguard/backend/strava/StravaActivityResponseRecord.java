package com.trainguard.backend.strava;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public record StravaActivityResponseRecord(
        Long id,
        String name,

        @JsonProperty("sport_type")
        String sportType,

        @JsonProperty("start_date")
        LocalDateTime startDate,

        @JsonProperty("distance")
        Double distanceMeters,

        @JsonProperty("moving_time")
        Integer movingTimeSeconds,

        @JsonProperty("elapsed_time")
        Integer elapsedTimeSeconds,

        @JsonProperty("total_elevation_gain")
        Double totalElevationGain,

        @JsonProperty("average_heartrate")
        Double averageHeartbeat,

        @JsonProperty("max_heartrate")
        Double maxHeartbeat,

        @JsonProperty("average_watts")
        Double averageWatts,

        @JsonProperty("weighted_average_watts")
        Double weightedAverageWatts,

        StravaAthleteSummaryRecord athlete,

        @JsonProperty("description")
        String description,

        @JsonProperty("start_latlng")
        List<Double> start_latlng

) {
}