package com.trainguard.backend.recovery;

import java.time.Instant;

public record RecoveryCheckinResponseRecord(
        Long id,
        Long activityId,
        Integer rpe,
        Integer painScore,
        String painLocation,
        String mood,
        String note,
        String sportType,
        Instant createdAt,
        Integer temperature,
        Integer feelsLikeTemperature,
        Integer humidity,
        Integer windSpeed,
        Integer dewPoint
) {
}
