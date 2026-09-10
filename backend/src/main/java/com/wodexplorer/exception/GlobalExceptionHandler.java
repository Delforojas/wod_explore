package com.wodexplorer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ExerciseNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleExerciseNotFound(
            ExerciseNotFoundException exception) {

        Map<String, Object> error = Map.of(
                "status", HttpStatus.NOT_FOUND.value(),
                "message", exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }
}