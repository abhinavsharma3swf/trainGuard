package com.trainguard.backend.recovery;

import java.time.Instant;
import java.util.List;

public record RecoveryCheckinResponseRecord(
        Long id,
        Long activityId,
        Integer rpe,
        Integer painScore,
        List<Integer> painLocation,
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
