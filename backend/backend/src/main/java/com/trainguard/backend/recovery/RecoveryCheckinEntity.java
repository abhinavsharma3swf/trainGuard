package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.strava.StravaUserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_checkins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecoveryCheckinEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long athleteId;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = true)
    private ActivityEntity activity;

    private Integer rpe;

    private Integer painScore;

    private String painLocation;

    private String mood;

    private String note;

    private String sportType;

    private LocalDateTime createdAt;

    private Integer temperature;

    private Integer feelsLikeTemperature;

    private Integer humidity;

    private Integer windSpeed;

    private Integer dewPoint;

}