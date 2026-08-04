package com.trainguard.backend.userActions;


import com.trainguard.backend.session.SessionService;
import com.trainguard.backend.strava.StravaUserEntity;
import com.trainguard.backend.strava.StravaUserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class UserService {

    private final UserContactUsRepository userContactUsRepository;
    private final UserAgreementRepository userAgreementRepository;
    private final StravaUserRepository stravaUserRepository;
    private final SessionService sessionService;
    private final UserNotificationTokenRepository userNotificationTokenRepository;

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


    public void notificationToken(String authorizationHeader, @RequestBody String notificationToken) {

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
}
