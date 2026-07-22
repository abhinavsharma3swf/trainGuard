package com.trainguard.backend.activity;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ActivityResponseRecord(
        Long id,
        String externalSource,
        String externalActivityId,
        String sportType,
        String name,
        LocalDateTime startDate,
        Double distanceMiles,
        Integer movingTimeMinutes,
        String pacePerMile,
        Double start_latlng,
        String description
) {
}
