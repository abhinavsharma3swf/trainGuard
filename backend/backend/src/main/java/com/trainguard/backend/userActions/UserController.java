package com.trainguard.backend.userActions;


import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/contactUs")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SessionService sessionService;

    @PostMapping
    public UserContactUsResponseRecord contactUsModal(@RequestBody UserContactUsRecord contactUsRecord) {
        return userService.contactUsInformation(contactUsRecord);
    }

    @PostMapping("/userAcceptedBetaAndPrivacyStatement")
    public void userAcceptedBetaAndPrivacyStatement(@RequestHeader("Authorization") String authorizationHeader,
                                                    @RequestBody UserAcceptedStatementsRecord userAcceptedStatementsRecord) {
        userService.privacyStatementsAndBeta(authorizationHeader, userAcceptedStatementsRecord);
    }

    @PostMapping("/notification")
    public void userNotificationToken(@RequestHeader("Authorization") String authorizationHeader, @RequestBody NotificationTokenRecord notificationToken) {
        userService.notificationToken(authorizationHeader, notificationToken.notificationToken());
    }

//    @PostMapping("/notification/test")
//    public ResponseEntity<Void> testNotification(@RequestHeader("Authorization") String authorizationHeader) {
//        Long athleteId =
//                sessionService.getAthleteIdFromAuthorizationHeader(
//                        authorizationHeader
//                );
//
//        userService.sendNotificationsToUser(athleteId);
//        return ResponseEntity.noContent().build();
//    }

    @DeleteMapping("/token_deletion")
    public ResponseEntity<Void> tokenDeletion(@RequestHeader("Authorization") String authorizationHeader, @RequestBody NotificationTokenRecord notificationToken) {
        userService.deleteUserNotificationToken(authorizationHeader, notificationToken.notificationToken());
        return ResponseEntity.noContent().build();
    }
}






