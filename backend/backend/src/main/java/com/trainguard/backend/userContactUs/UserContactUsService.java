package com.trainguard.backend.userContactUs;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class UserContactUsService {

    private final UserContactUsRepository userContactUsRepository;

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
}
