package com.trainguard.backend.activity;


import org.springframework.stereotype.Service;

@Service
public class ActivityMetricService {

    public Double convertMetersToMiles(Double meters) {
        if (meters == null || meters < 0) {
            return null;
        }
        double METERS_PER_MILE = 1609.34;
        double miles = meters / METERS_PER_MILE;
        return Math.round(miles * 100.0) / 100.0;
    }

    public Integer convertSecondsToMinutes(Integer seconds) {
        if (seconds == null || seconds < 0) {
            return null;
        }
        return seconds / 60;
    }

    public String calculatePacePerMinuteMile(Double miles, Integer movingTimeInSeconds) {
        if (miles == null || miles <= 0 || movingTimeInSeconds == null || movingTimeInSeconds < 0) {
            return null;
        }
        int totalSecondsPerMile = (int) Math.round(movingTimeInSeconds / miles);

        int minutes = totalSecondsPerMile / 60;
        int seconds = totalSecondsPerMile % 60;

        return String.format("%d:%02d", minutes, seconds);
    }
}
