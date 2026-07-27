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

    private final SessionService sessionService;
    private final DeletionService deletionService;


    @DeleteMapping()
    public void delete(@RequestHeader("Authorization") String authorizationHeader) {
        Long athleteId = sessionService.getAthleteIdFromToken(authorizationHeader);
        deletionService.deleteUserData(athleteId);
    }


    @DeleteMapping("/userAccount")
    public ResponseEntity<Void> deleteUserAccount(@RequestHeader("Authorization") String authorizationHeader) {
        Long athleteId = sessionService.getAthleteIdFromToken(authorizationHeader);
        deletionService.deleteUserAccount(athleteId);
        return ResponseEntity.noContent().build();
    }
}
