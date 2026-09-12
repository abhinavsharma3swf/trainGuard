package com.trainguard.backend.session;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<SessionEntity, String> {

    void deleteAllByStravaUser_AthleteId(Long stravaUserAthleteId);

    void deleteAllByExpiresAtBefore(LocalDateTime cutoff);

        Optional<SessionEntity> findByHandoffCodeAndHandoffExpiresAtAfter(
            String handoffCode,
            LocalDateTime now
        );

//    @Modifying
//    @Query("""
//    delete from SessionEntity session
//    where session.user.athleteId = :athleteId
//""")
//    void deleteAllByAthleteId(@Param("athleteId") Long athleteId);
}
