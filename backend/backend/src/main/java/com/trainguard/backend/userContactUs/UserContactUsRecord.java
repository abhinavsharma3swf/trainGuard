package com.trainguard.backend.userContactUs;

public record UserContactUsRecord(
        String email,
        String name,
        String category,
        String message
) {
}
