package com.wodexplorer.dto;

import java.util.List;

public record UserStatisticsResponse(
        int wodResultsCount,
        int exerciseResultsCount,
        List<WodPersonalRecordResponse> wodPersonalRecords,
        List<ExercisePersonalRecordResponse> exercisePersonalRecords
) {
}
