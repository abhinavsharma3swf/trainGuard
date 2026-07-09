package com.trainguard.backend.strava;

import com.trainguard.backend.activity.ActivityImportRequestRecord;
import com.trainguard.backend.activity.ActivityResponseRecord;
import com.trainguard.backend.activity.ActivityService;
import com.trainguard.backend.strava.StravaClient;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StravaServiceTest {

    @Mock
    private StravaClient stravaClient;
    @Mock
    private ActivityService activityService;

//    @Mock
//    private ActivityService activityService;

    @InjectMocks
    private StravaService stravaService;

    @Test
    void shouldSyncLastSevenStravaActivities() {

        StravaActivityResponseRecord stravaActivity = new StravaActivityResponseRecord(
                12345L,
                "Morning Run",
                "Run",
                LocalDateTime.of(2026, 7, 9, 8, 0),
                8046.72,
                2400,
                2500,
                50.0,
                145.0,
                170.0,
                null,
                null
        );

        ActivityResponseRecord importedActivity = new ActivityResponseRecord(
                1L,
                "STRAVA",
                "12345",
                "RUN",
                "Morning Run",
                LocalDateTime.of(2026, 7, 9, 8, 0),
                5.0,
                40,
                "8:00"
        );

        when(stravaClient.fetchLastSevenActivities()).thenReturn(List.of(stravaActivity));

        when(activityService.importActivity(any(ActivityImportRequestRecord.class)))
                .thenReturn(importedActivity);

        List<ActivityResponseRecord> result =
                stravaService.syncLastSevenActivities();

        assertEquals(1, result.size());

        ActivityResponseRecord response = result.get(0);

        assertEquals(1L, response.id());
        assertEquals("STRAVA", response.externalSource());
        assertEquals("12345", response.externalActivityId());
        assertEquals("RUN", response.sportType());
        assertEquals("Morning Run", response.name());
        assertEquals(5.0, response.distanceMiles());
        assertEquals(40, response.movingTimeMinutes());
        assertEquals("8:00", response.pacePerMile());

        verify(stravaClient).fetchLastSevenActivities();
        verify(activityService).importActivity(any(ActivityImportRequestRecord.class));
    }

    @Test
    void shouldConvertStravaActivityToActivityImportRequest() {
        StravaActivityResponseRecord stravaActivity = new StravaActivityResponseRecord(
                12345L,
                "Morning Run",
                "Run",
                LocalDateTime.of(2026, 7, 9, 8, 0),
                8046.72,
                2400,
                2500,
                50.0,
                145.0,
                170.0,
                null,
                null
        );

        ActivityResponseRecord importedActivity = new ActivityResponseRecord(
                1L,
                "STRAVA",
                "12345",
                "RUN",
                "Morning Run",
                LocalDateTime.of(2026, 7, 9, 8, 0),
                5.0,
                40,
                "8:00"
        );

        when(stravaClient.fetchLastSevenActivities()).thenReturn(List.of(stravaActivity));

        when(activityService.importActivity(any(ActivityImportRequestRecord.class)))
                .thenReturn(importedActivity);

        stravaService.syncLastSevenActivities();

        ArgumentCaptor<ActivityImportRequestRecord> captor = ArgumentCaptor.forClass(ActivityImportRequestRecord.class);

        verify(activityService).importActivity(captor.capture());

        ActivityImportRequestRecord request = captor.getValue();

        assertEquals("STRAVA", request.externalSource());
        assertEquals("12345", request.externalActivityId());
        assertEquals("RUN", request.sportType());
        assertEquals("Morning Run", request.name());
        assertEquals(LocalDateTime.of(2026, 7, 9, 8, 0), request.startDate());
        assertEquals(8046.72, request.distanceMeters());
        assertEquals(2400, request.movingTimeSeconds());
//        assertEquals(2500, request.elapsedTimeSeconds());
//        assertEquals(50.0, request.totalElevationGain());assertEquals(145.0, request.averageHeartbeat());
////        assertEquals(170.0, request.maxHeartbeat());
//
        assertNull(request.averageWatts());
        assertNull(request.weightedAverageWatts());
    }
}