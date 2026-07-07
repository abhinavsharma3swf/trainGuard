package com.trainguard.backend.activity;


import org.springframework.stereotype.Service;

@Service
public class ActivityMetricService {

    public double convertMetersToMiles(double meters) {
        double METERS_PER_MILE = 1609.34;
        double miles =  meters / METERS_PER_MILE;
        return Math.round(miles * 100.0) / 100.0;
    }

    public int convertSecondsToMinutes(int seconds) {
        return seconds / 60;
    }

    public String calculatePacePerMinuteMile(double miles, int movingTimeInSeconds) {
        int totalSecondsPerMile = (int) Math.round(movingTimeInSeconds / miles);

        int minutes = totalSecondsPerMile / 60;
        int seconds = totalSecondsPerMile % 60;

        return String.format("%d:%02d", minutes, seconds);
    }
}
