package com.wodexplorer.dto;

import java.util.List;

import com.wodexplorer.entity.WodCategory;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record UserWodCreateRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
        String name,
        @NotNull(message = "El tipo es obligatorio") WodType type,
        WodCategory category,
        @NotNull(message = "El nivel es obligatorio") WodLevel level,
        @Positive(message = "El time limit debe ser positivo") Integer timeLimit,
        @Positive(message = "Las rondas deben ser positivas") Integer rounds,
        @NotEmpty(message = "Debe existir al menos un ejercicio")
        List<@Valid UserWodExerciseRequest> exercises
) {
}
