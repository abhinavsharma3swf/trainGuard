package com.trainguard.backend.cleanup;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinEntity;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityCleanupService {

    private final ActivityRepository activityRepository;
    private final RecoveryCheckinRepository recoveryCheckinRepository;

    @Transactional
    public void deleteActivitiesOlderThanSevenDays() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);

        List<ActivityEntity> expiredActivities =
                activityRepository.findAllByImportedAtBefore(cutoff);

        expiredActivities.forEach(activity -> {
            List<RecoveryCheckinEntity> checkins =
                    recoveryCheckinRepository.findAllByActivityId(activity.getId());

            checkins.forEach(checkin -> checkin.setActivity(null));
            recoveryCheckinRepository.saveAll(checkins);

        });

        recoveryCheckinRepository.flush();
        activityRepository.deleteAll(expiredActivities);

    }
}