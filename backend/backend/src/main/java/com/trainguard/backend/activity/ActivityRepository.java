package com.trainguard.backend.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ActivityRepository extends JpaRepository<ActivityEntity, Long> {

    List<ActivityEntity> findByAthleteId(Long athleteId);

    Optional<ActivityEntity> findByIdAndAthleteId(Long id, Long athleteId);

    Optional<ActivityEntity> findByAthleteIdAndExternalSourceAndExternalActivityId(Long athleteId, String strava, String externalActivityId);

    List<ActivityEntity> findAllByImportedAtBefore(LocalDateTime cutoff);

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
