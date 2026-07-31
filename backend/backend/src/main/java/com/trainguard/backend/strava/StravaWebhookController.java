package com.trainguard.backend.strava;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/strava/webhook")
@RequiredArgsConstructor
public class StravaWebhookController {

    private final StravaWebhookProperties stravaWebhookProperties;
    private final StravaWebhookService  stravaWebhookService;

    @GetMapping
    public ResponseEntity<StravaWebhookVerificationResponse> verifyWebHook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.challenge") String challenge,
            @RequestParam("hub.verify_token") String verifyToken
    ) {
        if(!"subscribe".equals(mode)) {
            return ResponseEntity.badRequest().build();
        }

        if(!stravaWebhookProperties.verifyToken().equals(verifyToken)){
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(new StravaWebhookVerificationResponse(challenge));
    }

    @PostMapping
    public ResponseEntity<Void> receiveWebhookEvent(
            @RequestBody StravaWebhookEventRecord event
    ){
        stravaWebhookService.handleWebhookEvent(event);
        return ResponseEntity.ok().build();
    }
}
