package com.trainguard.backend.dashboard;

import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard/feed")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    private final SessionService sessionService;

    @GetMapping
    public List<DashboardFeedRecord> getDashboardFeedRecord(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "50") @Min(1) @Max(100) int size
    ) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        return dashboardService.getAllActivitiesForDashboard(athleteId, page, size);
    }

}
