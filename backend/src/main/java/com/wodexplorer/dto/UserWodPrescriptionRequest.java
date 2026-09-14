package com.wodexplorer.dto;

import java.math.BigDecimal;

import com.wodexplorer.entity.WodExercisePrescriptionUnit;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserWodPrescriptionRequest(
        @NotNull(message = "El valor de la prescripcion es obligatorio")
        @DecimalMin(value = "0.01", message = "El valor debe ser positivo")
        @Digits(integer = 6, fraction = 2, message = "El valor admite como maximo dos decimales")
        BigDecimal value,
        @NotNull(message = "La unidad es obligatoria") WodExercisePrescriptionUnit unit,
        @Size(max = 100, message = "La etiqueta no puede superar 100 caracteres")
        String unitLabel
) {
}
