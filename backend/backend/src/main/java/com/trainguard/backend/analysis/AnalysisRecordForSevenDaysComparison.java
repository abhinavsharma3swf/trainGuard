package com.trainguard.backend.analysis;

import lombok.Builder;

@Builder
public record AnalysisRecordForSevenDaysComparison (
        Integer trainingLoad,
        Double averageRpe,
        Double averagePainScore,
        Double averageTemperature
){
}
