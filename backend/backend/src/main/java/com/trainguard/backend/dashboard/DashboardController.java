package com.trainguard.backend.dashboard;

import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/feed")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    private final SessionService sessionService;

//    @GetMapping("/{athleteId}")
//    public List<DashboardFeedRecord> getDashboardFeedRecord(@PathVariable Long athleteId) {
//        return dashboardService.getAllActivitiesForDashboard(athleteId);
//    }


    @GetMapping
    public List<DashboardFeedRecord> getDashboardFeedRecord(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        String token = authorizationHeader.replace("Bearer ", "");
        Long athleteId = sessionService.getAthleteIdFromToken(token);

        return dashboardService.getAllActivitiesForDashboard(athleteId);
    }

}
