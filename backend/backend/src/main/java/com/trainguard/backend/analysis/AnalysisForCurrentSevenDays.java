package com.trainguard.backend.analysis;

import lombok.Builder;

@Builder
public record AnalysisForCurrentSevenDays (
        Integer trainingLoad,
        Double averageRpe,
        Double averagePainScore,
        Double averageTemperature
){
}
