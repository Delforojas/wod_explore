package com.wodexplorer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResultUnit;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

@JsonIgnoreProperties(ignoreUnknown = false)
public record ExerciseResultRequest(
        @NotNull(message = "El valor es obligatorio")
        @DecimalMin(value = "0.01", message = "Debe ser un número positivo")
        @Digits(integer = 6, fraction = 2, message = "Debe tener como máximo dos decimales")
        BigDecimal value,
        @NotNull(message = "La unidad es obligatoria")
        ExerciseResultUnit unit,
        @NotNull(message = "El tipo de marca es obligatorio")
        ExerciseRecordType recordType,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime performedAt
) {
}
