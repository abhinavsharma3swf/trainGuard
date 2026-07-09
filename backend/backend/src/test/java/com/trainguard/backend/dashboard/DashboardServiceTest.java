package com.trainguard.backend.dashboard;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.activity.ActivityMetricService;
import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinEntity;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private RecoveryCheckinRepository recoveryCheckinRepository;

    @Mock
    private ActivityMetricService activityMetricService;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void shouldReturnActivitiesWithCompletedAndPendingCheckinStatus() {
        ActivityEntity activityWithCheckin = ActivityEntity.builder()
                .id(1L)
                .sportType("RUN")
                .name("Morning Run")
                .startDate(LocalDateTime.of(2026, 7, 7, 8, 0))
                .distanceMeters(8046.72)
                .movingTimeSeconds(2400)
                .athleteId(12345L)
                .build();

        ActivityEntity activityWithoutCheckin = ActivityEntity.builder()
                .id(2L)
                .sportType("RIDE")
                .name("Endurance Ride")
                .startDate(LocalDateTime.of(2026, 7, 8, 8, 0))
                .distanceMeters(32186.88)
                .movingTimeSeconds(5400)
                .athleteId(12345L)
                .build();

        RecoveryCheckinEntity checkin = RecoveryCheckinEntity.builder()
                .id(1L)
                .activity(activityWithCheckin)
                .rpe(4)
                .painScore(0)
                .painLocation("hip")
                .mood("Good")
                .note("Felt fine")
                .createdAt(LocalDateTime.of(2026, 7, 7, 9, 0))
                .build();

        when(activityRepository.findByAthleteId(12345L))
                .thenReturn(List.of(activityWithCheckin, activityWithoutCheckin));

        when(recoveryCheckinRepository.findAll())
                .thenReturn(List.of(checkin));

        when(activityMetricService.convertMetersToMiles(8046.72))
                .thenReturn(5.0);

        when(activityMetricService.convertSecondsToMinutes(2400))
                .thenReturn(40);

        when(activityMetricService.calculatePacePerMinuteMile(5.0, 2400))
                .thenReturn("8:00");

        when(activityMetricService.convertMetersToMiles(32186.88))
                .thenReturn(20.0);

        when(activityMetricService.convertSecondsToMinutes(5400))
                .thenReturn(90);

        when(activityMetricService.calculatePacePerMinuteMile(20.0, 5400))
                .thenReturn("4:30");

        List<DashboardFeedRecord> result =
                dashboardService.getAllActivitiesForDashboard(12345L);

        assertEquals(2, result.size());

        DashboardFeedRecord completedActivity = result.get(0);

        assertEquals(1L, completedActivity.activityId());
        assertEquals("RUN", completedActivity.sportType());
        assertEquals("Morning Run", completedActivity.name());
        assertEquals(5.0, completedActivity.distanceMiles());
        assertEquals(40, completedActivity.movingTimeMinutes());
        assertEquals("8:00", completedActivity.pacePerMile());
        assertEquals("COMPLETED", completedActivity.checkinStatus());
        assertEquals(4, completedActivity.rpe());
        assertEquals(0, completedActivity.painScore());
        assertEquals("hip", completedActivity.painLocation());
        assertEquals("Good", completedActivity.mood());
        assertEquals("Felt fine", completedActivity.note());

        DashboardFeedRecord pendingActivity = result.get(1);

        assertEquals(2L, pendingActivity.activityId());
        assertEquals("RIDE", pendingActivity.sportType());
        assertEquals("Endurance Ride", pendingActivity.name());
        assertEquals(20.0, pendingActivity.distanceMiles());
        assertEquals(90, pendingActivity.movingTimeMinutes());
        assertEquals("4:30", pendingActivity.pacePerMile());
        assertEquals("PENDING", pendingActivity.checkinStatus());
        assertNull(pendingActivity.rpe());
        assertNull(pendingActivity.painScore());
        assertNull(pendingActivity.painLocation());
        assertNull(pendingActivity.mood());
        assertNull(pendingActivity.note());

        verify(activityRepository).findByAthleteId(12345L);
        verify(recoveryCheckinRepository).findAll();

        verify(activityMetricService).convertMetersToMiles(8046.72);
        verify(activityMetricService).convertSecondsToMinutes(2400);
        verify(activityMetricService).calculatePacePerMinuteMile(5.0, 2400);

        verify(activityMetricService).convertMetersToMiles(32186.88);
        verify(activityMetricService).convertSecondsToMinutes(5400);
        verify(activityMetricService).calculatePacePerMinuteMile(20.0, 5400);
    }
}