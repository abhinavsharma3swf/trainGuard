package com.trainguard.backend.activity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Getter
@Setter
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityMetricService activityMetricService;
    private final ActivityRepository activityRepository;

    public ActivityResponseRecord importActivity(ActivityImportRequestRecord requestRecord) {
        ActivityEntity activity = activityRepository
                .findByAthleteIdAndExternalSourceAndExternalActivityId(
                        requestRecord.athleteId(),
                        requestRecord.externalSource(),
                        requestRecord.externalActivityId()
                )
                .orElseGet(ActivityEntity::new);

        activity.setAthleteId(requestRecord.athleteId());
        activity.setExternalSource(requestRecord.externalSource());
        activity.setExternalActivityId(requestRecord.externalActivityId());
        activity.setSportType(requestRecord.sportType());
        activity.setName(requestRecord.name());
        activity.setStartDate(requestRecord.startDate());
        activity.setDistanceMeters(requestRecord.distanceMeters());
        activity.setMovingTimeSeconds(requestRecord.movingTimeSeconds());
        activity.setElapsedTimeSeconds(requestRecord.elapsedTimeSeconds());
        activity.setTotalElevationGain(requestRecord.totalElevationGain());
        activity.setAverageHeartbeat(requestRecord.averageHeartbeat());
        activity.setMaxHeartbeat(requestRecord.maxHeartbeat());
        activity.setAverageWatts(requestRecord.averageWatts());
        activity.setWeightedAverageWatts(requestRecord.weightedAverageWatts());

        if (activity.getImportedAt() == null) {
            activity.setImportedAt(LocalDateTime.now());
        }

        ActivityEntity savedActivity = activityRepository.save(activity);

        return toResponse(savedActivity);
    }

    private ActivityResponseRecord toResponse(ActivityEntity activity) {
        Double distanceMiles = activityMetricService.convertMetersToMiles(activity.getDistanceMeters());
        Integer movingTimeMinutes = activityMetricService.convertSecondsToMinutes(activity.getMovingTimeSeconds());
        String pacePerMile = activityMetricService.calculatePacePerMinuteMile(
                distanceMiles,
                activity.getMovingTimeSeconds()
        );

        return new ActivityResponseRecord(
                activity.getId(),
                activity.getExternalSource(),
                activity.getExternalActivityId(),
                activity.getSportType(),
                activity.getName(),
                activity.getStartDate(),
                distanceMiles,
                movingTimeMinutes,
                pacePerMile
        );
    }

    public List<ActivityResponseRecord> getAllActivities() {
        return activityRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteActivityFromWebhook(Long athleteId, String externalActivityId) {
        activityRepository
                .findByAthleteIdAndExternalSourceAndExternalActivityId(
                        athleteId,
                        "STRAVA",
                        externalActivityId
                )
                .ifPresent(activityRepository::delete);
    }
}
