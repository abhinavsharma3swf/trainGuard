package com.trainguard.backend.activity;
import java.time.LocalDateTime;

public record ActivityResponseRecord(
        Long id,
        String externalSource,
        String externalActivityId,
        String sportType,
        String name,
        LocalDateTime startDate,
        Double distanceMiles,
        Integer movingTimeMinutes,
        String pacePerMile
) {
}
