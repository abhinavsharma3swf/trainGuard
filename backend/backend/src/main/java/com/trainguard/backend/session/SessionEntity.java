package com.trainguard.backend.session;

import com.trainguard.backend.strava.StravaUserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "smart_gauge_sessions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionEntity {

    @Id
    private String token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "athlete_id", nullable = false)
    private StravaUserEntity stravaUser;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;
}