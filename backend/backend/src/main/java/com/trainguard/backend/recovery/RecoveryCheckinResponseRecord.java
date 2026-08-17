package com.trainguard.backend.recovery;

import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Builder
public record RecoveryCheckinResponseRecord(
        Long id,
        Long activityId,
        Integer rpe,
        Integer painScore,
        String painLocation,
        List<Integer> painLocationEnum,
        String mood,
        String note,
        String sportType,
        Instant createdAt,
        Integer temperature,
        Integer feelsLikeTemperature,
        Integer humidity,
        Integer windSpeed,
        Integer dewPoint,
        Integer trainingLoad,
        Instant activityDate
) {
}
