package com.wodexplorer.dto;

public record UserHistoryResponse(
        PageResponse<WodResultResponse> wodResults,
        PageResponse<ExerciseResultResponse> exerciseResults
) {
}
