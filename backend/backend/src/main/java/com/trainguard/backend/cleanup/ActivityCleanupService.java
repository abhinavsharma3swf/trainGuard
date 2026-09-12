package com.trainguard.backend.cleanup;

import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityCleanupService {

    private final ActivityRepository activityRepository;
    private final RecoveryCheckinRepository recoveryCheckinRepository;

    @Transactional
    public void deleteActivitiesOlderThanSevenDays() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);

        recoveryCheckinRepository.clearActivityReferencesForExpiredActivities(cutoff);
        activityRepository.deleteAllByImportedAtBefore(cutoff);

    }
}