package com.trainguard.backend.strava;

import com.trainguard.backend.activity.ActivityResponseRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StravaWebhookService {

    private final StravaService stravaService;

    public void handleWebhookEvent(StravaWebhookEventRecord event){
        if(!"activity".equals(event.objectType())){
            return;
        }
        if(!"create".equals(event.aspectType())){
            return;
        }

        ActivityResponseRecord response = stravaService.importSingleActivityFromWebhook(
                event.ownerId(),
                event.objectId()
        );

        System.out.println(response + "response");
    }
}
