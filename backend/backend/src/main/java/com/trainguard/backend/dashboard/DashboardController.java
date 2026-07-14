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

    @GetMapping
    public List<DashboardFeedRecord> getDashboardFeedRecord(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        return dashboardService.getAllActivitiesForDashboard(athleteId);
    }

}
