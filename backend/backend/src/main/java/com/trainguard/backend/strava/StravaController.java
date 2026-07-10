package com.trainguard.backend.strava;


import com.trainguard.backend.activity.ActivityResponseRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/strava")
@RequiredArgsConstructor
public class StravaController {

    private final StravaService stravaService;

    private final TrainGuardProperties smartGaugeProperties;

    @PostMapping("/sync/{athleteId}")
    public List<ActivityResponseRecord> syncLastSevenActivities(@PathVariable Long athleteId) {
        return stravaService.syncLastSevenActivities(athleteId);
    }

    @GetMapping("/authorization-url")
    public String getAuthorizationUrl() {
        return stravaService.getAuthorizationUrl();
    }

//    @GetMapping("/callback")
//    public String handleCallback(@RequestParam String code) {
//        Long athleteId = stravaService.exchangeAuthorizationCode(code);
//
//        return """
//            Strava connected successfully.
//            Athlete ID: %s
//            You can return to Smart Gauge.
//            """.formatted(athleteId);
//    }

//    @GetMapping("/callback")
//    public ResponseEntity<Void> handleCallback(@RequestParam String code) {
//        Long athleteId = stravaService.exchangeAuthorizationCode(code);
//
//        URI redirectUri = URI.create(
//                "smartgauge://strava-connected?athleteId=" + athleteId
//        );
//
//        return ResponseEntity
//                .status(HttpStatus.FOUND)
//                .location(redirectUri)
//                .build();
//    }

    //this one is to redirect it to the local environment//
    @GetMapping("/callback")
    public ResponseEntity<Void> handleCallback(@RequestParam String code) {
        Long athleteId = stravaService.exchangeAuthorizationCode(code);

        URI redirectUri = URI.create(
                smartGaugeProperties.appRedirectUri() + "?athleteId=" + athleteId
        );

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(redirectUri)
                .build();
    }

}
