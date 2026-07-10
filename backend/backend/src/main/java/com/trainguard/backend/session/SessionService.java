package com.trainguard.backend.session;

import com.trainguard.backend.strava.StravaUserEntity;
import com.trainguard.backend.strava.StravaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final StravaUserRepository stravaUserRepository;

    public String createSessionForAthlete(Long athleteId) {
        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId)
                .orElseThrow(() -> new IllegalArgumentException("Strava user not found."));

        String token = UUID.randomUUID().toString();

        SessionEntity session = SessionEntity.builder()
                .token(token)
                .stravaUser(stravaUser)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();

        sessionRepository.save(session);

        return token;
    }

    public Long getAthleteIdFromToken(String token) {
        SessionEntity session = sessionRepository.findById(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session token."));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Session expired.");
        }

        return session.getStravaUser().getAthleteId();
    }
}