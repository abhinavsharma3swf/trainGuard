package com.trainguard.backend.activity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ActivityRepository extends JpaRepository<ActivityEntity, Long> {

    List<ActivityEntity> findByAthleteId(Long athleteId);

    Optional<ActivityEntity> findByIdAndAthleteId(Long id, Long athleteId);

    Optional<ActivityEntity> findByAthleteIdAndExternalSourceAndExternalActivityId(Long athleteId, String strava, String externalActivityId);

    List<ActivityEntity> findAllByImportedAtBefore(LocalDateTime cutoff);

    void deleteAllByAthleteId(Long athleteId);
}
