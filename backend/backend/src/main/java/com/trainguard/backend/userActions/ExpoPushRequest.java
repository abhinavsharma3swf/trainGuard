package com.trainguard.backend.userActions;

import lombok.*;
import org.springframework.stereotype.Component;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Component
public class ExpoPushRequest {

    private String to;
    private String body;
    private String title;
    private String sound;
    private ExpoPushData data;
    private Integer badge;
}

record ExpoPushData(String route) {
}
