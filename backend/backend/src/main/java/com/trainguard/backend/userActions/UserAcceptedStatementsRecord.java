package com.trainguard.backend.userActions;

public record UserAcceptedStatementsRecord(
        boolean checkboxState,
        boolean checkboxStateForBeta,
        String createdAt
){}