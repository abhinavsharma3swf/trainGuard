package com.trainguard.backend.userActions;


import com.trainguard.backend.session.SessionService;
import com.trainguard.backend.strava.StravaUserEntity;
import com.trainguard.backend.strava.StravaUserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class UserContactUsService {

    private final UserContactUsRepository userContactUsRepository;
    private final UserAgreementRepository userAgreementRepository;
    private final StravaUserRepository stravaUserRepository;
    private final SessionService sessionService;

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

    public void privacyStatementsAndBeta(String authorizationHeader, boolean checkboxState, boolean checkboxStateForBeta, String createdAt) {

        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);

        StravaUserEntity stravaUser = stravaUserRepository.findById(athleteId).orElseThrow(()->
                new IllegalArgumentException("User Not Found")
        );
System.out.println("Privacy State: " + checkboxState);
        UserAgreementsEntity userAgreementsEntity = UserAgreementsEntity.builder()
                .stravaUser(stravaUser)
                .checkboxState(checkboxState)
                .checkboxStateForBeta(checkboxStateForBeta)
                .acceptedAt(createdAt)
                .build();
System.out.println("user agreement entity before save" + userAgreementsEntity);
        userAgreementRepository.save(userAgreementsEntity);
    }
}
