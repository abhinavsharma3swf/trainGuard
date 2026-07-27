package com.trainguard.backend.activity;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ActivityController.class)
public class ActivityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ActivityService activityService;

    @Test
    void shouldImportActivity() throws Exception {
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

        ActivityResponseRecord response = new ActivityResponseRecord(
                1L,
                "STRAVA",
                "12345",
                "RUN",
                "Morning Run",
                LocalDateTime.of(2026, 7, 7, 6, 30),
                5.0,
                40,
                "8:00",
                24.5,
                "I am description"
        );

        when(activityService.importActivity(any(ActivityImportRequestRecord.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/activities/import")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.externalSource").value("STRAVA"))
                .andExpect(jsonPath("$.externalActivityId").value("12345"))
                .andExpect(jsonPath("$.sportType").value("RUN"))
                .andExpect(jsonPath("$.name").value("Morning Run"))
                .andExpect(jsonPath("$.distanceMiles").value(5.0))
                .andExpect(jsonPath("$.movingTimeMinutes").value(40))
                .andExpect(jsonPath("$.pacePerMile").value("8:00"));

        verify(activityService).importActivity(any(ActivityImportRequestRecord.class));
    }

    @Test
    void shouldGetAllActivities() throws Exception {

        ActivityResponseRecord activityOne = new ActivityResponseRecord(
                1L,
                "STRAVA",
                "12345",
                "RUN",
                "Morning Run",
                LocalDateTime.of(2026, 7, 7, 6, 30),
                5.0,
                40,
                "8:00",
                24.5,
                "I am description"
        );

        ActivityResponseRecord activityTwo = new ActivityResponseRecord(
                2L,
                "STRAVA",
                "67890",
                "RIDE",
                "Endurance Ride",
                LocalDateTime.of(2026, 7, 8, 7, 0),
                25.0,
                90,
                "3:36",
                24.5,
                "I am description"
        );

        when(activityService.getAllActivities()).thenReturn(List.of(activityOne, activityTwo));
       mockMvc.perform(get("/api/activities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))

                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].externalSource").value("STRAVA"))
                .andExpect(jsonPath("$[0].externalActivityId").value("12345"))
                .andExpect(jsonPath("$[0].sportType").value("RUN"))
                .andExpect(jsonPath("$[0].name").value("Morning Run"))
                .andExpect(jsonPath("$[0].distanceMiles").value(5.0))
                .andExpect(jsonPath("$[0].movingTimeMinutes").value(40))
                .andExpect(jsonPath("$[0].pacePerMile").value("8:00"))

                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].externalSource").value("STRAVA"))
                .andExpect(jsonPath("$[1].externalActivityId").value("67890"))
                .andExpect(jsonPath("$[1].sportType").value("RIDE"))
                .andExpect(jsonPath("$[1].name").value("Endurance Ride"))
                .andExpect(jsonPath("$[1].distanceMiles").value(25.0))
                .andExpect(jsonPath("$[1].movingTimeMinutes").value(90))
                .andExpect(jsonPath("$[1].pacePerMile").value("3:36"));

        verify(activityService).getAllActivities();
    }

}
