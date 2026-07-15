package com.trainguard.backend.recovery;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecoveryCheckinRepository extends JpaRepository<RecoveryCheckinEntity, Long> {
    Optional<RecoveryCheckinEntity> findByActivityId(Long activityId);
}
