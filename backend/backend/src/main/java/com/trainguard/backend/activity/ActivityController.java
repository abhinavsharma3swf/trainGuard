package com.trainguard.backend.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/import")
    public ActivityResponseRecord importActivity(@RequestBody ActivityImportRequestRecord requestRecord) {
        return activityService.importActivity(requestRecord);
    }

    @GetMapping()
    public List<ActivityResponseRecord> getAllActivities() {
        return activityService.getAllActivities();
    }
}
