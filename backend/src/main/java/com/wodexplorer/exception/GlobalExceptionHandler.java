package com.wodexplorer.exception;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
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
                "error", "WOD_NOT_FOUND",
                "status", HttpStatus.NOT_FOUND.value(),
                "message", exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    @ExceptionHandler(UserWodNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserWodNotFound(
            UserWodNotFoundException exception) {
        Map<String, Object> error = Map.of(
                "error", "USER_WOD_NOT_FOUND",
                "message", exception.getMessage(),
                "status", HttpStatus.NOT_FOUND.value(),
                "details", Map.of());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UserWodDeletionBlockedException.class)
    public ResponseEntity<Map<String, Object>> handleUserWodDeletionBlocked(
            UserWodDeletionBlockedException exception) {
        Map<String, Object> error = Map.of(
                "error", "USER_WOD_HAS_RESULTS",
                "message", exception.getMessage(),
                "status", HttpStatus.CONFLICT.value(),
                "details", Map.of());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(AuthenticatedUserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticatedUserNotFound(
            AuthenticatedUserNotFoundException exception) {
        Map<String, Object> error = Map.of(
                "error", "UNAUTHORIZED",
                "message", exception.getMessage()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(InvalidWodResultException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidWodResult(
            InvalidWodResultException exception) {
        Map<String, String> details = Map.of("result", exception.getMessage());
        Map<String, Object> error = Map.of(
                "error", "VALIDATION_ERROR",
                "message", "Datos inválidos",
                "details", details
        );

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(InvalidExerciseResultException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidExerciseResult(
            InvalidExerciseResultException exception) {
        Map<String, String> details = Map.of("result", exception.getMessage());
        Map<String, Object> error = Map.of(
                "error", "VALIDATION_ERROR",
                "message", "Datos inválidos",
                "details", details
        );

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(InvalidUserWodException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidUserWod(
            InvalidUserWodException exception) {
        Map<String, String> details = Map.of("wod", exception.getMessage());
        Map<String, Object> error = Map.of(
                "error", "VALIDATION_ERROR",
                "message", "Datos inválidos",
                "details", details);

        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(ExerciseResultNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleExerciseResultNotFound(
            ExerciseResultNotFoundException exception) {
        Map<String, Object> error = Map.of(
                "status", HttpStatus.NOT_FOUND.value(),
                "message", exception.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
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

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableMessage(
            HttpMessageNotReadableException exception) {
        Map<String, String> details = Map.of(
                "body", "El body no tiene un formato válido"
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
