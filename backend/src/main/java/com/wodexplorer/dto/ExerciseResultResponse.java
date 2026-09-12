package com.wodexplorer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResultUnit;

public record ExerciseResultResponse(
        Integer id,
        Integer exerciseId,
        BigDecimal value,
        ExerciseResultUnit unit,
        ExerciseRecordType recordType,
        LocalDateTime performedAt
) {
}
