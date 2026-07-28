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
public class DeletionService {

    private final ActivityRepository activityRepository;
    private final RecoveryCheckinRepository recoveryCheckinRepository;
    private final SessionRepository sessionRepository;
    private final StravaUserRepository stravaUserRepository;

    @Transactional
    public void deleteUserData(Long athleteId) {

        System.out.println("In service deleteUserData");
        recoveryCheckinRepository.deleteAllByAthleteId(athleteId);
        activityRepository.deleteAllByAthleteId(athleteId);

    }

    @Transactional
    public void deleteUserAccount(Long athleteId) {
        // Delete dependent data first
        recoveryCheckinRepository.deleteAllByAthleteId(athleteId);
        activityRepository.deleteAllByAthleteId(athleteId);

        // Delete authentication/session data
        sessionRepository.deleteAllByStravaUser_AthleteId(athleteId);

        // Delete the main user record last
        stravaUserRepository.deleteAllByAthleteId(athleteId);
    }
}
