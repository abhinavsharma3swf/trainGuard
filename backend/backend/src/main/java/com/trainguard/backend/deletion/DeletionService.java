package com.trainguard.backend.deletion;

import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import com.trainguard.backend.session.SessionRepository;
import com.trainguard.backend.session.SessionService;
import com.trainguard.backend.strava.StravaClient;
import com.trainguard.backend.strava.StravaTokenResponseRecord;
import com.trainguard.backend.strava.StravaUserEntity;
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
    private final SessionService sessionService;
    private final StravaClient stravaClient;

    @Transactional
    public void deleteUserData(String authorizationHeader) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        recoveryCheckinRepository.deleteAllByAthleteId(athleteId);
        activityRepository.deleteAllByAthleteId(athleteId);
    }


    public void deleteLocalAccount(Long athleteId) {

//        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        // Delete dependent data first
        recoveryCheckinRepository.deleteAllByAthleteId(athleteId);
        activityRepository.deleteAllByAthleteId(athleteId);

        // Delete authentication/session data
        sessionRepository.deleteAllByStravaUser_AthleteId(athleteId);

        // Delete the main user record last
        stravaUserRepository.deleteAllByAthleteId(athleteId);

//        stravaClient.revokeAuthorization(authorizationHeader);
    }

    public void deleteUserAccount(String authorizationHeader) {
        Long athleteId =
                sessionService.getAthleteIdFromAuthorizationHeader(
                        authorizationHeader
                );

        StravaUserEntity stravaUser = stravaUserRepository
                .findById(athleteId)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Strava user not found: " + athleteId
                        )
                );

        String refreshToken = stravaUser.getRefreshToken();

        if (refreshToken != null && !refreshToken.isBlank()) {
            StravaTokenResponseRecord tokenResponse =
                    stravaClient.refreshAccessToken(refreshToken);

            stravaClient.deauthorize(
                    tokenResponse.accessToken()
            );
        }
        deleteLocalAccount(athleteId);
    }
}
