package com.trainguard.backend.recovery;

import lombok.Builder;

@Builder
public record RecoveryCheckinRequestRecord (
        Long activityId,
        Integer rpe,
        Integer painScore,
        String painLocation,
        String mood,
        String note,
        String sportType,
        Long athleteId,
        Integer temperature,
        Integer feelsLikeTemperature,
        Integer humidity,
        Integer windSpeed,
        Integer dewPoint
){}
