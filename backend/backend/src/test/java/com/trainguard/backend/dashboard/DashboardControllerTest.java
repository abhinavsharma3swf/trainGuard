package com.trainguard.backend.dashboard;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
public class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DashboardService dashboardService;

    @Test
    void shouldGetTheActivitiesWithTheCheckinToDisplayOnTheDashboard() throws Exception {
        DashboardFeedRecord dashboardFeedRecord = DashboardFeedRecord.builder()
                .activityId(1L)
                .name("Morning Run")
                .sportType("RUN")
                .startDate(LocalDateTime.of(2026, 7, 7, 8, 0))
                .distanceMiles(5.0)
                .movingTimeMinutes(40)
                .pacePerMile("8:00")
                .checkinStatus("COMPLETED")
                .rpe(4)
                .painScore(0)
                .painLocation("hip")
                .mood("Good")
                .note("Felt fine")
                .build();

        when(dashboardService.getAllActivitiesForDashboard()).thenReturn(List.of(dashboardFeedRecord));

        mockMvc.perform(get("/api/dashboard/feed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].activityId").value(1))
                .andExpect(jsonPath("$[0].name").value("Morning Run"))
                .andExpect(jsonPath("$[0].sportType").value("RUN"))
                .andExpect(jsonPath("$[0].distanceMiles").value(5.0))
                .andExpect(jsonPath("$[0].movingTimeMinutes").value(40))
                .andExpect(jsonPath("$[0].pacePerMile").value("8:00"))
                .andExpect(jsonPath("$[0].checkinStatus").value("COMPLETED"))
                .andExpect(jsonPath("$[0].rpe").value(4))
                .andExpect(jsonPath("$[0].painScore").value(0))
                .andExpect(jsonPath("$[0].painLocation").value("hip"))
                .andExpect(jsonPath("$[0].mood").value("Good"))
                .andExpect(jsonPath("$[0].note").value("Felt fine"));

        verify(dashboardService).getAllActivitiesForDashboard();
    }
}
