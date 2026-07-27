package com.trainguard.backend;

import com.trainguard.backend.cleanup.ActivityCleanupScheduler;
import com.trainguard.backend.strava.StravaProperties;
import com.trainguard.backend.strava.StravaWebhookProperties;
import com.trainguard.backend.strava.TrainGuardProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync //This allows tasks to run in the background//
@EnableConfigurationProperties({StravaProperties.class,
        TrainGuardProperties.class,
        StravaWebhookProperties.class})
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}
