package com.trainguard.backend.deletion;

import com.trainguard.backend.session.SessionService;
import com.trainguard.backend.strava.StravaClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DeletingDataController.class)
public class DeletingDataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SessionService sessionService;

    @MockitoBean
    private DeletionService deletionService;

    @MockitoBean
    private StravaClient stravaClient;

    @MockitoBean
    private LocalDeletionService localDeletionService;

    @Test
    void shouldDeleteDataUserData() throws Exception {

        String token = "testToken";
        when(sessionService.getAthleteIdFromToken(token)).thenReturn(12345L);
        doNothing().when(deletionService).deleteUserAccount("12345");

        mockMvc.perform(delete("/api/deleteData").header("Authorization", "testToken"))
                .andExpect(status().isOk());
    }
}
