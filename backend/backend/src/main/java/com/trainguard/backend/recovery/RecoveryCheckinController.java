package com.trainguard.backend.recovery;

import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recovery-checkins")
@RequiredArgsConstructor
public class RecoveryCheckinController {

    private final RecoveryCheckinService recoveryCheckinService;
    private final SessionService sessionService;

    @PostMapping
    public RecoveryCheckinResponseRecord createCheckin(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody RecoveryCheckinRequestRecord recoveryCheckinRequestRecord
    ) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);

        return recoveryCheckinService.saveCheckin(
                athleteId,
                recoveryCheckinRequestRecord
        );
    }

    @GetMapping
    public List<RecoveryCheckinResponseRecord> getAllCheckin(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);

        return recoveryCheckinService.getAllRecoveryCheckin(
                athleteId,
                page,
                size
        );
    }
}