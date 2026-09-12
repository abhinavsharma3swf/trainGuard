package com.trainguard.backend.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActivityRepository extends JpaRepository<ActivityEntity, Long> {

    Page<ActivityEntity> findByAthleteIdOrderByStartDateDesc(Long athleteId, Pageable pageable);

    Optional<ActivityEntity> findByIdAndAthleteId(Long id, Long athleteId);

    Optional<ActivityEntity> findByAthleteIdAndExternalSourceAndExternalActivityId(Long athleteId, String strava, String externalActivityId);

    @Modifying
    @Query("delete from ActivityEntity a where a.importedAt < :cutoff")
    void deleteAllByImportedAtBefore(@Param("cutoff") LocalDateTime cutoff);

    void deleteAllByAthleteId(Long athleteId);

    @Query("""
    select count(a)
    from ActivityEntity a
    where a.athleteId = :athleteId
      and a.recoveryCheckins is empty
    """)

    long countActivitiesWithoutCheckin(
            @Param("athleteId") Long athleteId
    );

}
