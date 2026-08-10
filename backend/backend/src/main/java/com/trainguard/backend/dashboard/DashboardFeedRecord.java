package com.trainguard.backend.dashboard;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

@Builder
public record DashboardFeedRecord(
        Long activityId,
        String sportType,
        Double averageWatts,
        String name,
        LocalDateTime startDate,
        Double distanceMiles,
        Integer movingTimeMinutes,
        String pacePerMile,
        String checkinStatus,
        Integer rpe,
        Integer painScore,
        List<Integer> painLocation,
        String mood,
        String note,
        Double start_latlng,
        String description
) {
}