package com.trainguard.backend.dashboard;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityMetricService;
import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinEntity;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ActivityRepository activityRepository;
    private final RecoveryCheckinRepository recoveryCheckinRepository;
    private final ActivityMetricService activityMetricService;

    public List<DashboardFeedRecord> getAllActivitiesForDashboard(Long athleteId) {
        List<ActivityEntity> activities = activityRepository.findByAthleteId(athleteId);
        List<RecoveryCheckinEntity> checkins = recoveryCheckinRepository.findByAthleteId(athleteId);

        return activities.stream()
                .map(activity -> {
                    Optional<RecoveryCheckinEntity> matchingCheckin = checkins.stream()
                            .filter(checkin ->
                                    checkin.getActivity() != null &&
                                            checkin.getActivity().getId().equals(activity.getId())
                            )
                            .findFirst();

                    return toDashboardFeedRecord(activity, matchingCheckin);
                })
                .toList();
    }

    private DashboardFeedRecord toDashboardFeedRecord(
            ActivityEntity activity,
            Optional<RecoveryCheckinEntity> matchingCheckin
    ) {
        Double distanceMiles = activityMetricService.convertMetersToMiles(
                activity.getDistanceMeters()
        );

        Integer movingTimeMinutes = activityMetricService.convertSecondsToMinutes(
                activity.getMovingTimeSeconds()
        );

        String pacePerMile = activityMetricService.calculatePacePerMinuteMile(
                distanceMiles,
                activity.getMovingTimeSeconds()
        );

        return DashboardFeedRecord.builder()
                .activityId(activity.getId())
                .sportType(activity.getSportType())
                .name(activity.getName())
                .startDate(activity.getStartDate())
                .averageWatts(activity.getAverageWatts())
                .distanceMiles(distanceMiles)
                .movingTimeMinutes(movingTimeMinutes)
                .pacePerMile(pacePerMile)
                .checkinStatus(matchingCheckin.isPresent() ? "COMPLETED" : "PENDING")
                .rpe(matchingCheckin.map(RecoveryCheckinEntity::getRpe).orElse(null))
                .painScore(matchingCheckin.map(RecoveryCheckinEntity::getPainScore).orElse(null))
                .painLocation(matchingCheckin.map(RecoveryCheckinEntity::getPainLocation).orElse(null))
                .mood(matchingCheckin.map(RecoveryCheckinEntity::getMood).orElse(null))
                .note(matchingCheckin.map(RecoveryCheckinEntity::getNote).orElse(null))
                .start_latlng(activity.getStart_latlng())
                .build();
    }
}