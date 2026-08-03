package com.trainguard.backend.userActions;

import com.trainguard.backend.strava.StravaUserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user_agreement_acceptance_table")
public class UserAgreementsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
            @JoinColumn(name = "athlete_id", nullable = false)
            private StravaUserEntity stravaUser;

    private boolean checkboxState;
    private boolean checkboxStateForBeta;
    private String acceptedAt;
}
