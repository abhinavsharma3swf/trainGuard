package com.trainguard.backend.strava;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "strava_users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StravaUserEntity {

    @Id
    private Long athleteId;

    private String firstname;
    private String lastname;

    @Column(nullable = false, length = 1000)
    private String refreshToken;

    private LocalDateTime connectedAt;
    private LocalDateTime updatedAt;
}