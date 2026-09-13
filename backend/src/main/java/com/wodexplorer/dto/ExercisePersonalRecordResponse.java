package com.wodexplorer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.MeasurementType;

public record ExercisePersonalRecordResponse(
        Integer resultId,
        Integer exerciseId,
        String exerciseName,
        MeasurementType measurementType,
        ExerciseRecordType recordType,
        BigDecimal value,
        ExerciseResultUnit unit,
        LocalDateTime performedAt
) {
}
