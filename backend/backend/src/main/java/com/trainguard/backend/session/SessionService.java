package com.trainguard.backend.session;

import com.trainguard.backend.strava.StravaUserEntity;
import com.trainguard.backend.strava.StravaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public String createSessionHandoffForAthlete(Long athleteId) {
        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId)
                .orElseThrow(() -> new IllegalArgumentException("Strava user not found."));

        String token = UUID.randomUUID().toString();
        String handoffCode = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        SessionEntity session = SessionEntity.builder()
                .token(token)
                .stravaUser(stravaUser)
                .createdAt(now)
                .expiresAt(now.plusDays(30))
                .handoffCode(handoffCode)
                .handoffExpiresAt(now.plusMinutes(5))
                .build();

        sessionRepository.save(session);
        return handoffCode;
    }

    @Transactional
    public String exchangeSessionHandoff(String handoffCode) {
        SessionEntity session = sessionRepository
                .findByHandoffCodeAndHandoffExpiresAtAfter(handoffCode, LocalDateTime.now())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired session handoff."));

        session.setHandoffCode(null);
        session.setHandoffExpiresAt(null);
        sessionRepository.save(session);
        return session.getToken();
    }

    public Long getAthleteIdFromToken(String token) {
        SessionEntity session = sessionRepository.findById(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session token."));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Session expired.");
        }

        return session.getStravaUser().getAthleteId();
    }

    public Long getAthleteIdFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header.");
        }

        String token = authorizationHeader.substring(7);
        return getAthleteIdFromToken(token);
    }

    @Transactional
    public void revokeSession(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header.");
        }

        String token = authorizationHeader.substring(7);
        sessionRepository.deleteById(token);
    }
}