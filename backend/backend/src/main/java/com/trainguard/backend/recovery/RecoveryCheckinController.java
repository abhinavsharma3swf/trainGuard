package com.trainguard.backend.recovery;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recovery-checkins")
@RequiredArgsConstructor
public class RecoveryCheckinController {

    private final RecoveryCheckinService recoveryCheckinService;

    @PostMapping
    public RecoveryCheckinResponseRecord createCheckin(@RequestBody RecoveryCheckinRequestRecord recoveryCheckinRequestRecord) {
        return recoveryCheckinService.saveCheckin(recoveryCheckinRequestRecord);
    }
}
