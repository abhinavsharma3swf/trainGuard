package com.trainguard.backend.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<SessionEntity, String> {

    Optional<Object> deleteAllByAthleteId(Long athleteId);
}
