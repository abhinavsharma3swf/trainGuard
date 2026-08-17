package com.trainguard.backend.analysis;

import lombok.Builder;

@Builder
public record AnalysisFeedRecord (
        Integer trainingLoad,
        Double averageRpe,
        Double averagePainScore
){
}
