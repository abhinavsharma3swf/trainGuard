package com.trainguard.backend.recovery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.time.LocalDateTime;
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

    List<RecoveryCheckinEntity> findByAthleteIdAndActivity_IdIn(Long athleteId, List<Long> activityIds);

    void deleteAllByAthleteId(Long athleteId);

    @Modifying
    @Query("update RecoveryCheckinEntity c set c.activity = null where c.activity.id in (select a.id from ActivityEntity a where a.importedAt < :cutoff)")
    void clearActivityReferencesForExpiredActivities(LocalDateTime cutoff);

    List<RecoveryCheckinEntity> findByAthleteIdAndActivityDateGreaterThanEqual(Long athleteIdAfter, Instant activityDate);

    List<RecoveryCheckinEntity> findByAthleteIdAndActivityDateGreaterThanEqualAndActivityDateLessThan(Long athleteId, Instant previousStart, Instant currentStart);
}
