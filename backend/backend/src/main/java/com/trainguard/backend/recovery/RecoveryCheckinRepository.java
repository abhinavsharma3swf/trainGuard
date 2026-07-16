package com.trainguard.backend.recovery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecoveryCheckinRepository extends JpaRepository<RecoveryCheckinEntity, Long> {
    Optional<RecoveryCheckinEntity> findByActivityId(Long activityId);

    Page<RecoveryCheckinEntity> findByActivityAthleteIdOrderByCreatedAtDesc(
            Long athleteId,
            Pageable pageable
    );
}
