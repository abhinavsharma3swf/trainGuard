package com.trainguard.backend.userActions;


import com.trainguard.backend.strava.StravaUserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="user_notification_token_table")
public class UserNotificationTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String notificationToken;

    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "athlete_id", nullable = false)
    private StravaUserEntity stravaUser;

}
