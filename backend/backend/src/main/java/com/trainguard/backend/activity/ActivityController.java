package com.trainguard.backend.activity;

import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final SessionService sessionService;

    @PostMapping("/import")
    public ActivityResponseRecord importActivity(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody ActivityImportRequestRecord requestRecord
    ) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        return activityService.importActivityForAthlete(athleteId, requestRecord);
    }

    @GetMapping()
    public List<ActivityResponseRecord> getAllActivities(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "50") @Min(1) @Max(100) int size
    ) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        return activityService.getActivitiesForAthlete(athleteId, page, size);
    }
}
