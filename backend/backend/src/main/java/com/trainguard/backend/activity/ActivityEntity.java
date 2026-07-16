package com.trainguard.backend.activity;

import com.trainguard.backend.recovery.RecoveryCheckinEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(
            mappedBy = "activity",
            cascade = CascadeType.DETACH
    )
    @Builder.Default
    private List<RecoveryCheckinEntity> recoveryCheckins = new ArrayList<>();
}
