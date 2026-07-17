package com.trainguard.backend.cleanup;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActivityCleanupScheduler {

    private final ActivityCleanupService cleanupService;

    @Scheduled(cron = "0 45 20 * * *", zone = "America/Chicago")
    public void deleteExpiredActivities() {
        System.out.println("Activity cleanup scheduler started");

        cleanupService.deleteActivitiesOlderThanSevenDays();

        System.out.println("Activity cleanup scheduler finished");
    }
}