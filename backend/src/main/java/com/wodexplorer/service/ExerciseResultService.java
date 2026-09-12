package com.wodexplorer.service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.ExerciseResultRequest;
import com.wodexplorer.dto.ExerciseResultResponse;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.ExerciseNotFoundException;
import com.wodexplorer.exception.ExerciseResultNotFoundException;
import com.wodexplorer.exception.InvalidExerciseResultException;
import com.wodexplorer.repository.ExerciseRepository;
import com.wodexplorer.repository.ExerciseResultRepository;
import com.wodexplorer.repository.UserRepository;

@Service
public class ExerciseResultService {

    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseResultRepository exerciseResultRepository;
    private final Clock clock;

    public ExerciseResultService(
            UserRepository userRepository,
            ExerciseRepository exerciseRepository,
            ExerciseResultRepository exerciseResultRepository,
            Clock clock) {
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.exerciseResultRepository = exerciseResultRepository;
        this.clock = clock;
    }

    @Transactional
    public ExerciseResultResponse create(
            Integer exerciseId,
            ExerciseResultRequest request,
            String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        Exercise exercise = findExercise(exerciseId);
        validateRequest(request);
        validateCompatibility(exercise.getMeasurementType(), request.recordType(), request.unit());
        LocalDateTime performedAt = resolvePerformedAt(request.performedAt());

        ExerciseResult result = new ExerciseResult();
        result.setUser(user);
        result.setExercise(exercise);
        result.setValue(request.value());
        result.setUnit(request.unit());
        result.setRecordType(request.recordType());
        result.setPerformedAt(performedAt);

        return toResponse(exerciseResultRepository.save(result));
    }

    @Transactional(readOnly = true)
    public List<ExerciseResultResponse> findOwnResults(
            Integer exerciseId,
            String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        Exercise exercise = findExercise(exerciseId);

        return exerciseResultRepository
                .findByUser_IdAndExercise_IdOrderByPerformedAtDescIdDesc(
                        user.getId(), exercise.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExerciseResultResponse findBest(
            Integer exerciseId,
            String recordTypeValue,
            String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        Exercise exercise = findExercise(exerciseId);
        ExerciseRecordType recordType = parseRecordType(recordTypeValue);
        ExerciseResultUnit unit = unitFor(recordType);
        validateCompatibility(exercise.getMeasurementType(), recordType, unit);

        return bestResult(user.getId(), exercise.getId(), recordType, unit)
                .map(this::toResponse)
                .orElseThrow(() -> new ExerciseResultNotFoundException(exerciseId, recordType));
    }

    private User findAuthenticatedUser(String authenticatedEmail) {
        String normalizedEmail = authenticatedEmail == null
                ? ""
                : authenticatedEmail.trim().toLowerCase(Locale.ROOT);

        if (normalizedEmail.isBlank()) {
            throw new AuthenticatedUserNotFoundException();
        }

        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(AuthenticatedUserNotFoundException::new);
    }

    private Exercise findExercise(Integer exerciseId) {
        return exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ExerciseNotFoundException(exerciseId));
    }

    private void validateRequest(ExerciseResultRequest request) {
        if (request == null || request.value() == null || request.unit() == null
                || request.recordType() == null) {
            throw invalid("value, unit y recordType son obligatorios");
        }
        if (request.value().compareTo(BigDecimal.ZERO) <= 0) {
            throw invalid("value debe ser positivo");
        }
        if (request.value().precision() - request.value().scale() > 6
                || request.value().scale() > 2) {
            throw invalid("value debe caber en DECIMAL(8,2)");
        }
        if (request.unit() == ExerciseResultUnit.REPS
                && request.value().stripTrailingZeros().scale() > 0) {
            throw invalid("value debe ser un entero para la unidad REPS");
        }
    }

    private void validateCompatibility(
            MeasurementType measurementType,
            ExerciseRecordType recordType,
            ExerciseResultUnit unit) {
        boolean compatible = switch (measurementType) {
            case WEIGHT -> unit == ExerciseResultUnit.KG && isWeightRecordType(recordType);
            case REPS -> unit == ExerciseResultUnit.REPS
                    && recordType == ExerciseRecordType.MAX_REPS;
            case TIME -> unit == ExerciseResultUnit.SECONDS
                    && recordType == ExerciseRecordType.BEST_TIME;
            case DISTANCE, WEIGHT_DISTANCE, OTHER -> false;
        };

        if (!compatible) {
            throw invalid("unit y recordType no son compatibles con measurementType"
                    + " del ejercicio");
        }
    }

    private boolean isWeightRecordType(ExerciseRecordType recordType) {
        return recordType == ExerciseRecordType.ONE_RM
                || recordType == ExerciseRecordType.THREE_RM
                || recordType == ExerciseRecordType.FIVE_RM
                || recordType == ExerciseRecordType.TEN_RM;
    }

    private ExerciseRecordType parseRecordType(String value) {
        return ExerciseRecordType.fromValue(value)
                .orElseThrow(() -> invalid("recordType no tiene un valor válido"));
    }

    private ExerciseResultUnit unitFor(ExerciseRecordType recordType) {
        return switch (recordType) {
            case ONE_RM, THREE_RM, FIVE_RM, TEN_RM -> ExerciseResultUnit.KG;
            case MAX_REPS -> ExerciseResultUnit.REPS;
            case BEST_TIME -> ExerciseResultUnit.SECONDS;
        };
    }

    private java.util.Optional<ExerciseResult> bestResult(
            Integer userId,
            Integer exerciseId,
            ExerciseRecordType recordType,
            ExerciseResultUnit unit) {
        if (unit == ExerciseResultUnit.SECONDS) {
            return exerciseResultRepository
                    .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueAscPerformedAtDescIdDesc(
                            userId, exerciseId, recordType);
        }
        return exerciseResultRepository
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueDescPerformedAtDescIdDesc(
                        userId, exerciseId, recordType);
    }

    private LocalDateTime resolvePerformedAt(LocalDateTime requestedPerformedAt) {
        LocalDateTime now = LocalDateTime.now(clock).truncatedTo(ChronoUnit.SECONDS);
        LocalDateTime performedAt = requestedPerformedAt == null ? now : requestedPerformedAt;

        if (performedAt.isAfter(now)) {
            throw invalid("performedAt no puede ser una fecha futura");
        }
        return performedAt;
    }

    private InvalidExerciseResultException invalid(String message) {
        return new InvalidExerciseResultException(message);
    }

    private ExerciseResultResponse toResponse(ExerciseResult result) {
        return new ExerciseResultResponse(
                result.getId(),
                result.getExercise().getId(),
                result.getValue(),
                result.getUnit(),
                result.getRecordType(),
                result.getPerformedAt());
    }
}
