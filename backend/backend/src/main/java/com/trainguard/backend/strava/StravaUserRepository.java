package com.trainguard.backend.strava;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StravaUserRepository extends JpaRepository<StravaUserEntity, Long> {

    void deleteAllByAthleteId(Long athleteId);
}