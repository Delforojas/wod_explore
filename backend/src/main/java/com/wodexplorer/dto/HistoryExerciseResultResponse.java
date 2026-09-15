package com.wodexplorer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResultUnit;

public record HistoryExerciseResultResponse(
        Integer id,
        Integer exerciseId,
        String exerciseName,
        BigDecimal value,
        ExerciseResultUnit unit,
        ExerciseRecordType recordType,
        LocalDateTime performedAt
) {
}
