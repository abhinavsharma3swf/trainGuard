package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecoveryCheckinService {

    private final RecoveryCheckinRepository recoveryCheckinRepository;
    private final ActivityRepository activityRepository;

    public RecoveryCheckinResponseRecord saveCheckin(
            Long athleteId,
            RecoveryCheckinRequestRecord request
    ) {
        ActivityEntity activity = activityRepository.findByIdAndAthleteId(
                        request.activityId(),
                        athleteId
                )
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));

        RecoveryCheckinEntity savedCheckin = saveActivityCheckin(request, activity);

        return toResponse(savedCheckin);
    }

    private RecoveryCheckinEntity saveActivityCheckin(
            RecoveryCheckinRequestRecord request,
            ActivityEntity activity
    ) {
        System.out.println("we are in saveActivityCheckin");

        RecoveryCheckinEntity checkin = recoveryCheckinRepository
                .findByActivityId(activity.getId() == null ? -999L : activity.getId())
                .orElseGet(() -> RecoveryCheckinEntity.builder()
                        .activity(activity)
                        .createdAt(LocalDateTime.now())
                        .build());

        System.out.println("we are in saveActivityCheckin after the builder");

        checkin.setRpe(request.rpe());
        checkin.setPainScore(request.painScore());
        checkin.setPainLocation(request.painLocation());
        checkin.setMood(request.mood());
        checkin.setNote(request.note());
        checkin.setSportType(activity.getSportType());
        checkin.setAthleteId(activity.getAthleteId());

        return recoveryCheckinRepository.save(checkin);
    }

//    private RecoveryCheckinResponseRecord toResponse(RecoveryCheckinEntity checkin) {
//        return new RecoveryCheckinResponseRecord(
//                checkin.getId(),
//                checkin.getActivity().getId(),
//                checkin.getRpe(),
//                checkin.getPainScore(),
//                checkin.getPainLocation(),
//                checkin.getMood(),
//                checkin.getNote(),
//                checkin.getSportType(),
//                checkin.getCreatedAt()
//        );
//    }

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
                checkin.getMood(),
                checkin.getNote(),
                checkin.getSportType(),
                checkin.getCreatedAt()
        );
    }

    public List<RecoveryCheckinResponseRecord> getAllRecoveryCheckin(
            Long athleteId,
            int page,
            int size
    ) {
        Page<RecoveryCheckinEntity> checkins =
                recoveryCheckinRepository.findByActivityAthleteIdOrderByCreatedAtDesc(
                        athleteId,
                        PageRequest.of(page, size)
                );

        return checkins.stream()
                .map(this::toResponse)
                .toList();
    }
}
