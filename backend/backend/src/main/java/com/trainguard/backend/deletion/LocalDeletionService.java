package com.trainguard.backend.deletion;

import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import com.trainguard.backend.session.SessionRepository;
import com.trainguard.backend.strava.StravaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LocalDeletionService {

    private final ActivityRepository activityRepository;
    private final RecoveryCheckinRepository recoveryCheckinRepository;
    private final SessionRepository sessionRepository;
    private final StravaUserRepository stravaUserRepository;

    @Transactional
    public void deleteLocalAccount(Long athleteId) {
        recoveryCheckinRepository.deleteAllByAthleteId(athleteId);
        activityRepository.deleteAllByAthleteId(athleteId);
        sessionRepository.deleteAllByStravaUser_AthleteId(athleteId);
        stravaUserRepository.deleteAllByAthleteId(athleteId);
    }
}