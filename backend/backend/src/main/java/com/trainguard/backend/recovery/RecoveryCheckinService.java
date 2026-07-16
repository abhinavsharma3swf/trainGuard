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

    public RecoveryCheckinResponseRecord saveCheckin(RecoveryCheckinRequestRecord request) {
        ActivityEntity activity = activityRepository.findById(request.activityId())
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));

        RecoveryCheckinEntity savedCheckin = saveActivityCheckin(request, activity);

        return toResponse(savedCheckin);
    }

    private RecoveryCheckinEntity saveActivityCheckin(
            RecoveryCheckinRequestRecord request,
            ActivityEntity activity
    ) {

//        RecoveryCheckinEntity checkin = recoveryCheckinRepository.findByActivityId(activity.getId())
//                .orElseGet(() -> RecoveryCheckinEntity.builder()
//                .activity(activity)
//                .rpe(request.rpe())
//                .painScore(request.painScore())
//                .painLocation(request.painLocation())
//                .mood(request.mood())
//                .note(request.note())
//                .createdAt(LocalDateTime.now())
//                .build());
//
//        return recoveryCheckinRepository.save(checkin);

        RecoveryCheckinEntity checkin = recoveryCheckinRepository
                .findByActivityId(activity.getId())
                .orElseGet(() -> RecoveryCheckinEntity.builder()
                        .activity(activity)
                        .createdAt(LocalDateTime.now())
                        .build());

        checkin.setRpe(request.rpe());
        checkin.setPainScore(request.painScore());
        checkin.setPainLocation(request.painLocation());
        checkin.setMood(request.mood());
        checkin.setNote(request.note());
        checkin.setSportType(activity.getSportType());

        return recoveryCheckinRepository.save(checkin);
    }

    private RecoveryCheckinResponseRecord toResponse(RecoveryCheckinEntity checkin) {
        return new RecoveryCheckinResponseRecord(
                checkin.getId(),
                checkin.getActivity().getId(),
                checkin.getRpe(),
                checkin.getPainScore(),
                checkin.getPainLocation(),
                checkin.getMood(),
                checkin.getNote(),
                checkin.getSportType(),
                checkin.getCreatedAt()
        );
    }

    public List<RecoveryCheckinResponseRecord> getAllRecoveryCheckin() {
        return recoveryCheckinRepository.findAll().stream()
                .map(this::toResponse).toList();
    }

    public List<RecoveryHistoryResponseRecord> getRecoveryHistory(
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
                .map(checkin -> new RecoveryHistoryResponseRecord(
                        checkin.getId(),
                        checkin.getCreatedAt(),
                        checkin.getRpe(),
                        checkin.getPainScore(),
                        checkin.getPainLocation(),
                        checkin.getMood(),
                        checkin.getNote()
                ))
                .toList();
    }


}
