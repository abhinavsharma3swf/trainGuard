package com.trainguard.backend.analysis;

import com.trainguard.backend.session.SessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnalysisController.class)
public class AnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SessionService sessionService;

    @MockitoBean
    private AnalysisService analysisService;

    @Test
    void shouldGetTheActivitiesForAnalysis() throws Exception {

        AnalysisFeedRecord analysisFeedRecord = AnalysisFeedRecord.builder()
                .trainingLoad(100)
                .averageRpe(2.3)
                .averagePainScore(4.5)
                .build();

        when(sessionService.getAthleteIdFromAuthorizationHeader("testToken")).thenReturn(12345L);
        when(analysisService.getAnalysisInformation(12345L, 7)).thenReturn(analysisFeedRecord);

        mockMvc.perform(get("/api/analysis/7").header("Authorization", "testToken"))
                .andExpect(status().isOk());
        verify(sessionService).getAthleteIdFromAuthorizationHeader("testToken");

        verify(analysisService).getAnalysisInformation(12345L, 7);
    }
}
