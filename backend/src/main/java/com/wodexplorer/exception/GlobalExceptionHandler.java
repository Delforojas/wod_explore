package com.wodexplorer.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

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

    @ExceptionHandler(WodNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleWodNotFound(
            WodNotFoundException exception) {

        Map<String, Object> error = Map.of(
                "status", HttpStatus.NOT_FOUND.value(),
                "message", exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationError(
            MethodArgumentNotValidException exception) {
        Map<String, String> details = exception.getBindingResult().getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        fieldError -> fieldError.getField(),
                        fieldError -> fieldError.getDefaultMessage(),
                        (firstMessage, ignoredMessage) -> firstMessage,
                        LinkedHashMap::new
                ));

        Map<String, Object> error = Map.of(
                "error", "VALIDATION_ERROR",
                "message", "Datos inválidos",
                "details", details
        );

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleParameterTypeMismatch(
            MethodArgumentTypeMismatchException exception) {
        Map<String, String> details = Map.of(
                exception.getName(), "El parámetro no tiene un valor válido"
        );

        Map<String, Object> error = Map.of(
                "error", "VALIDATION_ERROR",
                "message", "Datos inválidos",
                "details", details
        );

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyExists(
            EmailAlreadyExistsException exception) {
        return conflictResponse();
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(
            InvalidCredentialsException exception) {
        Map<String, Object> error = Map.of(
                "error", "INVALID_CREDENTIALS",
                "message", exception.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            DataIntegrityViolationException exception) {
        if (EmailConstraintViolationDetector.isEmailUniqueViolation(exception)) {
            return conflictResponse();
        }

        Map<String, Object> error = Map.of(
                "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "message", "No se pudo completar la operación"
        );
        return ResponseEntity.internalServerError().body(error);
    }

    private ResponseEntity<Map<String, Object>> conflictResponse() {
        Map<String, Object> error = Map.of(
                "error", "EMAIL_ALREADY_EXISTS",
                "message", "El email ya está registrado"
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}
