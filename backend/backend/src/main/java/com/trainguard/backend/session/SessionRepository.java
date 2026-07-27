package com.trainguard.backend.session;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<SessionEntity, String> {

    void deleteAllByStravaUser_AthleteId(Long stravaUserAthleteId);

//    @Modifying
//    @Query("""
//    delete from SessionEntity session
//    where session.user.athleteId = :athleteId
//""")
//    void deleteAllByAthleteId(@Param("athleteId") Long athleteId);
}
