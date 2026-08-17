package com.trainguard.backend.analysis;

import com.trainguard.backend.recovery.RecoveryCheckinEntity;
import com.trainguard.backend.recovery.RecoveryCheckinRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnalysisServiceTest {

    @Mock
    private RecoveryCheckinRepository recoveryCheckinRepository;

    @InjectMocks
    private AnalysisService analysisService;

    @Test
    void shouldCalculateAverageForTrainingLoadRpeAndPainForLastSevenDays() {

        AnalysisForCurrentSevenDays analysisForCurrentSevenDays = AnalysisForCurrentSevenDays.builder()
                .trainingLoad(600)
                .averageRpe(3.5)
                .averagePainScore(6.5)
                .averageTemperature(0.0)
                .build();

        AnalysisRecordForSevenDaysComparison analysisRecordForSevenDaysComparison = AnalysisRecordForSevenDaysComparison.builder()
                .trainingLoad(0)
                .averageRpe(0.0)
                .averagePainScore(0.0)
                .averageTemperature(0.0)
                .build();

        AnalysisFeedRecord analysisFeedRecordAsResponse = AnalysisFeedRecord.builder()
                .analysisForCurrentSevenDays(analysisForCurrentSevenDays)
                .analysisRecordForSevenDaysComparison(analysisRecordForSevenDaysComparison)
                .build();

        RecoveryCheckinEntity recoveryCheckinResponseRecord = RecoveryCheckinEntity.builder()
                .rpe(5)
                .painScore(5)
                .trainingLoad(200)
                .activityDate(Instant.now())
                .build();

        RecoveryCheckinEntity recoveryCheckinResponseRecord1 = RecoveryCheckinEntity.builder()
                .rpe(2)
                .painScore(8)
                .trainingLoad(400)
                .activityDate(Instant.now())
                .build();

        when(recoveryCheckinRepository.findByAthleteIdAndActivityDateGreaterThanEqual(eq(12345L), any()))
                .thenReturn(List.of(recoveryCheckinResponseRecord, recoveryCheckinResponseRecord1));

        AnalysisFeedRecord response = analysisService.getAnalysisInformation(12345L, 7);

        verify(recoveryCheckinRepository, times(1)).findByAthleteIdAndActivityDateGreaterThanEqual(eq(12345L), any(Instant.class));
        assertThat(response).isEqualTo(analysisFeedRecordAsResponse);
        verify(recoveryCheckinRepository, times(1)).findByAthleteIdAndActivityDateGreaterThanEqualAndActivityDateLessThan(eq(12345L), any(Instant.class), any(Instant.class));
        assertThat(response).isEqualTo(analysisFeedRecordAsResponse);
    }
}
