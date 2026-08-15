package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.Instant;
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

    private final com.trainguard.backend.activity.ActivityMetricService activityMetricService = new com.trainguard.backend.activity.ActivityMetricService();

    private final RecoveryCheckinService recoveryCheckinService =
            new RecoveryCheckinService(recoveryCheckinRepository, activityRepository, activityMetricService);

    @Test
    void shouldCreateRecoveryCheckinForActivity() {
        ActivityEntity activity = ActivityEntity.builder()
                .id(1L)
                .athleteId(1L)
                .externalSource("STRAVA")
                .externalActivityId("12345")
                .sportType("RUN")
                .name("Morning Run")
                .startDate(LocalDateTime.of(2026, 7, 7, 6, 30))
                .distanceMeters(8046.72)
                .movingTimeSeconds(2400)
                .elapsedTimeSeconds(2450)
                .build();

        RecoveryCheckinRequestRecord request = RecoveryCheckinRequestRecord.builder()
                .activityId(1L)
                .rpe(3)
                .painScore(0)
                .painLocation("hip")
                .mood("great")
                .note("Felt tight after cooldown")
                .sportType("RUN")
                .build();

        RecoveryCheckinEntity savedCheckin = RecoveryCheckinEntity.builder()
                .id(1L)
                .activity(activity)
                .rpe(3)
                .painScore(0)
                .painLocation("hip")
                .mood("great")
                .note("Felt tight after cooldown")
                .sportType("RUN")
                .createdAt(Instant.parse("2026-07-07T08:00:00Z"))
                .build();

        when(activityRepository.findByIdAndAthleteId(1L, 1L))
                .thenReturn(Optional.of(activity));

        when(recoveryCheckinRepository.findByActivityId(1L))
                .thenReturn(Optional.empty());

        when(recoveryCheckinRepository.save(any(RecoveryCheckinEntity.class)))
                .thenReturn(savedCheckin);

        RecoveryCheckinResponseRecord response =
                recoveryCheckinService.saveCheckin(1L, request);

        assertEquals(1L, response.id());
        assertEquals(1L, response.activityId());
        assertEquals(3, response.rpe());
        assertEquals(0, response.painScore());
        assertEquals("hip", response.painLocation());
        assertEquals("great", response.mood());
        assertEquals("Felt tight after cooldown", response.note());
        assertEquals("RUN", response.sportType());

        verify(activityRepository).findByIdAndAthleteId(1L, 1L);
        verify(recoveryCheckinRepository).findByActivityId(1L);
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

        when(activityRepository.findByIdAndAthleteId(999L, 12345L))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> recoveryCheckinService.saveCheckin(12345L, request)
        );

        assertEquals("Activity not found", exception.getMessage());

        verify(activityRepository).findByIdAndAthleteId(999L, 12345L);
        verify(recoveryCheckinRepository, never()).save(any(RecoveryCheckinEntity.class));
    }
}