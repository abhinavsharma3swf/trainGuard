package com.trainguard.backend.cleanup;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.scheduling.annotation.Scheduled;

@RequiredArgsConstructor
@ConfigurationProperties(prefix = "activity.cleanup")
public class ActivityCleanupScheduler {

    private final ActivityCleanupService cleanupService;

    @Scheduled(cron = "0 35 7 * * *", zone = "America/Chicago")
    public void deleteExpiredActivities() {
        cleanupService.deleteActivitiesOlderThanSevenDays();
    }
}