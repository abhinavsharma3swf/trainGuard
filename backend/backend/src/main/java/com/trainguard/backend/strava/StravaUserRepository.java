package com.trainguard.backend.strava;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StravaUserRepository extends JpaRepository<StravaUserEntity, Long> {
}