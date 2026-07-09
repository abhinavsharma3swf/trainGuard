package com.trainguard.backend.strava;


import com.trainguard.backend.activity.ActivityResponseRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/strava")
@RequiredArgsConstructor
public class StravaController {

    private final StravaService stravaService;

    @PostMapping("/sync/{athleteId}")
    public List<ActivityResponseRecord> syncLastSevenActivities(@PathVariable Long athleteId) {
        return stravaService.syncLastSevenActivities(athleteId);
    }

    @GetMapping("/authorization-url")
    public String getAuthorizationUrl() {
        return stravaService.getAuthorizationUrl();
    }

}
