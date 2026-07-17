//package com.trainguard.backend.cleanup;
//
//import com.trainguard.backend.activity.ActivityEntity;
//import com.trainguard.backend.activity.ActivityRepository;
//import com.trainguard.backend.recovery.RecoveryCheckinEntity;
//import com.trainguard.backend.recovery.RecoveryCheckinRepository;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.ArgumentCaptor;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertFalse;
//import static org.junit.jupiter.api.Assertions.assertNull;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//
//@ExtendWith(MockitoExtension.class)
//class ActivityCleanupServiceTest {
//
//    @Mock
//    private ActivityRepository activityRepository;
//
//    @Mock
//    private RecoveryCheckinRepository recoveryCheckinRepository;
//
//    @InjectMocks
//    private ActivityCleanupService activityCleanupService;
//
//    @Test
//    void shouldDeleteActivitiesOlderThanSevenDays() {
//        LocalDateTime activityTime =
//                LocalDateTime.of(2026, 7, 10, 8, 0);
//
//        ActivityEntity existingActivity = ActivityEntity.builder()
//                .id(1L)
//                .externalSource("STRAVA")
//                .externalActivityId("12345")
//                .sportType("RUN")
//                .name("Morning Run")
//                .startDate(activityTime)
//                .importedAt(activityTime)
//                .distanceMeters(8046.72)
//                .movingTimeSeconds(2400)
//                .elapsedTimeSeconds(2450)
//                .totalElevationGain(50.0)
//                .averageHeartbeat(145.0)
//                .maxHeartbeat(170.0)
//                .athleteId(12345L)
//                .build();
//
//        RecoveryCheckinEntity existingCheckin =
//                RecoveryCheckinEntity.builder()
//                        .id(10L)
//                        .activity(existingActivity)
//                        .rpe(7)
//                        .painScore(2)
//                        .painLocation("Knee")
//                        .mood("Good")
//                        .sportType("RUN")
//                        .createdAt(activityTime)
//                        .build();
//
//        when(activityRepository.findAllByImportedAtBefore(
//                any(LocalDateTime.class)
//        )).thenReturn(List.of(existingActivity));
//
//        when(recoveryCheckinRepository.findAllByActivityId(1L))
//                .thenReturn(List.of(existingCheckin));
//
//        LocalDateTime expectedCutoffBefore =
//                LocalDateTime.now().minusDays(7);
//
//        activityCleanupService.deleteActivitiesOlderThanSevenDays();
//
//        LocalDateTime expectedCutoffAfter =
//                LocalDateTime.now().minusDays(7);
//
//        ArgumentCaptor<LocalDateTime> cutoffCaptor =
//                ArgumentCaptor.forClass(LocalDateTime.class);
//
//        verify(activityRepository)
//                .findAllByImportedAtBefore(cutoffCaptor.capture());
//
//        LocalDateTime actualCutoff = cutoffCaptor.getValue();
//
//        assertFalse(actualCutoff.isBefore(expectedCutoffBefore));
//        assertFalse(actualCutoff.isAfter(expectedCutoffAfter));
//
//        assertNull(existingCheckin.getActivity());
//
//        verify(recoveryCheckinRepository)
//                .findAllByActivityId(1L);
//
//        verify(recoveryCheckinRepository)
//                .saveAll(List.of(existingCheckin));
//
//        verify(recoveryCheckinRepository)
//                .flush();
//
//        verify(activityRepository)
//                .deleteAll(List.of(existingActivity));
//    }
//}