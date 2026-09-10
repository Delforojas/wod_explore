package com.wodexplorer.dto;

import com.wodexplorer.entity.ExerciseCategory;

import com.wodexplorer.entity.MeasurementType;

import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.NotNull;

import jakarta.validation.constraints.Size;

public record ExerciseRequest(

        @NotBlank(message = "El nombre es obligatorio")

        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")

        String name,

        @NotNull(message = "La categoría es obligatoria")

        ExerciseCategory category,

        @NotNull(message = "El tipo de medición es obligatorio")

        MeasurementType measurementType

) {

}