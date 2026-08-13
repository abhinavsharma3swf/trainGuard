//package com.trainguard.backend.recovery;
//
//import com.trainguard.backend.activity.ActivityEntity;
//import com.trainguard.backend.activity.ActivityRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class RecoveryCheckinService {
//
//    private final RecoveryCheckinRepository recoveryCheckinRepository;
//    private final ActivityRepository activityRepository;
//
//    public RecoveryCheckinResponseRecord saveCheckin(
//            Long athleteId,
//            RecoveryCheckinRequestRecord request
//    ) {
//        ActivityEntity activity = activityRepository.findByIdAndAthleteId(
//                        request.activityId(),
//                        athleteId
//                )
//                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));
//
//        RecoveryCheckinEntity savedCheckin = saveActivityCheckin(request, activity);
//
//        return toResponse(savedCheckin);
//    }
//
//    private RecoveryCheckinEntity saveActivityCheckin(
//            RecoveryCheckinRequestRecord request,
//            ActivityEntity activity
//    ) {
//
//        RecoveryCheckinEntity checkin = recoveryCheckinRepository
//                .findByAthleteId(request.athleteId())
//                .orElseGet(() -> RecoveryCheckinEntity.builder()
//                        .activity(activity)
//                        .createdAt(LocalDateTime.now())
//                        .build());
//
//
//        checkin.setRpe(request.rpe());
//        checkin.setPainScore(request.painScore());
//        checkin.setPainLocation(request.painLocation());
//        checkin.setMood(request.mood());
//        checkin.setNote(request.note());
//        checkin.setSportType(activity.getSportType());
//        checkin.setAthleteId(activity.getAthleteId());
//
//        return recoveryCheckinRepository.save(checkin);
//    }
//
////    private RecoveryCheckinResponseRecord toResponse(RecoveryCheckinEntity checkin) {
////        return new RecoveryCheckinResponseRecord(
////                checkin.getId(),
////                checkin.getActivity().getId(),
////                checkin.getRpe(),
////                checkin.getPainScore(),
////                checkin.getPainLocation(),
////                checkin.getMood(),
////                checkin.getNote(),
////                checkin.getSportType(),
////                checkin.getCreatedAt()
////        );
////    }
//
//    private RecoveryCheckinResponseRecord toResponse(RecoveryCheckinEntity checkin) {
//        Long activityId = checkin.getActivity() == null
//                ? null
//                : checkin.getActivity().getId();
//
//        return new RecoveryCheckinResponseRecord(
//                checkin.getId(),
//                activityId,
//                checkin.getRpe(),
//                checkin.getPainScore(),
//                checkin.getPainLocation(),
//                checkin.getMood(),
//                checkin.getNote(),
//                checkin.getSportType(),
//                checkin.getCreatedAt()
//        );
//    }
//
//    public List<RecoveryCheckinResponseRecord> getAllRecoveryCheckin(
//            Long athleteId,
//            int page,
//            int size
//    ) {
//        Page<RecoveryCheckinEntity> checkins =
//                recoveryCheckinRepository.findByActivityAthleteIdOrderByCreatedAtDesc(
//                        athleteId,
//                        PageRequest.of(page, size)
//                );
//
//        return checkins.stream()
//                .map(this::toResponse)
//                .toList();
//    }
//}

package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityMetricService;
import com.trainguard.backend.activity.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecoveryCheckinService {

    private final RecoveryCheckinRepository recoveryCheckinRepository;
    private final ActivityRepository activityRepository;
    private final ActivityMetricService activityMetricService;

    public RecoveryCheckinResponseRecord saveCheckin(
            Long athleteId,
            RecoveryCheckinRequestRecord request
    ) {
        ActivityEntity activity = activityRepository.findByIdAndAthleteId(
                        request.activityId(),
                        athleteId
                )
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));

        RecoveryCheckinEntity savedCheckin = saveActivityCheckin(
                athleteId,
                request,
                activity
        );

        return toResponse(savedCheckin);
    }

    private RecoveryCheckinEntity saveActivityCheckin(
            Long athleteId,
            RecoveryCheckinRequestRecord request,
            ActivityEntity activity
    ) {
        Integer trainingLoad = activity.getElapsedTimeSeconds();
        Integer secsConvertedToMins = activityMetricService.convertSecondsToMinutes(trainingLoad);
        RecoveryCheckinEntity checkin = recoveryCheckinRepository
                .findByActivityId(activity.getId())
                .orElseGet(() -> RecoveryCheckinEntity.builder()
                        .activity(activity)
                        .athleteId(athleteId)
                        .createdAt(Instant.now())
                        .build());

        Integer checkinRpe = request.rpe();

        Integer calcTrainingLoad = secsConvertedToMins * checkinRpe;

        LocalDateTime activityTime = activity.getStartDate();
        ZonedDateTime zonedDateTime = activityTime.atZone(ZoneId.systemDefault());
        Instant activityStartTime = Instant.from(zonedDateTime);

        checkin.setAthleteId(athleteId);
        checkin.setActivity(activity);
        checkin.setRpe(request.rpe());
        checkin.setPainScore(request.painScore());
        checkin.setPainLocation(request.painLocation());
        checkin.setPainLocationEnum(request.painLocationEnum());
        checkin.setMood(request.mood());
        checkin.setNote(request.note());
        checkin.setSportType(activity.getSportType());
        checkin.setTemperature(request.temperature());
        checkin.setFeelsLikeTemperature(request.feelsLikeTemperature());
        checkin.setHumidity(request.humidity());
        checkin.setWindSpeed(request.windSpeed());
        checkin.setDewPoint(request.dewPoint());
        checkin.setTrainingLoad(calcTrainingLoad);
        checkin.setActivityDate(activityStartTime);

        return recoveryCheckinRepository.save(checkin);
    }

    private RecoveryCheckinResponseRecord toResponse(RecoveryCheckinEntity checkin) {
        Long activityId = checkin.getActivity() == null
                ? null
                : checkin.getActivity().getId();

        return new RecoveryCheckinResponseRecord(
                checkin.getId(),
                activityId,
                checkin.getRpe(),
                checkin.getPainScore(),
                checkin.getPainLocation(),
                checkin.getPainLocationEnum(),
                checkin.getMood(),
                checkin.getNote(),
                checkin.getSportType(),
                checkin.getCreatedAt(),
                checkin.getTemperature(),
                checkin.getFeelsLikeTemperature(),
                checkin.getHumidity(),
                checkin.getWindSpeed(),
                checkin.getDewPoint(),
                checkin.getTrainingLoad()
        );
    }

    public List<RecoveryCheckinResponseRecord> getAllRecoveryCheckin(
            Long athleteId,
            int page,
            int size
    ) {
        Page<RecoveryCheckinEntity> checkins =
                recoveryCheckinRepository.findByAthleteIdOrderByCreatedAtDesc(
                        athleteId,
                        PageRequest.of(page, size)
                );

        return checkins.stream()
                .map(this::toResponse)
                .toList();
    }
}
