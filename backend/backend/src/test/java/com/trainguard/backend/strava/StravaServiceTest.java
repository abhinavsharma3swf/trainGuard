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
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Array;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StravaServiceTest {

    @Mock
    private StravaClient stravaClient;
    @Mock
    private ActivityService activityService;
    @Mock
    private StravaUserRepository stravaUserRepository;
        @Mock
        private com.trainguard.backend.userActions.UserNotificationTokenRepository userNotificationTokenRepository;
        @Mock
        private com.trainguard.backend.userActions.UserService userService;

    @InjectMocks
    private StravaService stravaService;

    @Test
    void shouldSyncLastSevenStravaActivities() {

        List<Double> start_latlng = List.of(123.5,323.55);
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
                new StravaAthleteSummaryRecord(12345L),
                "I am description",
                start_latlng

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
                "8:00",
                24.6,
                "I am description"

        );

        StravaUserEntity stravaUser = StravaUserEntity.builder()
                .athleteId(12345L)
                .refreshToken("refreshToken")
                .build();

        when(stravaUserRepository.findById(12345L))
                .thenReturn(Optional.of(stravaUser));

        when(stravaClient.refreshAccessToken("refreshToken"))
                .thenReturn(new StravaTokenResponseRecord("access-token", "refreshToken", 0L, null));

        when(stravaClient.fetchLastSevenActivities("access-token"))
                .thenReturn(List.of(stravaActivity));

        when(activityService.importActivity(any(ActivityImportRequestRecord.class)))
                .thenReturn(importedActivity);

        List<ActivityResponseRecord> result =
                stravaService.syncLastSevenActivities(12345L);

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

        verify(stravaUserRepository).findById(12345L);
        verify(stravaClient).fetchLastSevenActivities("access-token");
        verify(activityService).importActivity(any(ActivityImportRequestRecord.class));
    }

    @Test
    void shouldConvertStravaActivityToActivityImportRequest() {

        List<Double> start_latlng = List.of(123.5,323.55);
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
                new StravaAthleteSummaryRecord(12345L),
                "description",
                start_latlng
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
                "8:00",
                24.8,
                "description"
        );

        StravaUserEntity stravaUser = StravaUserEntity.builder()
                .athleteId(12345L)
                .refreshToken("ref")
                .build();

        when(stravaUserRepository.findById(12345L))
                .thenReturn(Optional.of(stravaUser));

        when(stravaClient.refreshAccessToken("ref"))
                .thenReturn(new StravaTokenResponseRecord("access-token-2", "ref", 0L, null));

        when(stravaClient.fetchLastSevenActivities("access-token-2"))
                .thenReturn(List.of(stravaActivity));

        when(activityService.importActivity(any(ActivityImportRequestRecord.class)))
                .thenReturn(importedActivity);

        stravaService.syncLastSevenActivities(12345L);

        ArgumentCaptor<ActivityImportRequestRecord> captor =
                ArgumentCaptor.forClass(ActivityImportRequestRecord.class);

        verify(activityService).importActivity(captor.capture());

        ActivityImportRequestRecord request = captor.getValue();

        assertEquals(12345L, request.athleteId());
        assertEquals("STRAVA", request.externalSource());
        assertEquals("12345", request.externalActivityId());
        assertEquals("RUN", request.sportType());
        assertEquals("Morning Run", request.name());
        assertEquals(LocalDateTime.of(2026, 7, 9, 8, 0), request.startDate());
        assertEquals(8046.72, request.distanceMeters());
        assertEquals(2400, request.movingTimeSeconds());
        assertEquals(2500, request.elapsedTimeSeconds());
        assertEquals(50.0, request.totalElevationGain());
        assertEquals(145.0, request.averageWatts());
        assertEquals(170.0, request.weightedAverageWatts());
    }

    @Test
    void shouldBuildStravaAuthorizationUrl() {
        StravaProperties stravaProperties = new StravaProperties(
                "12345",
                "Client-secret",
                "Refresh-token",
                "http://localhost:8080/api/strava/callback"
        );

        StravaService stravaService = new StravaService(
                stravaClient,
                activityService,
                stravaProperties,
                stravaUserRepository,
                userNotificationTokenRepository,
                userService
        );

        String authorizationUrl = stravaService.getAuthorizationUrl();

        assertTrue(authorizationUrl.startsWith("https://www.strava.com/oauth/authorize"));
        assertTrue(authorizationUrl.contains("client_id=12345"));
        assertTrue(authorizationUrl.contains("response_type=code"));
        assertTrue(authorizationUrl.contains("redirect_uri="));
        assertTrue(authorizationUrl.contains("localhost"));
        assertTrue(authorizationUrl.contains("callback"));
        assertTrue(authorizationUrl.contains("approval_prompt=force"));
        assertTrue(authorizationUrl.contains("scope="));
        assertTrue(authorizationUrl.contains("read"));
    }
}