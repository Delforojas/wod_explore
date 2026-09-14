package com.wodexplorer.exception;

import com.wodexplorer.entity.ExerciseRecordType;

public class ExerciseResultNotFoundException extends RuntimeException {

    public ExerciseResultNotFoundException(Integer exerciseId, ExerciseRecordType recordType) {
        super("No existe una marca " + recordType.value() + " para el ejercicio con id: "
                + exerciseId);
    }
}
