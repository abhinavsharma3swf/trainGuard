package com.trainguard.backend.strava;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;



@WebMvcTest(StravaWebhookController.class)
public class StravaWebhookControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    private StravaWebhookProperties stravaWebhookProperties;

    @Test
    void shouldVerifyWebhookSubscription () throws Exception {
        when(stravaWebhookProperties.verifyToken()).thenReturn("test-token");

        mockMvc.perform(get("/api/strava/webhook")
                .param("hub.mode", "subscribe")
                .param("hub.challenge", "challenge-value")
                .param("hub.verify_token", "test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.['hub.challenge']").value("challenge-value"));
    }

    @Test
    void shouldRejectInvalidVerifyToken() throws Exception {
        when(stravaWebhookProperties.verifyToken())
                .thenReturn("test-token");

        mockMvc.perform(get("/api/strava/webhook")
                        .param("hub.mode", "subscribe")
                        .param("hub.challenge", "challenge-value")
                        .param("hub.verify_token", "wrong-token"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReceiveWebhookEvent() throws Exception {
        String body = """
                {
                  "aspect_type": "create",
                  "event_time": 1710000000,
                  "object_id": 123456789,
                  "object_type": "activity",
                  "owner_id": 987654321,
                  "subscription_id": 111222333
                }
                """;

        mockMvc.perform(post("/api/strava/webhook")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isOk());
    }
}
