package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        RecoveryCheckinEntity checkin = RecoveryCheckinEntity.builder()
                .activity(activity)
                .rpe(request.rpe())
                .painScore(request.painScore())
                .painLocation(request.painLocation())
                .mood(request.mood())
                .note(request.note())
                .createdAt(LocalDateTime.now())
                .build();

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
                checkin.getCreatedAt()
        );
    }

    public List<RecoveryCheckinResponseRecord> getAllRecoveryCheckin() {
        return recoveryCheckinRepository.findAll().stream()
                .map(this::toResponse).toList();
    }


}
