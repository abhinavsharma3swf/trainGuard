package com.trainguard.backend.cleanup;

import lombok.RequiredArgsConstructor;
import com.trainguard.backend.session.SessionRepository;
import java.time.LocalDateTime;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ActivityCleanupScheduler {

    private final ActivityCleanupService cleanupService;
    private final SessionRepository sessionRepository;

    @Scheduled(cron = "0 0 02 * * *", zone = "America/Chicago")
    public void deleteExpiredActivities() {
        System.out.println("Activity cleanup scheduler started");

        cleanupService.deleteActivitiesOlderThanSevenDays();
        sessionRepository.deleteAllByExpiresAtBefore(LocalDateTime.now());

        System.out.println("Activity cleanup scheduler finished");
    }
}