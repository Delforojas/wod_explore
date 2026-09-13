package com.wodexplorer.dto;

import java.util.List;

public record UserEvolutionResponse(
        List<WodEvolutionPoint> wodResults,
        List<ExerciseEvolutionPoint> exerciseResults
) {
}
