package com.trainguard.backend.strava;


import com.trainguard.backend.activity.ActivityResponseRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/strava")
@RequiredArgsConstructor
public class StravaController {

    private final StravaService stravaService;

    @PostMapping("/sync")
    public List<ActivityResponseRecord> syncLastSevenActivities() {
        return stravaService.syncLastSevenActivities();
    }

}
