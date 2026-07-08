package com.trainguard.backend.recovery;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recovery-checkins")
@RequiredArgsConstructor
public class RecoveryCheckinController {

    private final RecoveryCheckinService recoveryCheckinService;

    @PostMapping
    public RecoveryCheckinResponseRecord createCheckin(@RequestBody RecoveryCheckinRequestRecord recoveryCheckinRequestRecord) {
        return recoveryCheckinService.saveCheckin(recoveryCheckinRequestRecord);
    }

    @GetMapping
    public List<RecoveryCheckinResponseRecord> getAllCheckin() {
        return recoveryCheckinService.getAllRecoveryCheckin();
    }
}
