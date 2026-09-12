package com.trainguard.backend.strava;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StravaUserRepository extends JpaRepository<StravaUserEntity, Long> {

    void deleteAllByAthleteId(Long athleteId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from StravaUserEntity u where u.athleteId = :athleteId")
    StravaUserEntity findByAthleteIdForUpdate(@Param("athleteId") Long athleteId);
}