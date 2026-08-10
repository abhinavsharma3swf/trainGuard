package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
import com.trainguard.backend.strava.StravaUserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

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

    private List<Integer> painLocationEnum;

    private String mood;

    private String note;

    private String sportType;

    private Instant createdAt;

    private Integer temperature;

    private Integer feelsLikeTemperature;

    private Integer humidity;

    private Integer windSpeed;

    private Integer dewPoint;

}