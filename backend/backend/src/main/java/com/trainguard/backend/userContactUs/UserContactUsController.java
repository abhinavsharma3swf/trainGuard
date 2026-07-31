package com.trainguard.backend.userContactUs;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/contactUs")
@RequiredArgsConstructor
public class UserContactUsController {

    private final UserContactUsService userContactUsService;

    @PostMapping
    public UserContactUsResponseRecord contactUsModal(@RequestBody UserContactUsRecord contactUsRecord) {
        return userContactUsService.contactUsInformation(contactUsRecord);
    }
}



