package com.trainguard.backend.strava;

import com.trainguard.backend.activity.ActivityImportRequestRecord;
import com.trainguard.backend.activity.ActivityResponseRecord;
import com.trainguard.backend.activity.ActivityService;
import com.trainguard.backend.userActions.ExpoPushRequest;
import com.trainguard.backend.userActions.UserNotificationTokenEntity;
import com.trainguard.backend.userActions.UserNotificationTokenRepository;
import com.trainguard.backend.userActions.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StravaService {

    private final StravaClient stravaClient;
    private final ActivityService activityService;
    private final StravaProperties stravaProperties;
    private final StravaUserRepository stravaUserRepository;
    private final UserNotificationTokenRepository userNotificationTokenRepository;
    private final UserService userService;

//    public List<ActivityResponseRecord> syncLastSevenActivities(Long athleteId) {
//        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId)
//                .orElseThrow(() -> new IllegalArgumentException("Strava user not connected."));
//
//        List<StravaActivityResponseRecord> stravaActivities =
//                stravaClient.fetchLastSevenActivities(stravaUser.getRefreshToken());
//
//        return stravaActivities.stream()
//                .map(stravaActivity -> toActivityImportRequest(stravaActivity, athleteId))
//                .map(activityService::importActivity)
//                .toList();
//    }

    public List<ActivityResponseRecord> syncLastSevenActivities(
            Long athleteId
    ) {
        StravaUserEntity stravaUser =
                stravaUserRepository.findById(athleteId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Strava user not connected."
                                )
                        );

        String accessToken =
                getCurrentAccessToken(stravaUser);

        List<StravaActivityResponseRecord> stravaActivities =
                stravaClient.fetchLastSevenActivities(
                        accessToken
                );

        return stravaActivities.stream()
                .map(stravaActivity ->
                        toActivityImportRequest(
                                stravaActivity,
                                athleteId
                        )
                )
                .map(activityService::importActivity)
                .toList();
    }

    private ActivityImportRequestRecord toActivityImportRequest(
            StravaActivityResponseRecord stravaActivity,
            Long athleteId) {
        Double start_latlng = null;
        System.out.println(stravaActivity.description() + "This is the description");

        if(stravaActivity.start_latlng() != null && stravaActivity.start_latlng().size() == 2) {
            start_latlng = stravaActivity.start_latlng().get(0);
        }

        return ActivityImportRequestRecord.builder()
                .externalSource("STRAVA")
                .externalActivityId(String.valueOf(stravaActivity.id()))
                .sportType(normalizeSportType(stravaActivity.sportType()))
                .name(stravaActivity.name())
                .startDate(stravaActivity.startDate())
                .distanceMeters(stravaActivity.distanceMeters())
                .movingTimeSeconds(stravaActivity.movingTimeSeconds())
                .elapsedTimeSeconds(stravaActivity.elapsedTimeSeconds())
                .totalElevationGain(stravaActivity.totalElevationGain())
//                .averageHeartbeat(stravaActivity.averageHeartbeat())
//                .maxHeartbeat(stravaActivity.maxHeartbeat())
                .averageWatts(stravaActivity.averageWatts())
                .weightedAverageWatts(stravaActivity.weightedAverageWatts())
                .athleteId(athleteId)
                .description(stravaActivity.description())
                .start_latlng(start_latlng)

                .build();
    }

    private String normalizeSportType(String sportType) {
        if (sportType == null) {
            return "UNKNOWN";
        }

        return switch (sportType.toLowerCase()) {
            case "run" -> "RUN";
            case "ride" -> "RIDE";
            case "weighttraining" -> "WEIGHTTRAINING";
            case "swim" -> "SWIM";
            case "virtualbikeride" -> "VIRTUALBIKERIDE";
            case "walk"  -> "WALK";
            case "strength" -> "STRENGTH";
            case "workout"  -> "WORKOUT";
            default -> sportType.toUpperCase();
        };
    }

    public String getAuthorizationUrl() {
        return UriComponentsBuilder
                .fromUriString("https://www.strava.com/oauth/authorize")
                .queryParam("client_id", stravaProperties.clientId())
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", stravaProperties.redirectUri())
                .queryParam("approval_prompt", "force")
                .queryParam("scope", "read,activity:read_all")
                .build()
                .toUriString();
    }

    public Long exchangeAuthorizationCode(String code) {
        StravaTokenResponseRecord response = stravaClient.exchangeAuthorizationCode(code);

        Long athleteId = response.athlete().id();

        StravaUserEntity user = stravaUserRepository.findById(athleteId)
                .orElseGet(() -> StravaUserEntity.builder()
                        .athleteId(athleteId)
                        .connectedAt(LocalDateTime.now())
                        .build());

        user.setFirstname(response.athlete().firstname());
        user.setLastname(response.athlete().lastname());
        user.setRefreshToken(response.refreshToken());
        user.setUpdatedAt(LocalDateTime.now());

        stravaUserRepository.save(user);

        return athleteId;
    }


    public void importSingleActivityFromWebhook(
            Long athleteId,
            Long stravaActivityId
    ) {
        importOrUpdateActivityFromWebhook(athleteId, stravaActivityId);
    }


    public void updateSingleActivityFromWebhook(
            Long athleteId,
            Long stravaActivityId
    ) {
        importOrUpdateActivityFromWebhook(athleteId, stravaActivityId);
    }


    public void deleteSingleActivityFromWebhook(
            Long athleteId,
            Long stravaActivityId
    ) {
        activityService.deleteActivityFromWebhook(
                athleteId,
                String.valueOf(stravaActivityId)
        );
    }

//    private void importOrUpdateActivityFromWebhook(
//            Long athleteId,
//            Long stravaActivityId
//    ) {
//        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId)
//                .orElseThrow(() -> new IllegalArgumentException("Strava user not found."));
//
//        StravaActivityResponseRecord stravaActivity =
//                stravaClient.fetchActivityById(
//                        stravaActivityId,
//                        stravaUser.getRefreshToken()
//                );
//
//        if(!stravaActivity.athlete().id().equals(athleteId)){
//            throw new IllegalArgumentException("Webhook athlete id mismatch");
//        }
//
//        ActivityImportRequestRecord request =
//                toActivityImportRequest(stravaActivity, athleteId);
//
//        activityService.importActivity(request);
//    }

    private void importOrUpdateActivityFromWebhook(
            Long athleteId,
            Long stravaActivityId
    ) {
        StravaUserEntity stravaUser =
                stravaUserRepository.findById(athleteId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Strava user not found."
                                )
                        );

        String accessToken =
                getCurrentAccessToken(stravaUser);

        StravaActivityResponseRecord stravaActivity =
                stravaClient.fetchActivityById(
                        stravaActivityId,
                        accessToken
                );

        if (stravaActivity.athlete() == null
                || !stravaActivity.athlete()
                .id()
                .equals(athleteId)) {
            throw new IllegalArgumentException(
                    "Webhook athlete ID mismatch."
            );
        }

        ActivityImportRequestRecord request =
                toActivityImportRequest(
                        stravaActivity,
                        athleteId
                );

        userService.sendNotificationsToUser(athleteId);
        activityService.importActivity(request);
    }

    private String getCurrentAccessToken(
            StravaUserEntity stravaUser
    ) {
        StravaTokenResponseRecord tokenResponse =
                stravaClient.refreshAccessToken(
                        stravaUser.getRefreshToken()
                );

        stravaUser.setRefreshToken(
                tokenResponse.refreshToken()
        );
        stravaUser.setUpdatedAt(LocalDateTime.now());

        stravaUserRepository.save(stravaUser);

        return tokenResponse.accessToken();
    }
}