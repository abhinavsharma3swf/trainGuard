package com.trainguard.backend.strava;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StravaWebhookService {

    private static final Logger log =
            LoggerFactory.getLogger(StravaWebhookService.class);

    private final StravaService stravaService;

    @Async("webhookExecutor")
    public void handleWebhookEvent(StravaWebhookEventRecord event) {
        if (!isValidEvent(event)) {
            log.warn("Ignoring invalid Strava webhook event");
            return;
        }

        if (!"activity".equalsIgnoreCase(event.objectType())) {
            log.debug(
                    "Ignoring unsupported Strava webhook object type: {}",
                    event.objectType()
            );
            return;
        }

        try {
            switch (event.aspectType().toLowerCase()) {
                case "create" ->
                        stravaService.importSingleActivityFromWebhook(
                                event.ownerId(),
                                event.objectId()
                        );

                case "update" ->
                        stravaService.updateSingleActivityFromWebhook(
                                event.ownerId(),
                                event.objectId()
                        );

                case "delete" ->
                        stravaService.deleteSingleActivityFromWebhook(
                                event.ownerId(),
                                event.objectId()
                        );

                default -> log.debug(
                        "Ignoring unsupported webhook aspect type: {}",
                        event.aspectType()
                );
            }
        } catch (IllegalArgumentException exception) {
            log.warn(
                    "Could not process Strava webhook event. "
                            + "ownerId={}, objectId={}, aspectType={}",
                    event.ownerId(),
                    event.objectId(),
                    event.aspectType(),
                    exception
            );
        } catch (Exception exception) {
            log.error(
                    "Unexpected failure processing Strava webhook event. "
                            + "ownerId={}, objectId={}, aspectType={}",
                    event.ownerId(),
                    event.objectId(),
                    event.aspectType(),
                    exception
            );
        }
    }

    private boolean isValidEvent(StravaWebhookEventRecord event) {
        return event != null
                && event.objectType() != null
                && event.aspectType() != null
                && event.ownerId() != null
                && event.objectId() != null;
    }
}