package com.trainguard.backend.recovery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecoveryCheckinRepository extends JpaRepository<RecoveryCheckinEntity, Long> {

    Optional<RecoveryCheckinEntity> findByActivityId(Long activityId);

    List<RecoveryCheckinEntity> findAllByActivityId(Long activityId);

    Page<RecoveryCheckinEntity> findByAthleteIdOrderByCreatedAtDesc(
            Long athleteId,
            Pageable pageable
    );

    List<RecoveryCheckinEntity> findByAthleteId(Long athleteId);

    void deleteAllByAthleteId(Long athleteId);

    List<RecoveryCheckinEntity> findByAthleteIdAndActivityDateGreaterThanEqual(Long athleteIdAfter, Instant activityDate);

    List<RecoveryCheckinEntity> findByAthleteIdAndActivityDateGreaterThanEqualAndActivityDateLessThan(Long athleteId, Instant previousStart, Instant currentStart);
}
