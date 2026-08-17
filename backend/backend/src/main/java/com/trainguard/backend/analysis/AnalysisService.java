package com.trainguard.backend.analysis;


import com.trainguard.backend.recovery.RecoveryCheckinEntity;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final RecoveryCheckinRepository recoveryCheckinRepository;

    public AnalysisFeedRecord getAnalysisInformation(Long athleteId, Integer days) {

        Instant startDate = Instant.now().minus(days, ChronoUnit.DAYS);
        List<RecoveryCheckinEntity> checkins = recoveryCheckinRepository.findByAthleteIdAndActivityDateGreaterThanEqual(athleteId, startDate);


        Integer totalTrainingLoad = checkins.stream()
                .map(RecoveryCheckinEntity::getTrainingLoad)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        Double averageRpe = checkins.stream()
                .map(RecoveryCheckinEntity::getRpe)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        Double averagePain = checkins.stream()
                .map(RecoveryCheckinEntity::getPainScore)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);


        return AnalysisFeedRecord.builder()
                .trainingLoad(totalTrainingLoad)
                .averageRpe(averageRpe)
                .averagePainScore(averagePain)
                .build();

    }
}
