package com.trainguard.backend.recovery;

import com.trainguard.backend.activity.ActivityEntity;
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

    @ManyToOne(optional = false)
    @JoinColumn(name = "activity_id")
    private ActivityEntity activity;

    private Integer rpe;

    private Integer painScore;

    private String painLocation;

    private String mood;

    private String note;

    private String sportType;

//    private Integer activityDuration;

    //Temporary id for the strava activity
    private Long activityId;

    private LocalDateTime createdAt;

}