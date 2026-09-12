package com.trainguard.backend.activity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@Getter
@Setter
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityMetricService activityMetricService;
    private final ActivityRepository activityRepository;

        public ActivityResponseRecord importActivityForAthlete(
            Long athleteId,
            ActivityImportRequestRecord requestRecord
        ) {
        ActivityImportRequestRecord ownedRequest = new ActivityImportRequestRecord(
            requestRecord.externalSource(),
            requestRecord.externalActivityId(),
            requestRecord.sportType(),
            requestRecord.name(),
            requestRecord.startDate(),
            requestRecord.distanceMeters(),
            requestRecord.movingTimeSeconds(),
            requestRecord.elapsedTimeSeconds(),
            requestRecord.totalElevationGain(),
            requestRecord.averageWatts(),
            requestRecord.weightedAverageWatts(),
            athleteId,
            requestRecord.description(),
            requestRecord.start_latlng()
        );
        return importActivity(ownedRequest);
        }

    @Transactional
    public ActivityResponseRecord importActivity(ActivityImportRequestRecord requestRecord) {
        ActivityEntity activity = activityRepository
                .findByAthleteIdAndExternalSourceAndExternalActivityId(
                        requestRecord.athleteId(),
                        requestRecord.externalSource(),
                        requestRecord.externalActivityId()
                )
                .orElseGet(ActivityEntity::new);

        String activityType = requestRecord.sportType();
        String activityToBeSaved = switch(activityType) {
            case "RUN", "RIDE", "VIRTUALRIDE", "WALK", "WEIGHTTRAINING", "WORKOUT", "YOGA", "TENNIS", "PICKLEBALL", "PILATES", "TRAILRUN", "SWIM" -> activityType;
            default -> "OTHER";
        };

        activity.setAthleteId(requestRecord.athleteId());
        activity.setExternalSource(requestRecord.externalSource());
        activity.setExternalActivityId(requestRecord.externalActivityId());
        activity.setSportType(activityToBeSaved);
        activity.setName(requestRecord.name());
        activity.setStartDate(requestRecord.startDate());
        activity.setDistanceMeters(requestRecord.distanceMeters());
        activity.setMovingTimeSeconds(requestRecord.movingTimeSeconds());
        activity.setElapsedTimeSeconds(requestRecord.elapsedTimeSeconds());
        activity.setTotalElevationGain(requestRecord.totalElevationGain());
        activity.setAverageWatts(requestRecord.averageWatts());
        activity.setWeightedAverageWatts(requestRecord.weightedAverageWatts());
        activity.setStart_latlng(requestRecord.start_latlng());
        activity.setDescription(requestRecord.description());

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
                pacePerMile,
                activity.getStart_latlng(),
                activity.getDescription()
        );
    }

    public List<ActivityResponseRecord> getActivitiesForAthlete(Long athleteId, int page, int size) {
        validatePage(page, size);
        return activityRepository.findByAthleteIdOrderByStartDateDesc(
                        athleteId,
                        PageRequest.of(page, size)
                ).stream()
                .map(this::toResponse)
                .toList();
    }

    private void validatePage(int page, int size) {
        if (page < 0 || size < 1 || size > 100) {
            throw new IllegalArgumentException("Page must be non-negative and size must be between 1 and 100.");
        }
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
