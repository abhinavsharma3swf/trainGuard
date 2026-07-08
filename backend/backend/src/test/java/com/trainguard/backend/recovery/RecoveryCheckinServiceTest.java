package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RecoveryCheckinServiceTest {

    private final RecoveryCheckinRepository recoveryCheckinRepository =
            mock(RecoveryCheckinRepository.class);

    private final ActivityRepository activityRepository =
            mock(ActivityRepository.class);

    private final RecoveryCheckinService recoveryCheckinService =
            new RecoveryCheckinService(recoveryCheckinRepository, activityRepository);

    @Test
    void shouldCreateRecoveryCheckinForActivity() {
        ActivityEntity activity = ActivityEntity.builder()
                .id(1L)
                .externalSource("STRAVA")
                .externalActivityId("12345")
                .sportType("RUN")
                .name("Morning Run")
                .startDate(LocalDateTime.of(2026, 7, 7, 6, 30))
                .distanceMeters(8046.72)
                .movingTimeSeconds(2400)
                .build();

        RecoveryCheckinRequestRecord request = RecoveryCheckinRequestRecord.builder()
                .activityId(1L)
                .rpe(3)
                .painScore(0)
                .painLocation("hip")
                .mood("great")
                .note("Felt tight after cooldown")
                .build();

        RecoveryCheckinEntity savedCheckin = RecoveryCheckinEntity.builder()
                .id(1L)
                .activity(activity)
                .rpe(3)
                .painScore(0)
                .painLocation("hip")
                .mood("great")
                .note("Felt tight after cooldown")
                .createdAt(LocalDateTime.of(2026, 7, 7, 8, 0))
                .build();

        when(activityRepository.findById(1L))
                .thenReturn(Optional.of(activity));

        when(recoveryCheckinRepository.save(any(RecoveryCheckinEntity.class)))
                .thenReturn(savedCheckin);

        RecoveryCheckinResponseRecord response =
                recoveryCheckinService.saveCheckin(request);

        assertEquals(1L, response.id());
        assertEquals(1L, response.activityId());
        assertEquals(3, response.rpe());
        assertEquals(0, response.painScore());
        assertEquals("hip", response.painLocation());
        assertEquals("great", response.mood());
        assertEquals("Felt tight after cooldown", response.note());

        verify(activityRepository).findById(1L);
        verify(recoveryCheckinRepository).save(any(RecoveryCheckinEntity.class));
    }

    @Test
    void shouldThrowExceptionWhenActivityDoesNotExist() {
        RecoveryCheckinRequestRecord request = RecoveryCheckinRequestRecord.builder()
                .activityId(999L)
                .rpe(5)
                .painScore(2)
                .painLocation("hip")
                .mood("okay")
                .note("Test note")
                .build();

        when(activityRepository.findById(999L))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> recoveryCheckinService.saveCheckin(request)
        );

        assertEquals("Activity not found", exception.getMessage());

        verify(activityRepository).findById(999L);
        verify(recoveryCheckinRepository, never()).save(any(RecoveryCheckinEntity.class));
    }
}