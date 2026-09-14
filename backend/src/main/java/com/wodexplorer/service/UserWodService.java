package com.wodexplorer.service;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.UserWodCreateRequest;
import com.wodexplorer.dto.UserWodDetailResponse;
import com.wodexplorer.dto.UserWodExerciseRequest;
import com.wodexplorer.dto.UserWodExerciseResponse;
import com.wodexplorer.dto.UserWodPrescriptionRequest;
import com.wodexplorer.dto.UserWodPrescriptionResponse;
import com.wodexplorer.dto.UserWodSummaryResponse;
import com.wodexplorer.dto.UserWodUpdateRequest;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodExercise;
import com.wodexplorer.entity.WodExercisePrescription;
import com.wodexplorer.entity.WodExercisePrescriptionUnit;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.ExerciseNotFoundException;
import com.wodexplorer.exception.InvalidUserWodException;
import com.wodexplorer.exception.UserWodNotFoundException;
import com.wodexplorer.repository.ExerciseRepository;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodExerciseRepository;
import com.wodexplorer.repository.WodRepository;

@Service
public class UserWodService {

    private final UserRepository userRepository;
    private final WodRepository wodRepository;
    private final WodExerciseRepository wodExerciseRepository;
    private final ExerciseRepository exerciseRepository;

    public UserWodService(
            UserRepository userRepository,
            WodRepository wodRepository,
            WodExerciseRepository wodExerciseRepository,
            ExerciseRepository exerciseRepository) {
        this.userRepository = userRepository;
        this.wodRepository = wodRepository;
        this.wodExerciseRepository = wodExerciseRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional
    public UserWodDetailResponse create(
            UserWodCreateRequest request,
            String authenticatedEmail) {
        User owner = findAuthenticatedUser(authenticatedEmail);
        validateWod(request);
        Map<Integer, Exercise> exercisesById = findExercises(request.exercises());

        Wod wod = new Wod();
        wod.setOwner(owner);
        applyWodFields(wod, request.name(), request.type(), request.category(), request.level(),
                request.timeLimit(), request.rounds());
        addExercises(wod, request.exercises(), exercisesById);

        Wod savedWod = wodRepository.saveAndFlush(wod);
        return toDetailResponse(savedWod);
    }

    @Transactional
    public UserWodDetailResponse update(
            Integer id,
            UserWodUpdateRequest request,
            String authenticatedEmail) {
        User owner = findAuthenticatedUser(authenticatedEmail);
        Wod wod = wodRepository.findByIdAndOwner_Id(id, owner.getId())
                .orElseThrow(UserWodNotFoundException::new);

        validateWod(request);
        Map<Integer, Exercise> exercisesById = findExercises(request.exercises());
        applyWodFields(wod, request.name(), request.type(), request.category(), request.level(),
                request.timeLimit(), request.rounds());

        wod.getExercises().clear();
        wodRepository.saveAndFlush(wod);
        addExercises(wod, request.exercises(), exercisesById);

        Wod savedWod = wodRepository.saveAndFlush(wod);
        return toDetailResponse(savedWod);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserWodSummaryResponse> findAll(
            String authenticatedEmail,
            int page,
            int size) {
        User owner = findAuthenticatedUser(authenticatedEmail);
        PageRequest pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id")));

        return PageResponse.from(wodRepository.findByOwner_Id(owner.getId(), pageable)
                .map(this::toSummaryResponse));
    }

    @Transactional(readOnly = true)
    public UserWodDetailResponse findById(Integer id, String authenticatedEmail) {
        User owner = findAuthenticatedUser(authenticatedEmail);
        Wod wod = wodRepository.findByIdAndOwner_Id(id, owner.getId())
                .orElseThrow(UserWodNotFoundException::new);

        List<WodExercise> exercises = wodExerciseRepository
                .findByWodIdWithExerciseOrderByPositionAsc(wod.getId());
        return toDetailResponse(wod, exercises);
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

    private void validateWod(UserWodCreateRequest request) {
        if (request == null) {
            throw invalid("El nombre es obligatorio");
        }
        validateWod(request.name(), request.type(), request.level(), request.timeLimit(),
                request.rounds(), request.exercises());
    }

    private void validateWod(UserWodUpdateRequest request) {
        if (request == null) {
            throw invalid("El nombre es obligatorio");
        }
        validateWod(request.name(), request.type(), request.level(), request.timeLimit(),
                request.rounds(), request.exercises());
    }

    private void validateWod(
            String name,
            WodType type,
            com.wodexplorer.entity.WodLevel level,
            Integer timeLimit,
            Integer rounds,
            List<UserWodExerciseRequest> exercises) {
        if (name == null || name.trim().isBlank()) {
            throw invalid("El nombre es obligatorio");
        }
        String normalizedName = name.trim();
        if (normalizedName.length() > 100) {
            throw invalid("El nombre no puede superar 100 caracteres");
        }
        if (type == null) {
            throw invalid("El tipo es obligatorio");
        }
        if (level == null) {
            throw invalid("El nivel es obligatorio");
        }
        if (timeLimit != null && timeLimit <= 0) {
            throw invalid("El time limit debe ser positivo");
        }
        if (rounds != null && rounds <= 0) {
            throw invalid("Las rondas deben ser positivas");
        }
        if (type == WodType.AMRAP) {
            if (timeLimit == null) {
                throw invalid("El time limit es obligatorio para AMRAP");
            }
            if (rounds != null) {
                throw invalid("AMRAP no admite rondas fijas");
            }
        }
        if (type == WodType.EMOM && timeLimit == null) {
            throw invalid("El time limit es obligatorio para EMOM");
        }
        if (exercises == null || exercises.isEmpty()) {
            throw invalid("Debe existir al menos un ejercicio");
        }
        for (UserWodExerciseRequest exercise : exercises) {
            if (exercise == null || exercise.exerciseId() == null || exercise.exerciseId() <= 0) {
                throw invalid("Cada ejercicio debe tener un exerciseId positivo");
            }
            if (exercise.position() == null || exercise.position() <= 0) {
                throw invalid("Cada ejercicio debe tener una posicion positiva");
            }
            if (exercise.prescriptions() == null || exercise.prescriptions().isEmpty()) {
                throw invalid("Cada ejercicio debe tener prescripciones");
            }
        }
        validatePositions(exercises);
    }

    private void applyWodFields(
            Wod wod,
            String name,
            WodType type,
            com.wodexplorer.entity.WodCategory category,
            com.wodexplorer.entity.WodLevel level,
            Integer timeLimit,
            Integer rounds) {
        wod.setName(name.trim());
        wod.setType(type);
        wod.setCategory(category);
        wod.setLevel(level);
        wod.setTimeLimit(timeLimit);
        wod.setRounds(rounds);
    }

    private void addExercises(
            Wod wod,
            List<UserWodExerciseRequest> requests,
            Map<Integer, Exercise> exercisesById) {
        for (UserWodExerciseRequest exerciseRequest : requests) {
            Exercise exercise = exercisesById.get(exerciseRequest.exerciseId());
            validatePrescriptions(exercise.getMeasurementType(), exerciseRequest.prescriptions());

            WodExercise wodExercise = new WodExercise();
            wodExercise.setExercise(exercise);
            wodExercise.setPosition(exerciseRequest.position());
            for (UserWodPrescriptionRequest prescriptionRequest : exerciseRequest.prescriptions()) {
                WodExercisePrescription prescription = new WodExercisePrescription();
                prescription.setValue(prescriptionRequest.value());
                prescription.setUnit(prescriptionRequest.unit());
                prescription.setUnitLabel(normalizeUnitLabel(prescriptionRequest));
                wodExercise.addPrescription(prescription);
            }
            wod.addExercise(wodExercise);
        }
    }

    private void validatePositions(List<UserWodExerciseRequest> exercises) {
        Set<Integer> positions = exercises.stream()
                .map(UserWodExerciseRequest::position)
                .collect(Collectors.toSet());

        if (positions.size() != exercises.size()
                || positions.stream().anyMatch(position -> position == null || position <= 0)
                || !positions.equals(expectedPositions(exercises.size()))) {
            throw invalid("Las posiciones deben ser unicas, positivas y consecutivas desde 1");
        }
    }

    private Set<Integer> expectedPositions(int size) {
        return java.util.stream.IntStream.rangeClosed(1, size)
                .boxed()
                .collect(Collectors.toSet());
    }

    private Map<Integer, Exercise> findExercises(List<UserWodExerciseRequest> requests) {
        List<Integer> ids = requests.stream()
                .map(UserWodExerciseRequest::exerciseId)
                .toList();
        Map<Integer, Exercise> exercisesById = exerciseRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Exercise::getId, Function.identity()));

        for (Integer id : ids) {
            if (!exercisesById.containsKey(id)) {
                throw new ExerciseNotFoundException(id);
            }
        }
        return exercisesById;
    }

    private void validatePrescriptions(
            MeasurementType measurementType,
            List<UserWodPrescriptionRequest> requests) {
        if (measurementType == null || requests == null || requests.isEmpty()) {
            throw invalid("Las prescripciones del ejercicio no son validas");
        }

        EnumMap<WodExercisePrescriptionUnit, UserWodPrescriptionRequest> byUnit =
                new EnumMap<>(WodExercisePrescriptionUnit.class);
        for (UserWodPrescriptionRequest request : requests) {
            if (request == null || request.value() == null || request.unit() == null) {
                throw invalid("Cada prescripcion debe tener valor y unidad");
            }
            validateValue(request.value(), request.unit());
            if (byUnit.put(request.unit(), request) != null) {
                throw invalid("No se permiten unidades repetidas en un ejercicio");
            }
            if (request.unit() != WodExercisePrescriptionUnit.OTHER
                    && request.unitLabel() != null) {
                throw invalid("unitLabel solo es valido para la unidad OTHER");
            }
            if (request.unit() == WodExercisePrescriptionUnit.OTHER
                    && (request.unitLabel() == null || request.unitLabel().trim().isBlank())) {
                throw invalid("unitLabel es obligatorio para la unidad OTHER");
            }
        }

        Set<WodExercisePrescriptionUnit> expected = expectedUnits(measurementType);
        if (!byUnit.keySet().equals(expected)) {
            throw invalid("Las prescripciones no son compatibles con el tipo de medicion del ejercicio");
        }
    }

    private Set<WodExercisePrescriptionUnit> expectedUnits(MeasurementType measurementType) {
        return switch (measurementType) {
            case REPS -> EnumSet.of(WodExercisePrescriptionUnit.REPS);
            case DISTANCE -> EnumSet.of(WodExercisePrescriptionUnit.METERS);
            case WEIGHT -> EnumSet.of(WodExercisePrescriptionUnit.KG);
            case TIME -> EnumSet.of(WodExercisePrescriptionUnit.SECONDS);
            case WEIGHT_DISTANCE -> EnumSet.of(
                    WodExercisePrescriptionUnit.KG,
                    WodExercisePrescriptionUnit.METERS);
            case OTHER -> EnumSet.of(WodExercisePrescriptionUnit.OTHER);
        };
    }

    private void validateValue(BigDecimal value, WodExercisePrescriptionUnit unit) {
        if (value.signum() <= 0 || value.stripTrailingZeros().scale() > 2) {
            throw invalid("Los valores de prescripcion deben ser positivos y admitir como maximo dos decimales");
        }
        if ((unit == WodExercisePrescriptionUnit.REPS
                || unit == WodExercisePrescriptionUnit.SECONDS)
                && value.stripTrailingZeros().scale() > 0) {
            throw invalid("REPS y SECONDS deben tener valores enteros");
        }
    }

    private String normalizeUnitLabel(UserWodPrescriptionRequest request) {
        return request.unit() == WodExercisePrescriptionUnit.OTHER
                ? request.unitLabel().trim()
                : null;
    }

    private InvalidUserWodException invalid(String message) {
        return new InvalidUserWodException(message);
    }

    private UserWodSummaryResponse toSummaryResponse(Wod wod) {
        return new UserWodSummaryResponse(
                wod.getId(),
                wod.getName(),
                wod.getType(),
                wod.getCategory(),
                wod.getTimeLimit(),
                wod.getRounds(),
                wod.getLevel(),
                wod.getCreatedAt());
    }

    private UserWodDetailResponse toDetailResponse(Wod wod) {
        return toDetailResponse(wod, wod.getExercises());
    }

    private UserWodDetailResponse toDetailResponse(Wod wod, List<WodExercise> exercises) {
        return new UserWodDetailResponse(
                wod.getId(),
                wod.getName(),
                wod.getType(),
                wod.getCategory(),
                wod.getTimeLimit(),
                wod.getRounds(),
                wod.getLevel(),
                wod.getCreatedAt(),
                exercises.stream()
                        .sorted(java.util.Comparator.comparing(WodExercise::getPosition))
                        .map(this::toExerciseResponse)
                        .toList());
    }

    private UserWodExerciseResponse toExerciseResponse(WodExercise wodExercise) {
        return new UserWodExerciseResponse(
                wodExercise.getExercise().getId(),
                wodExercise.getExercise().getName(),
                wodExercise.getExercise().getCategory(),
                wodExercise.getExercise().getMeasurementType(),
                wodExercise.getPosition(),
                wodExercise.getPrescriptions().stream()
                        .sorted(java.util.Comparator.comparing(
                                prescription -> prescription.getUnit().name()))
                        .map(this::toPrescriptionResponse)
                        .toList());
    }

    private UserWodPrescriptionResponse toPrescriptionResponse(
            WodExercisePrescription prescription) {
        return new UserWodPrescriptionResponse(
                prescription.getValue(),
                prescription.getUnit(),
                prescription.getUnitLabel());
    }
}
