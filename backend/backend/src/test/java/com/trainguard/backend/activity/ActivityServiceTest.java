package com.trainguard.backend.activity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ActivityServiceTest {

    private final ActivityMetricService activityMetricService = new ActivityMetricService();
    private final ActivityRepository activityRepository = mock(ActivityRepository.class);
    private final ActivityService activityService = new ActivityService(activityMetricService, activityRepository);


    @Test
    void shouldSaveNewActivityOnlyThatDoesNotExist() {

        ActivityImportRequestRecord request = ActivityImportRequestRecord.builder()
                .externalSource("STRAVA")
                .externalActivityId("12345")
                .sportType("RUN")
                .name("Morning Run")
                .startDate(LocalDateTime.of(2026, 7, 7, 6, 30))
                .distanceMeters(8046.72)
                .movingTimeSeconds(2400)
                .elapsedTimeSeconds(2450)
                .totalElevationGain(50.0)
                .averageHeartbeat(145.0)
                .maxHeartbeat(170.0)
                .build();

        when(activityRepository.findByExternalSourceAndExternalActivityId("STRAVA", "12345")).thenReturn(Optional.empty());

        //invocation is useful because it returns the actual object that the service built.
        //That means the test also indirectly checks that the service correctly copied fields from the request into the entity.
        when(activityRepository.save(any(ActivityEntity.class)))
                .thenAnswer(invocation -> {
                    ActivityEntity saved = invocation.getArgument(0);
                    saved.setId(1L);
                    return saved;
                });

        //If you don't want to use the invocation, we can simplify it by using the code below; however, we won't be able to indirectly check if the service copied fields correctly from the request//

//        ActivityEntity savedActivity = ActivityEntity.builder()
//                .id(1L)
//                .externalSource("STRAVA")
//                .externalActivityId("12345")
//                .sportType("RUN")
//                .name("Morning Run")
//                .startDate(LocalDateTime.of(2026, 7, 7, 6, 30))
//                .distanceMeters(8046.72)
//                .movingTimeSeconds(2400)
//                .elapsedTimeSeconds(2450)
//                .totalElevationGain(50.0)
//                .averageHeartbeat(145.0)
//                .maxHeartbeat(170.0)
//                .build();
//
//        when(activityRepository.save(any(ActivityEntity.class)))
//                .thenReturn(savedActivity);

        //end of simplification

        ActivityResponseRecord response = activityService.importActivity(request);

        assertEquals(1L, response.id());
        assertEquals("STRAVA", response.externalSource());
        assertEquals("12345", response.externalActivityId());
        assertEquals("RUN", response.sportType());
        assertEquals("Morning Run", response.name());
        assertEquals(5.0, response.distanceMiles());
        assertEquals(40, response.movingTimeMinutes());
        assertEquals("8:00", response.pacePerMile());

        verify(activityRepository).save(any(ActivityEntity.class));

    }

    @Test
    void shouldReturnExistingActivityWhenExists() {
        ActivityEntity existingActivity = ActivityEntity.builder()
                .id(1L)
                .externalSource("STRAVA")
                .externalActivityId("12345")
                .sportType("RUN")
                .name("Morning Run")
                .startDate(LocalDateTime.of(2026, 7, 7, 6, 30))
                .distanceMeters(8046.72)
                .movingTimeSeconds(2400)
                .elapsedTimeSeconds(2450)
                .totalElevationGain(50.0)
                .averageHeartbeat(145.0)
                .maxHeartbeat(170.0)
                .build();

        ActivityImportRequestRecord request = ActivityImportRequestRecord.builder()
                .externalSource("STRAVA")
                .externalActivityId("12345")
                .sportType("RUN")
                .name("Morning Run")
                .startDate(LocalDateTime.of(2026, 7, 7, 6, 30))
                .distanceMeters(8046.72)
                .movingTimeSeconds(2400)
                .elapsedTimeSeconds(2450)
                .totalElevationGain(50.0)
                .averageHeartbeat(145.0)
                .maxHeartbeat(170.0)
                .build();

        when(activityRepository.findByExternalSourceAndExternalActivityId("STRAVA", "12345")).thenReturn(Optional.of(existingActivity));

        ActivityResponseRecord response = activityService.importActivity(request);

        assertEquals(1L, response.id());
        assertEquals("STRAVA", response.externalSource());
        assertEquals("12345", response.externalActivityId());
        assertEquals("RUN", response.sportType());
        assertEquals("Morning Run", response.name());
        assertEquals(5.0, response.distanceMiles());
        assertEquals(40, response.movingTimeMinutes());
        assertEquals("8:00", response.pacePerMile());

        verify(activityRepository, never()).save(any(ActivityEntity.class));
    }

    @Test
    void shouldGetAllActivities() {
        ActivityEntity activityOne = ActivityEntity.builder()
                .id(1L)
                .externalSource("STRAVA")
                .externalActivityId("12345")
                .sportType("RUN")
                .name("Morning Run")
                .startDate(LocalDateTime.of(2026, 7, 7, 6, 30))
                .distanceMeters(8046.72)
                .movingTimeSeconds(2400)
                .elapsedTimeSeconds(2450)
                .build();

        ActivityEntity activityTwo = ActivityEntity.builder()
                .id(2L)
                .externalSource("STRAVA")
                .externalActivityId("67890")
                .sportType("RUN")
                .name("Evening Run")
                .startDate(LocalDateTime.of(2026, 7, 8, 18, 0))
                .distanceMeters(3218.688)
                .movingTimeSeconds(1800)
                .elapsedTimeSeconds(1850)
                .build();

        when(activityRepository.findAll())
                .thenReturn(List.of(activityOne, activityTwo));

        List<ActivityResponseRecord> response = activityService.getAllActivities();

        assertEquals(2, response.size());

        assertEquals(1L, response.get(0).id());
        assertEquals("STRAVA", response.get(0).externalSource());
        assertEquals("12345", response.get(0).externalActivityId());
        assertEquals("RUN", response.get(0).sportType());
        assertEquals("Morning Run", response.get(0).name());
        assertEquals(5.0, response.get(0).distanceMiles());
        assertEquals(40, response.get(0).movingTimeMinutes());
        assertEquals("8:00", response.get(0).pacePerMile());

        assertEquals(2L, response.get(1).id());
        assertEquals("STRAVA", response.get(1).externalSource());
        assertEquals("67890", response.get(1).externalActivityId());
        assertEquals("RUN", response.get(1).sportType());
        assertEquals("Evening Run", response.get(1).name());
        assertEquals(2.0, response.get(1).distanceMiles());
        assertEquals(30, response.get(1).movingTimeMinutes());
        assertEquals("15:00", response.get(1).pacePerMile());

        verify(activityRepository).findAll();
    }
}
