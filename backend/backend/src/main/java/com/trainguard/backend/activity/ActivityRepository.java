package com.trainguard.backend.activity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityRepository extends JpaRepository<ActivityEntity, Long> {

    Optional<ActivityEntity>findActivityEntityByExternalActivityId(String externalActivityId);

    List<ActivityEntity> findByAthleteId(Long athleteId);

    Optional<ActivityEntity> findByAthleteIdAndExternalSourceAndExternalActivityId(Long athleteId, String strava, String externalActivityId);
}
