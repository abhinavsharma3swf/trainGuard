package com.trainguard.backend.userActions;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotificationTokenRecord (
        @NotBlank @Size(max = 512) String notificationToken
){
}
