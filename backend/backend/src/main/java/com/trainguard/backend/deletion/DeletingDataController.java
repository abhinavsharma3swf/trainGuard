package com.trainguard.backend.deletion;


import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/deleteData")
@RequiredArgsConstructor
public class DeletingDataController {

    private final DeletionService deletionService;
    private final LocalDeletionService localDeletionService;
    private final SessionService sessionService;


    @DeleteMapping()
    public void delete(@RequestHeader("Authorization") String authorizationHeader) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        localDeletionService.deleteLocalAccount(athleteId);
    }

    @DeleteMapping("/userAccount")
    public ResponseEntity<Void> deleteUserAccount(@RequestHeader("Authorization") String authorizationHeader) {
        deletionService.deleteUserAccount(authorizationHeader);
        return ResponseEntity.noContent().build();
    }
}
