package com.trainguard.backend.recovery;


import com.trainguard.backend.session.SessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RecoveryCheckinController.class)
class RecoveryCheckinControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private RecoveryCheckinService recoveryCheckinService;

    @MockitoBean
    private SessionService sessionService;

    @Test
    void shouldCreateRecoveryCheckin() throws Exception {
        RecoveryCheckinRequestRecord request = RecoveryCheckinRequestRecord.builder()
                .activityId(1L)
                .rpe(4)
                .painScore(0)
                .painLocation("hip")
                .mood("Good")
                .note("Felt fine")
                .sportType("Run")
                .build();

        RecoveryCheckinResponseRecord response = new RecoveryCheckinResponseRecord(
                1L,
                1L,
                4,
                0,
                "hip",
                "Good",
                "Felt fine",
                "Run",
                LocalDateTime.of(2026, 7, 7, 8, 0)
        );

        when(sessionService.getAthleteIdFromAuthorizationHeader("Bearer test-token"))
                .thenReturn(1L);

        when(recoveryCheckinService.saveCheckin(
                eq(1L),
                any(RecoveryCheckinRequestRecord.class)
        )).thenReturn(response);

        mockMvc.perform(post("/api/recovery-checkins")
                        .header("Authorization", "Bearer test-token")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.activityId").value(1))
                .andExpect(jsonPath("$.rpe").value(4))
                .andExpect(jsonPath("$.painScore").value(0))
                .andExpect(jsonPath("$.painLocation").value("hip"))
                .andExpect(jsonPath("$.mood").value("Good"))
                .andExpect(jsonPath("$.note").value("Felt fine"))
                .andExpect(jsonPath("$.sportType").value("Run"));

        verify(sessionService).getAthleteIdFromAuthorizationHeader("Bearer test-token");

        verify(recoveryCheckinService).saveCheckin(
                eq(1L),
                any(RecoveryCheckinRequestRecord.class)
        );
    }


    @Test
    void shouldReturnTheListOfRecoveryCheckins() throws Exception {
        RecoveryCheckinResponseRecord response = new RecoveryCheckinResponseRecord(
                1L,
                1L,
                4,
                0,
                "hip",
                "Good",
                "Felt fine",
                "Run",
                LocalDateTime.of(2026, 7, 7, 8, 0)
        );

        RecoveryCheckinResponseRecord response1 = new RecoveryCheckinResponseRecord(
                2L,
                1L,
                4,
                0,
                "Knee",
                "Low",
                "Okay",
                "Run",
                LocalDateTime.of(2026, 7, 8, 8, 0)
        );

        when(sessionService.getAthleteIdFromAuthorizationHeader("Bearer test-token"))
                .thenReturn(1L);


        when(recoveryCheckinService.getAllRecoveryCheckin(1L, 0, 20)).thenReturn(List.of(response, response1));
        mockMvc.perform(get("/api/recovery-checkins")
                        .header("Authorization", "Bearer test-token")
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].activityId").value(1))
                .andExpect(jsonPath("$[0].rpe").value(4))
                .andExpect(jsonPath("$[0].painScore").value(0))
                .andExpect(jsonPath("$[0].painLocation").value("hip"))
                .andExpect(jsonPath("$[0].mood").value("Good"))
                .andExpect(jsonPath("$[0].note").value("Felt fine"))
                .andExpect(jsonPath("$[0].sportType").value("Run"))

                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].activityId").value(1))
                .andExpect(jsonPath("$[1].rpe").value(4))
                .andExpect(jsonPath("$[1].painScore").value(0))
                .andExpect(jsonPath("$[1].painLocation").value("Knee"))
                .andExpect(jsonPath("$[1].mood").value("Low"))
                .andExpect(jsonPath("$[1].note").value("Okay"))
                .andExpect(jsonPath("$[1].sportType").value("Run"));
        verify(recoveryCheckinService).getAllRecoveryCheckin(1L, 0, 20);

    }
}