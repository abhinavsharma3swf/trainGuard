package com.trainguard.backend.recovery;

import java.time.LocalDateTime;

public record RecoveryCheckinResponseRecord(
        Long id,
        Long activityId,
        Integer rpe,
        Integer painScore,
        String painLocation,
        String mood,
        String note,
        LocalDateTime createdAt
) {
}
