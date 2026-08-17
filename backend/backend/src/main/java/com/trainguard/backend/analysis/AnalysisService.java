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

        Instant now = Instant.now();
        Instant currentStart = now.minus(days, ChronoUnit.DAYS);
        Instant previousStart = Instant.now().minus(days * 2L , ChronoUnit.DAYS);

        List<RecoveryCheckinEntity> checkins = recoveryCheckinRepository.findByAthleteIdAndActivityDateGreaterThanEqual(athleteId, currentStart);

        List<RecoveryCheckinEntity> previousCheckins = recoveryCheckinRepository.findByAthleteIdAndActivityDateGreaterThanEqualAndActivityDateLessThan(athleteId, previousStart, currentStart);

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

        Double averageTemperature = checkins.stream()
                .map(RecoveryCheckinEntity::getTemperature)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        AnalysisForCurrentSevenDays analysisForCurrentSevenDays = AnalysisForCurrentSevenDays.builder()
                .trainingLoad(totalTrainingLoad)
                .averageRpe(averageRpe)
                .averagePainScore(averagePain)
                .averageTemperature(averageTemperature)
                .build();

        Integer totalTrainingLoadPrevious = previousCheckins.stream()
                .map(RecoveryCheckinEntity::getTrainingLoad)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        Double averageRpePrevious = previousCheckins.stream()
                .map(RecoveryCheckinEntity::getRpe)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        Double averagePainPrevious = previousCheckins.stream()
                .map(RecoveryCheckinEntity::getPainScore)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        Double averageTemperaturePrevious = previousCheckins.stream()
                .map(RecoveryCheckinEntity::getTemperature)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        AnalysisRecordForSevenDaysComparison analysisForPreviousSevenDays = AnalysisRecordForSevenDaysComparison.builder()
                .trainingLoad(totalTrainingLoadPrevious)
                .averageRpe(averageRpePrevious)
                .averagePainScore(averagePainPrevious)
                .averageTemperature(averageTemperaturePrevious)
                .build();


        return AnalysisFeedRecord.builder()
                .analysisForCurrentSevenDays(analysisForCurrentSevenDays)
                .analysisRecordForSevenDaysComparison(analysisForPreviousSevenDays)
                .build();
    }

   public String getAnalysisMessage(Long athleteId, Integer days) {

        AnalysisFeedRecord analysisFeedRecord = getAnalysisInformation(athleteId, days);
        if(analysisFeedRecord != null && analysisFeedRecord.analysisForCurrentSevenDays().averageRpe() > 3.0) {
            return "Your average rpe is greater than 3.0";
        }
        return "";
   }
}
