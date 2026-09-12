package com.trainguard.backend.cleanup;

import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ActivityCleanupServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private RecoveryCheckinRepository recoveryCheckinRepository;

    @InjectMocks
    private ActivityCleanupService activityCleanupService;

    @Test
    void shouldDeleteActivitiesOlderThanSevenDays() {
        LocalDateTime activityTime =
                LocalDateTime.of(2026, 7, 10, 8, 0);

        activityCleanupService.deleteActivitiesOlderThanSevenDays();
        verify(recoveryCheckinRepository).clearActivityReferencesForExpiredActivities(any(LocalDateTime.class));
        verify(activityRepository).deleteAllByImportedAtBefore(any(LocalDateTime.class));
    }
}