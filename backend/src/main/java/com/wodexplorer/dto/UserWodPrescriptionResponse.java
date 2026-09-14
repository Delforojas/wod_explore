package com.wodexplorer.dto;

import java.math.BigDecimal;

import com.wodexplorer.entity.WodExercisePrescriptionUnit;

public record UserWodPrescriptionResponse(
        BigDecimal value,
        WodExercisePrescriptionUnit unit,
        String unitLabel
) {
}
