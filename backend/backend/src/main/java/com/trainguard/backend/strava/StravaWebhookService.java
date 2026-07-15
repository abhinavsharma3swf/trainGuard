package com.trainguard.backend.strava;

import com.trainguard.backend.activity.ActivityResponseRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StravaWebhookService {

    private final StravaService stravaService;

    public void handleWebhookEvent(StravaWebhookEventRecord event) {
        if (!"activity".equals(event.objectType())) {
            return;
        }
        switch (event.aspectType()) {
            case "create" -> stravaService.importSingleActivityFromWebhook(
                    event.ownerId(),
                    event.objectId()
            );

            case "update" -> stravaService.updateSingleActivityFromWebhook(
                    event.ownerId(),
                    event.objectId()
            );

            case "delete" -> stravaService.deleteSingleActivityFromWebhook(
                    event.ownerId(),
                    event.objectId()
            );
            default -> System.out.println("Unhandled webhook event: " + event);

//        ActivityResponseRecord response = stravaService.importSingleActivityFromWebhook(
//                event.ownerId(),
//                event.objectId()
//        );

//        System.out.println(response + "response");
        }
    }
}
