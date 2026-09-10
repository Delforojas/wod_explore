package com.wodexplorer.exception;

public class ExerciseNotFoundException extends RuntimeException {

    public ExerciseNotFoundException(Integer id) {

        super("Ejercicio no encontrado con id: " + id);

    }

}