package com.trainguard.backend.cleanup;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

//@Component
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "activity.cleanup")
public class ActivityCleanupScheduler {

    private final ActivityCleanupService cleanupService;

    @Scheduled(cron = "0 53 19 * * *", zone = "America/Chicago")
    public void deleteExpiredActivities() {
        cleanupService.deleteActivitiesOlderThanSevenDays();
    }
}