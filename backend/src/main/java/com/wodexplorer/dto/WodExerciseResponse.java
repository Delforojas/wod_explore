package com.wodexplorer.dto;

import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;

public record WodExerciseResponse(
        Integer id,
        String name,
        ExerciseCategory category,
        MeasurementType measurementType,
        Integer reps,
        Integer position
) {
}
