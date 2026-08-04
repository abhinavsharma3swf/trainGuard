package com.trainguard.backend.userActions;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contactUs")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
    public void userNotificationToken(@RequestHeader("Authorization") String authorizationHeader, @RequestBody String notificationToken) {
        userService.notificationToken(authorizationHeader, notificationToken);
    }
}





