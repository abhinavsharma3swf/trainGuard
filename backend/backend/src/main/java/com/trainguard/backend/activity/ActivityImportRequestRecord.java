package com.trainguard.backend.activity;

import lombok.Builder;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Builder
public record ActivityImportRequestRecord(
        @NotBlank String externalSource,
        @NotBlank String externalActivityId,
        @NotBlank String sportType,
        @NotBlank String name,
        @NotNull LocalDateTime startDate,
        @NotNull @PositiveOrZero Double distanceMeters,
        @NotNull @PositiveOrZero Integer movingTimeSeconds,
        @NotNull @PositiveOrZero Integer elapsedTimeSeconds,
        @PositiveOrZero Double totalElevationGain,
        Double averageWatts,
        Double weightedAverageWatts,
        Long athleteId,
        String description,
        Double start_latlng

) {
}