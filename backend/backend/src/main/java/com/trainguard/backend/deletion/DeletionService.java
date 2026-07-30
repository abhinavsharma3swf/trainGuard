package com.trainguard.backend.deletion;

import com.trainguard.backend.session.SessionService;
import com.trainguard.backend.strava.StravaClient;
import com.trainguard.backend.strava.StravaTokenResponseRecord;
import com.trainguard.backend.strava.StravaUserEntity;
import com.trainguard.backend.strava.StravaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeletionService {

    private final StravaUserRepository stravaUserRepository;
    private final SessionService sessionService;
    private final StravaClient stravaClient;
    private final LocalDeletionService localDeletionService;

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
        localDeletionService.deleteLocalAccount(athleteId);
    }
}
