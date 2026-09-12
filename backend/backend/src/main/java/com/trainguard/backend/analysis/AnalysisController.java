package com.trainguard.backend.analysis;

import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;
    private final SessionService sessionService;

    @GetMapping("/{days}")
    public AnalysisFeedRecord getAnalysisInformation(@RequestHeader("Authorization") String authorizationHeader, @PathVariable @Min(1) @Max(90) Integer days) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        return analysisService.getAnalysisInformation(athleteId, days);
    }

    @GetMapping("/message/{days}")
    public String getAnalysisMessage(@RequestHeader("Authorization") String authorizationHeader, @PathVariable @Min(1) @Max(90) Integer days) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        return analysisService.getAnalysisMessage(athleteId, days);
    }
}
