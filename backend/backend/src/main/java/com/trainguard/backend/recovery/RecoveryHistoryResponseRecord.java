package com.trainguard.backend.recovery;

import java.time.LocalDateTime;

public record RecoveryHistoryResponseRecord(
        Long checkinId,
        LocalDateTime createdAt,
        Integer rpe,
        Integer painScore,
        String painLocation,
        String mood,
        String note
) {
}