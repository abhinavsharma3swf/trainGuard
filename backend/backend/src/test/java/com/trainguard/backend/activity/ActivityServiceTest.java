package com.trainguard.backend.activity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
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
}
