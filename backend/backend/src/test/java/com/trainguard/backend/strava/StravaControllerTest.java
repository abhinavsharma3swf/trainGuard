package com.trainguard.backend.strava;

import com.trainguard.backend.activity.ActivityResponseRecord;
import com.trainguard.backend.session.SessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;


import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StravaController.class)
public class StravaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StravaService stravaService;

    @MockitoBean
    private SessionService sessionService;

    @Test
    void shouldSyncStravaActivities() throws Exception {
        ActivityResponseRecord activityResponse = new ActivityResponseRecord(
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

        when(sessionService.getAthleteIdFromToken("testToken")).thenReturn(12345L);
        when(stravaService.syncLastSevenActivities(12345L))
                .thenReturn(List.of(activityResponse));

        mockMvc.perform(post("/api/strava/sync").header("Authorization", "testToken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].externalSource").value("STRAVA"))
                .andExpect(jsonPath("$[0].externalActivityId").value("12345"))
                .andExpect(jsonPath("$[0].sportType").value("RUN"))
                .andExpect(jsonPath("$[0].name").value("Morning Run"))
                .andExpect(jsonPath("$[0].distanceMiles").value(5.0))
                .andExpect(jsonPath("$[0].movingTimeMinutes").value(40))
                .andExpect(jsonPath("$[0].pacePerMile").value("8:00"));

        verify(stravaService).syncLastSevenActivities(12345L);
    }

    @Test
    void shouldReturnStravaAuthorizationUrl() throws Exception {
        String authorizationUrl = "https://www.strava.com/oauth/authorize?client_id=12345";

        when(stravaService.getAuthorizationUrl()).thenReturn(authorizationUrl);
        mockMvc.perform(get("/api/strava/authorization-url"))
                        .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(authorizationUrl));
        verify(stravaService).getAuthorizationUrl();
    }
}
