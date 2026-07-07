package com.trainguard.backend.activity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ActivityMetricServiceTest {

    private final ActivityMetricService activityMetricService = new ActivityMetricService();

    @Test
    void shouldConvertMetersToMiles() {
        double result = activityMetricService.convertMetersToMiles(8046.72);
        assertEquals(5.0, result);
    }
}
