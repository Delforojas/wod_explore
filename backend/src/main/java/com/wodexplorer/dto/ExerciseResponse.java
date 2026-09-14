package com.wodexplorer.dto;

import com.wodexplorer.entity.ExerciseCategory;

import com.wodexplorer.entity.MeasurementType;

public record ExerciseResponse(

        Integer id,

        String name,

        ExerciseCategory category,

        MeasurementType measurementType

) {

}