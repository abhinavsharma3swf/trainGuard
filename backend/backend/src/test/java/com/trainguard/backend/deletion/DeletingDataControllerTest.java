package com.trainguard.backend.deletion;

import com.trainguard.backend.session.SessionService;
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
    private com.trainguard.backend.deletion.LocalDeletionService localDeletionService;
    @MockitoBean
    private com.trainguard.backend.deletion.DeletionService deletionService;

    @Test
    void shouldDeleteDataUserData() throws Exception {

        String token = "testToken";
        when(sessionService.getAthleteIdFromAuthorizationHeader(token)).thenReturn(12345L);
        doNothing().when(localDeletionService).deleteLocalAccount(12345L);

        mockMvc.perform(delete("/api/deleteData").header("Authorization", "testToken"))
                .andExpect(status().isOk());
    }
}
