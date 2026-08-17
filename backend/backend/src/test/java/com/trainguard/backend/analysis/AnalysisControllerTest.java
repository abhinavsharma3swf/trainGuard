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

        AnalysisForCurrentSevenDays analysisForCurrentSevenDays = AnalysisForCurrentSevenDays.builder().build();
        AnalysisRecordForSevenDaysComparison analysisRecordForSevenDaysComparison = AnalysisRecordForSevenDaysComparison.builder().build();
        AnalysisFeedRecord analysisFeedRecordAsResponse = AnalysisFeedRecord.builder()
                .analysisForCurrentSevenDays(analysisForCurrentSevenDays)
                .analysisRecordForSevenDaysComparison(analysisRecordForSevenDaysComparison)
                .build();

        when(sessionService.getAthleteIdFromAuthorizationHeader("testToken")).thenReturn(12345L);
        when(analysisService.getAnalysisInformation(12345L, 7)).thenReturn(analysisFeedRecordAsResponse);

        mockMvc.perform(get("/api/analysis/7").header("Authorization", "testToken"))
                .andExpect(status().isOk());
        verify(sessionService).getAthleteIdFromAuthorizationHeader("testToken");

        verify(analysisService).getAnalysisInformation(12345L, 7);
    }

    @Test
    void shouldReturnAMessageBasedOnTheAnalysisInformation() throws Exception {
        String expectedMessage = "Analysis Information";

        when(sessionService.getAthleteIdFromAuthorizationHeader("testToken")).thenReturn(12345L);
        when(analysisService.getAnalysisMessage(12345L, 7)).thenReturn(expectedMessage);
        mockMvc.perform(get("/api/analysis/message/7").header("Authorization", "testToken"))
                .andExpect(status().isOk());
        verify(sessionService).getAthleteIdFromAuthorizationHeader("testToken");
        verify(analysisService).getAnalysisMessage(12345L, 7);
    }
}
