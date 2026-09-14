package com.wodexplorer.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wodexplorer.entity.WodLevel;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@JsonIgnoreProperties(ignoreUnknown = false)
public record WodResultRequest(
        @Positive(message = "Debe ser un número positivo")
        Integer timeSeconds,
        @PositiveOrZero(message = "No puede ser negativo")
        Integer rounds,
        @PositiveOrZero(message = "No puede ser negativo")
        Integer reps,
        @NotNull(message = "El nivel es obligatorio")
        WodLevel level,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime completedAt
) {
}
