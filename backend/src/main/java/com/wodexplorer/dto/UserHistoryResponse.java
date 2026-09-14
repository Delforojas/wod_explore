package com.wodexplorer.dto;

import java.util.List;

public record UserHistoryResponse(
        List<WodResultResponse> wodResults,
        List<ExerciseResultResponse> exerciseResults
) {
}
