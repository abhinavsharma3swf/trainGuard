package com.trainguard.backend.activity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "activities")
public class ActivityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String externalSource;

    private String externalActivityId;

    private String sportType;

    private String name;

    private LocalDateTime startDate;

    private Double distanceMeters;

    private Integer movingTimeSeconds;

    private Integer elapsedTimeSeconds;

    private Double totalElevationGain;

    private Double averageHeartbeat;

    private Double maxHeartbeat;

    private Double averageWatts;

    private Double weightedAverageWatts;

    private LocalDateTime importedAt;

    private Long athleteId;
}
