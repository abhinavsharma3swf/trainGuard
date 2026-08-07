package com.trainguard.backend.userActions;


import com.trainguard.backend.activity.ActivityRepository;
import com.trainguard.backend.recovery.RecoveryCheckinEntity;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import com.trainguard.backend.session.SessionService;
import com.trainguard.backend.strava.StravaUserEntity;
import com.trainguard.backend.strava.StravaUserRepository;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Getter
@Setter
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserContactUsRepository userContactUsRepository;
    private final UserAgreementRepository userAgreementRepository;
    private final StravaUserRepository stravaUserRepository;
    private final SessionService sessionService;
    private final UserNotificationTokenRepository userNotificationTokenRepository;
//    private final ActivityRepository activityRepository;
//    private final RecoveryCheckinRepository recoveryCheckinRepository;


    public UserContactUsResponseRecord contactUsInformation(UserContactUsRecord contactUsRecord) {

        UserContactUsEntity userContactUsEntity = UserContactUsEntity.builder()
                .name(contactUsRecord.name())
                .email(contactUsRecord.email())
                .category(contactUsRecord.category())
                .message(contactUsRecord.message())
                .build();

        userContactUsRepository.save(userContactUsEntity);
        return new UserContactUsResponseRecord("Message Send Successfully");
    }

    public void privacyStatementsAndBeta(String authorizationHeader, UserAcceptedStatementsRecord userAcceptedStatementsRecord) {

        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);

        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId).orElseThrow(() ->
                new IllegalArgumentException("User Not Found")
        );

        userAgreementRepository.findByStravaUser_AthleteId(athleteId)
                .ifPresentOrElse(existingValue -> {
                            System.out.println("user has already accepted the agreements");
                        },
                        () -> {
                            UserAgreementsEntity userAgreementsEntity = UserAgreementsEntity.builder()
                                    .stravaUser(stravaUser)
                                    .checkboxState(userAcceptedStatementsRecord.checkboxState())
                                    .checkboxStateForBeta(userAcceptedStatementsRecord.checkboxStateForBeta())
                                    .acceptedAt(userAcceptedStatementsRecord.createdAt())
                                    .build();
                            userAgreementRepository.save(userAgreementsEntity);

                        });
    }


    public void notificationToken(String authorizationHeader, String notificationToken) {

        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);

        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId).orElseThrow(() ->
                new IllegalArgumentException("User Not Found")
        );

//        boolean notificationTokenExist = userNotificationTokenRepository.existsByStravaUserAndNotificationToken(stravaUser, notificationToken);
//
//        if(!notificationTokenExist) {
//            UserNotificationTokenEntity userNotificationTokenEntity = UserNotificationTokenEntity.builder()
//                    .notificationToken(notificationToken)
//                    .createdAt(LocalDateTime.now())
//                    .stravaUser(stravaUser)
//                    .build();
//            userNotificationTokenRepository.save(userNotificationTokenEntity);
//        }

        userNotificationTokenRepository.findByStravaUserAndNotificationToken(stravaUser, notificationToken)
                .ifPresentOrElse(
                        existingToken -> {
                            System.out.println("token already exists");
                        },
                        () -> {
                            UserNotificationTokenEntity userNotificationTokenEntity = UserNotificationTokenEntity.builder()
                                    .notificationToken(notificationToken)
                                    .createdAt(LocalDateTime.now())
                                    .stravaUser(stravaUser)
                                    .build();
                            userNotificationTokenRepository.save(userNotificationTokenEntity);
                        }
                );
    }

    public void sendNotificationsToUser(Long athleteId) {
        List<UserNotificationTokenEntity> targetDevices = userNotificationTokenRepository.findByStravaUser_AthleteId(athleteId);
        if (targetDevices.isEmpty()) {
            return;
        }

//        int pendingCheckinCount =
//                Math.toIntExact(
//                        activityRepository
//                                .countActivitiesWithoutCheckin(athleteId)
//                );

        List<ExpoPushRequest> notifications = targetDevices.stream().map(device ->
                ExpoPushRequest.builder()
                        .to(device.getNotificationToken())
                        .title("New activity uploaded")
//                        .body(
//                                pendingCheckinCount == 1
//                                        ? "You have 1 pending check-in."
//                                        : "You have " + pendingCheckinCount
//                                          + " pending check-ins."
//                        )
                        .body("Your activity was imported, Don't forget to check-in")
                        .sound("default")
//                        .notificationCount(pendingCheckinCount)
                        .data(new ExpoPushData("/dashboard")).build()).toList();

        RestClient restClient = RestClient.builder()
                .baseUrl("https://exp.host")
                .build();

        if (notifications.isEmpty()) {
            log.info(
                    "No valid notification tokens for athlete {}",
                    athleteId
            );
            return;
        }

        try {
            String response = restClient.post()
                    .uri("/--/api/v2/push/send")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(notifications)
                    .retrieve()
                    .body(String.class);

            log.info(
                    "Submitted {} push notification(s) for athlete {}: {}",
                    notifications.size(),
                    athleteId,
                    response
            );
        } catch (Exception e) {
            log.error("Failed to send notification {}", athleteId, e);
        }
    }

    @Transactional
    public void deleteUserNotificationToken(String authorizationHeader, String notificationToken) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId).orElseThrow(() ->
                new IllegalArgumentException("User Not Found")
        );
        userNotificationTokenRepository.deleteByStravaUserAndNotificationToken(stravaUser,notificationToken);
    }
}
