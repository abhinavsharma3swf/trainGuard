package com.trainguard.backend.activity;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ActivityImportRequestRecord(
        String externalSource,
        String externalActivityId,
        String sportType,
        String name,
        LocalDateTime startDate,
        Double distanceMeters,
        Integer movingTimeSeconds,
        Integer elapsedTimeSeconds,
        Double totalElevationGain,
        Double averageHeartbeat,
        Double maxHeartbeat,
        Double averageWatts,
        Double weightedAverageWatts,
        Long athleteId
) {
}