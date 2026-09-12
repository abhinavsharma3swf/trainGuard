package com.trainguard.backend.session;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/session")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @DeleteMapping
    public ResponseEntity<Void> revokeSession(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        sessionService.revokeSession(authorizationHeader);
        return ResponseEntity.noContent().build();
    }
}