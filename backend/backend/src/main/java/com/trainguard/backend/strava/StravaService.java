package com.trainguard.backend.strava;

import com.trainguard.backend.activity.ActivityImportRequestRecord;
import com.trainguard.backend.activity.ActivityResponseRecord;
import com.trainguard.backend.activity.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StravaService {

    private final StravaClient stravaClient;
    private final ActivityService activityService;
    private final StravaProperties stravaProperties;

    public List<ActivityResponseRecord> syncLastSevenActivities(Long athleteId) {
        List<StravaActivityResponseRecord> stravaActivities =
                stravaClient.fetchLastSevenActivities();

        return stravaActivities.stream()
                .map(this::toActivityImportRequest)
                .map(activityService::importActivity)
                .toList();
    }

    private ActivityImportRequestRecord toActivityImportRequest(
            StravaActivityResponseRecord stravaActivity
    ) {
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
                .averageHeartbeat(stravaActivity.averageHeartbeat())
                .maxHeartbeat(stravaActivity.maxHeartbeat())
                .averageWatts(stravaActivity.averageWatts())
                .weightedAverageWatts(stravaActivity.weightedAverageWatts())
                .build();
    }

    private String normalizeSportType(String sportType) {
        if (sportType == null) {
            return "UNKNOWN";
        }

        return switch (sportType.toLowerCase()) {
            case "run" -> "RUN";
            case "ride", "virtualride" -> "RIDE";
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
}