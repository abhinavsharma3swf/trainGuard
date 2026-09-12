package com.trainguard.backend.recovery;

import lombok.Builder;

import java.util.List;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Builder
public record RecoveryCheckinRequestRecord (
        @NotNull Long activityId,
        @NotNull @Min(0) @Max(10) Integer rpe,
        @NotNull @Min(0) @Max(10) Integer painScore,
        String painLocation,
        List<Integer> painLocationEnum,
        String mood,
        @Size(max = 2000) String note,
        String sportType,
        Long athleteId,
        Integer temperature,
        Integer feelsLikeTemperature,
        Integer humidity,
        Integer windSpeed,
        Integer dewPoint
){}
