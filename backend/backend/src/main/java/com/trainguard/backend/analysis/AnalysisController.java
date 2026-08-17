package com.trainguard.backend.analysis;

import com.trainguard.backend.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;
    private final SessionService sessionService;

    @GetMapping("/{days}")
    public AnalysisFeedRecord getAnalysisInformation(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Integer days) {
        Long athleteId = sessionService.getAthleteIdFromAuthorizationHeader(authorizationHeader);
        return analysisService.getAnalysisInformation(athleteId, days);
    }
}
