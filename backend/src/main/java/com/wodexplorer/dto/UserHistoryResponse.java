package com.wodexplorer.dto;

public record UserHistoryResponse(
        PageResponse<HistoryWodResultResponse> wodResults,
        PageResponse<HistoryExerciseResultResponse> exerciseResults
) {
}
