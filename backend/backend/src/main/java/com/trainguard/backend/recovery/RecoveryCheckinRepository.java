package com.trainguard.backend.recovery;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RecoveryCheckinRepository extends JpaRepository<RecoveryCheckinEntity, Long> {
}
