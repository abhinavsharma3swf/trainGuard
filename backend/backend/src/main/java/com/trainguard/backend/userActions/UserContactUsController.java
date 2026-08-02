package com.trainguard.backend.userActions;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contactUs")
@RequiredArgsConstructor
public class UserContactUsController {

    private final UserContactUsService userContactUsService;

    @PostMapping
    public UserContactUsResponseRecord contactUsModal(@RequestBody UserContactUsRecord contactUsRecord) {
        return userContactUsService.contactUsInformation(contactUsRecord);
    }

    @PostMapping("/userAcceptedBetaAndPrivacyStatement")
    public void userAcceptedBetaAndPrivacyStatement(@RequestHeader("Authorization") String authorizationHeader,
                                                    @RequestBody boolean checkboxState, boolean checkboxStateForBeta) {
        userContactUsService.privacyStatementsAndBeta(authorizationHeader, checkboxState, checkboxStateForBeta);
    }
}



