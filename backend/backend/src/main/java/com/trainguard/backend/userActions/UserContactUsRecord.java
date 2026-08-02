package com.trainguard.backend.userActions;

public record UserContactUsRecord(
        String email,
        String name,
        String category,
        String message
) {
}
