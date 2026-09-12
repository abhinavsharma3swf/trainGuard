package com.trainguard.backend.userActions;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserContactUsRecord(
        @NotBlank @Email @Size(max = 320) String email,
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Size(max = 100) String category,
        @NotBlank @Size(max = 5000) String message
) {
}
