package com.trainguard.backend.userActions;

import com.trainguard.backend.strava.StravaUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserNotificationTokenRepository extends JpaRepository<UserNotificationTokenEntity, Long> {

//    boolean existsByStravaUserAndNotificationToken(StravaUserEntity stravaUser, String notificationToken);

    Optional<UserNotificationTokenEntity> findByStravaUserAndNotificationToken(StravaUserEntity stravaUser, String notificationToken);
}
