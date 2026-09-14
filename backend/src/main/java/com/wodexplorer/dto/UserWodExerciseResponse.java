package com.wodexplorer.dto;

import java.util.List;

import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;

public record UserWodExerciseResponse(
        Integer exerciseId,
        String name,
        ExerciseCategory category,
        MeasurementType measurementType,
        Integer position,
        List<UserWodPrescriptionResponse> prescriptions
) {
}
