package com.wodexplorer.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UserWodExerciseRequest(
        @NotNull(message = "El exerciseId es obligatorio")
        @Positive(message = "El exerciseId debe ser positivo")
        Integer exerciseId,
        @NotNull(message = "La posicion es obligatoria")
        @Positive(message = "La posicion debe ser positiva")
        Integer position,
        @NotEmpty(message = "Cada ejercicio debe tener prescripciones")
        List<@Valid UserWodPrescriptionRequest> prescriptions
) {
}
