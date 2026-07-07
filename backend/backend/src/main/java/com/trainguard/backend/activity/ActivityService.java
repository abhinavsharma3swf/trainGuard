package com.trainguard.backend.activity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityMetricService activityMetricService;
    private final ActivityRepository activityRepository;

    public ActivityResponseRecord importActivity(ActivityImportRequestRecord requestRecord) {
        ActivityEntity activity = activityRepository.findByExternalSourceAndExternalActivityId(requestRecord.externalSource(), requestRecord.externalActivityId())
                .orElseGet(() -> saveNewActivity(requestRecord));
        return toResponse(activity);
    }

    private ActivityEntity saveNewActivity(ActivityImportRequestRecord request) {
        ActivityEntity activity = new ActivityEntity();

        activity.setExternalSource(request.externalSource());
        activity.setExternalActivityId(request.externalActivityId());
        activity.setSportType(request.sportType());
        activity.setName(request.name());
        activity.setStartDate(request.startDate());
        activity.setDistanceMeters(request.distanceMeters());
        activity.setMovingTimeSeconds(request.movingTimeSeconds());
        activity.setElapsedTimeSeconds(request.elapsedTimeSeconds());
        activity.setTotalElevationGain(request.totalElevationGain());
        activity.setAverageHeartbeat(request.averageHeartbeat());
        activity.setMaxHeartbeat(request.maxHeartbeat());
        activity.setAverageWatts(request.averageWatts());
        activity.setWeightedAverageWatts(request.weightedAverageWatts());
        activity.setImportedAt(LocalDateTime.now());

        return activityRepository.save(activity);
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
}
