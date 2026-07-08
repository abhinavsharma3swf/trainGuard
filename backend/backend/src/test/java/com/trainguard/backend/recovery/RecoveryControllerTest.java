package com.trainguard.backend.recovery;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;


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

    @Test
    void shouldCreateRecoveryCheckin() throws Exception {
        RecoveryCheckinRequestRecord request = RecoveryCheckinRequestRecord.builder()
                .activityId(1L)
                .rpe(4)
                .painScore(0)
                .painLocation("hip")
                .mood("Good")
                .note("Felt fine")
                .build();

        RecoveryCheckinResponseRecord response = new RecoveryCheckinResponseRecord(
                1L,
                1L,
                4,
                0,
                "hip",
                "Good",
                "Felt fine",
                LocalDateTime.of(2026, 7, 7, 8, 0)
        );

        when(recoveryCheckinService.saveCheckin(any(RecoveryCheckinRequestRecord.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/recovery-checkins")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.activityId").value(1))
                .andExpect(jsonPath("$.rpe").value(4))
                .andExpect(jsonPath("$.painScore").value(0))
                .andExpect(jsonPath("$.painLocation").value("hip"))
                .andExpect(jsonPath("$.mood").value("Good"))
                .andExpect(jsonPath("$.note").value("Felt fine"));

        verify(recoveryCheckinService).saveCheckin(any(RecoveryCheckinRequestRecord.class));
    }
}