package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.UserWodCreateRequest;
import com.wodexplorer.dto.UserWodDetailResponse;
import com.wodexplorer.dto.UserWodExerciseRequest;
import com.wodexplorer.dto.UserWodExerciseResponse;
import com.wodexplorer.dto.UserWodPrescriptionRequest;
import com.wodexplorer.dto.UserWodUpdateRequest;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodExercise;
import com.wodexplorer.entity.WodExercisePrescription;
import com.wodexplorer.entity.WodExercisePrescriptionUnit;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.ExerciseNotFoundException;
import com.wodexplorer.exception.InvalidUserWodException;
import com.wodexplorer.exception.UserWodDeletionBlockedException;
import com.wodexplorer.exception.UserWodNotFoundException;
import com.wodexplorer.repository.ExerciseRepository;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodExerciseRepository;
import com.wodexplorer.repository.WodRepository;
import com.wodexplorer.repository.WodResultRepository;

@ExtendWith(MockitoExtension.class)
class UserWodServiceTest {

    private static final String AUTHENTICATED_EMAIL = "  OWNER@EXAMPLE.COM ";

    @Mock
    private UserRepository userRepository;

    @Mock
    private WodRepository wodRepository;

    @Mock
    private WodExerciseRepository wodExerciseRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private WodResultRepository wodResultRepository;

    @InjectMocks
    private UserWodService userWodService;

    @Test
    void create_ResolvesOwnerFromNormalizedAuthenticationAndPersistsCompleteWod() {
        User owner = user(7, "owner@example.com");
        Exercise exercise = exercise(12, "Burpee", MeasurementType.REPS);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(exerciseRepository.findAllById(any())).willReturn(List.of(exercise));
        given(wodRepository.saveAndFlush(any(Wod.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        UserWodDetailResponse response = userWodService.create(
                request(WodType.FOR_TIME, 3, exerciseRequest(12, 1,
                        prescription("10", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL);

        ArgumentCaptor<Wod> captor = ArgumentCaptor.forClass(Wod.class);
        then(wodRepository).should().saveAndFlush(captor.capture());
        Wod saved = captor.getValue();
        assertThat(saved.getOwner()).isSameAs(owner);
        assertThat(saved.getName()).isEqualTo("Fran");
        assertThat(saved.getExercises()).hasSize(1);
        assertThat(saved.getExercises().get(0).getPrescriptions().get(0).getValue())
                .isEqualByComparingTo("10");
        assertThat(response.exercises().get(0).prescriptions().get(0).unit())
                .isEqualTo(WodExercisePrescriptionUnit.REPS);
        then(userRepository).should().findByEmail("owner@example.com");
    }

    @Test
    void update_ReplacesOwnedWodConfigurationAndChildren() {
        User owner = user(7, "owner@example.com");
        Exercise oldExercise = exercise(12, "Burpee", MeasurementType.REPS);
        Exercise newExercise = exercise(13, "Run", MeasurementType.DISTANCE);
        Wod wod = wod(20, "Old name", WodType.FOR_TIME);
        WodExercise oldWodExercise = wodExercise(oldExercise, 1);
        oldWodExercise.addPrescription(prescriptionEntity("10", WodExercisePrescriptionUnit.REPS));
        wod.addExercise(oldWodExercise);

        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.of(wod));
        given(exerciseRepository.findAllById(any())).willReturn(List.of(newExercise));
        given(wodRepository.saveAndFlush(any(Wod.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        UserWodDetailResponse response = userWodService.update(
                20,
                updateRequest(WodType.AMRAP, 600,
                        exerciseRequest(13, 1,
                                prescription("500", WodExercisePrescriptionUnit.METERS, null))),
                AUTHENTICATED_EMAIL);

        assertThat(wod.getName()).isEqualTo("Fran");
        assertThat(wod.getType()).isEqualTo(WodType.AMRAP);
        assertThat(wod.getTimeLimit()).isEqualTo(600);
        assertThat(wod.getExercises()).extracting(WodExercise::getExercise)
                .extracting(Exercise::getId).containsExactly(13);
        assertThat(wod.getExercises().get(0).getPrescriptions())
                .extracting(WodExercisePrescription::getUnit)
                .containsExactly(WodExercisePrescriptionUnit.METERS);
        assertThat(response.exercises()).extracting(UserWodExerciseResponse::exerciseId)
                .containsExactly(13);
        then(wodRepository).should(times(2)).saveAndFlush(wod);
    }

    @Test
    void update_WhenWodIsNotOwned_ReturnsGenericNotFoundWithoutValidatingRequest() {
        User owner = user(7, "owner@example.com");
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userWodService.update(20, null, AUTHENTICATED_EMAIL))
                .isInstanceOf(UserWodNotFoundException.class)
                .hasMessage("WOD personalizado no disponible");
        then(exerciseRepository).shouldHaveNoInteractions();
        then(wodRepository).should().findByIdAndOwner_Id(20, 7);
    }

    @Test
    void delete_RemovesOwnedWodAndFlushesTransaction() {
        User owner = user(7, "owner@example.com");
        Wod wod = wod(20, "Fran", WodType.FOR_TIME);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.of(wod));
        given(wodResultRepository.existsByWod_Id(20)).willReturn(false);

        userWodService.delete(20, AUTHENTICATED_EMAIL);

        then(wodResultRepository).should().existsByWod_Id(20);
        then(wodRepository).should().delete(wod);
        then(wodRepository).should().flush();
    }

    @Test
    void delete_WhenWodIsNotOwned_ReturnsGenericNotFoundWithoutCheckingResults() {
        User owner = user(7, "owner@example.com");
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userWodService.delete(20, AUTHENTICATED_EMAIL))
                .isInstanceOf(UserWodNotFoundException.class)
                .hasMessage("WOD personalizado no disponible");

        then(wodResultRepository).shouldHaveNoInteractions();
        then(wodRepository).shouldHaveNoMoreInteractions();
    }

    @Test
    void delete_WhenWodHasResultsBlocksWithoutDeletingAnything() {
        User owner = user(7, "owner@example.com");
        Wod wod = wod(20, "Fran", WodType.FOR_TIME);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.of(wod));
        given(wodResultRepository.existsByWod_Id(20)).willReturn(true);

        assertThatThrownBy(() -> userWodService.delete(20, AUTHENTICATED_EMAIL))
                .isInstanceOf(UserWodDeletionBlockedException.class)
                .hasMessage("El WOD personalizado tiene resultados históricos y no se puede eliminar");

        then(wodRepository).shouldHaveNoMoreInteractions();
    }

    @Test
    void update_ReusesValidationRulesForAmrapAndDoesNotPersistInvalidRequest() {
        User owner = user(7, "owner@example.com");
        Wod wod = wod(20, "Old name", WodType.FOR_TIME);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.of(wod));

        assertThatThrownBy(() -> userWodService.update(
                20,
                updateRequest(WodType.AMRAP, null,
                        exerciseRequest(12, 1,
                                prescription("10", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(InvalidUserWodException.class)
                .hasMessage("El time limit es obligatorio para AMRAP");
        then(exerciseRepository).shouldHaveNoInteractions();
        then(wodRepository).should().findByIdAndOwner_Id(20, 7);
        then(wodRepository).shouldHaveNoMoreInteractions();
    }

    @Test
    void findAll_UsesOwnerAndDeterministicDescendingPage() {
        User owner = user(7, "owner@example.com");
        Wod wod = wod(20, "Fran", WodType.FOR_TIME);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByOwner_Id(eq(7), any(Pageable.class)))
                .willReturn(new PageImpl<>(List.of(wod)));

        PageResponse<?> response = userWodService.findAll(AUTHENTICATED_EMAIL, 0, 20);

        assertThat(response.items()).hasSize(1);
        then(wodRepository).should().findByOwner_Id(eq(7), any(Pageable.class));
    }

    @Test
    void findById_FiltersByOwnerAndPreservesExerciseAndPrescriptionOrder() {
        User owner = user(7, "owner@example.com");
        Exercise exercise = exercise(12, "Burpee", MeasurementType.REPS);
        Wod wod = wod(20, "Fran", WodType.FOR_TIME);
        WodExercise wodExercise = wodExercise(exercise, 1);
        wodExercise.addPrescription(prescriptionEntity("10", WodExercisePrescriptionUnit.REPS));
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.of(wod));
        given(wodExerciseRepository.findByWodIdWithExerciseOrderByPositionAsc(20))
                .willReturn(List.of(wodExercise));

        UserWodDetailResponse response = userWodService.findById(20, AUTHENTICATED_EMAIL);

        assertThat(response.id()).isEqualTo(20);
        assertThat(response.exercises()).extracting("position").containsExactly(1);
        assertThat(response.exercises().get(0).prescriptions()).hasSize(1);
        then(wodRepository).should().findByIdAndOwner_Id(20, 7);
    }

    @Test
    void findById_WhenWodBelongsToAnotherUser_ReturnsGenericNotFound() {
        User owner = user(7, "owner@example.com");
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(wodRepository.findByIdAndOwner_Id(20, 7)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userWodService.findById(20, AUTHENTICATED_EMAIL))
                .isInstanceOf(UserWodNotFoundException.class)
                .hasMessage("WOD personalizado no disponible");
        then(wodExerciseRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenAuthenticatedUserDoesNotExist_ReturnsUnauthorizedError() {
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.empty());

        assertThatThrownBy(() -> userWodService.create(
                request(WodType.FOR_TIME, null, exerciseRequest(12, 1,
                        prescription("10", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(AuthenticatedUserNotFoundException.class);
        then(exerciseRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenExerciseDoesNotExist_ReturnsNotFound() {
        User owner = user(7, "owner@example.com");
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(exerciseRepository.findAllById(any())).willReturn(List.of());

        assertThatThrownBy(() -> userWodService.create(
                request(WodType.FOR_TIME, null, exerciseRequest(999, 1,
                        prescription("10", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(ExerciseNotFoundException.class)
                .hasMessage("Ejercicio no encontrado con id: 999");
        then(wodRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_RejectsAmrapWithoutTimeLimit() {
        User owner = user(7, "owner@example.com");
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));

        assertThatThrownBy(() -> userWodService.create(
                request(WodType.AMRAP, null, exerciseRequest(12, 1,
                        prescription("10", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(InvalidUserWodException.class)
                .hasMessage("El time limit es obligatorio para AMRAP");
        then(exerciseRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_RejectsDuplicateOrNonConsecutivePositions() {
        User owner = user(7, "owner@example.com");
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));

        assertThatThrownBy(() -> userWodService.create(
                request(WodType.FOR_TIME, null,
                        exerciseRequest(12, 1, prescription("10", WodExercisePrescriptionUnit.REPS, null)),
                        exerciseRequest(12, 1, prescription("12", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(InvalidUserWodException.class)
                .hasMessage("Las posiciones deben ser unicas, positivas y consecutivas desde 1");
        then(exerciseRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_RejectsPrescriptionIncompatibleWithMeasurementType() {
        User owner = user(7, "owner@example.com");
        Exercise exercise = exercise(12, "Run", MeasurementType.DISTANCE);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(exerciseRepository.findAllById(any())).willReturn(List.of(exercise));

        assertThatThrownBy(() -> userWodService.create(
                request(WodType.FOR_TIME, null, exerciseRequest(12, 1,
                        prescription("10", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(InvalidUserWodException.class)
                .hasMessage("Las prescripciones no son compatibles con el tipo de medicion del ejercicio");
        then(wodRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_ValidatesWeightDistanceAndTrimsOtherLabel() {
        User owner = user(7, "owner@example.com");
        Exercise weightedRun = exercise(12, "Weighted Run", MeasurementType.WEIGHT_DISTANCE);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(exerciseRepository.findAllById(any())).willReturn(List.of(weightedRun));
        given(wodRepository.saveAndFlush(any(Wod.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        UserWodDetailResponse response = userWodService.create(
                request(WodType.FOR_TIME, null, exerciseRequest(12, 1,
                        prescription("20.5", WodExercisePrescriptionUnit.KG, null),
                        prescription("400", WodExercisePrescriptionUnit.METERS, null))),
                AUTHENTICATED_EMAIL);

        assertThat(response.exercises().get(0).prescriptions())
                .extracting("unit")
                .containsExactlyInAnyOrder(WodExercisePrescriptionUnit.KG,
                        WodExercisePrescriptionUnit.METERS);
    }

    @Test
    void create_ValidatesWeightWithRepsAndKg() {
        User owner = user(7, "owner@example.com");
        Exercise weightedExercise = exercise(12, "Back Squat", MeasurementType.WEIGHT);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(exerciseRepository.findAllById(any())).willReturn(List.of(weightedExercise));
        given(wodRepository.saveAndFlush(any(Wod.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        UserWodDetailResponse response = userWodService.create(
                request(WodType.FOR_TIME, null, exerciseRequest(12, 1,
                        prescription("10", WodExercisePrescriptionUnit.REPS, null),
                        prescription("60", WodExercisePrescriptionUnit.KG, null))),
                AUTHENTICATED_EMAIL);

        assertThat(response.exercises().get(0).prescriptions())
                .extracting("unit")
                .containsExactlyInAnyOrder(WodExercisePrescriptionUnit.REPS,
                        WodExercisePrescriptionUnit.KG);
        assertThat(response.exercises().get(0).prescriptions())
                .extracting("value")
                .containsExactlyInAnyOrder(new BigDecimal("10"), new BigDecimal("60"));
    }

    @Test
    void create_RejectsWeightWithoutBothRepsAndKg() {
        User owner = user(7, "owner@example.com");
        Exercise weightedExercise = exercise(12, "Back Squat", MeasurementType.WEIGHT);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(exerciseRepository.findAllById(any())).willReturn(List.of(weightedExercise));

        assertThatThrownBy(() -> userWodService.create(
                request(WodType.FOR_TIME, null, exerciseRequest(12, 1,
                        prescription("60", WodExercisePrescriptionUnit.KG, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(InvalidUserWodException.class)
                .hasMessage("Las prescripciones no son compatibles con el tipo de medicion del ejercicio");
        then(wodRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_RejectsRepeatedPrescriptionUnit() {
        User owner = user(7, "owner@example.com");
        Exercise weightedExercise = exercise(12, "Back Squat", MeasurementType.WEIGHT);
        given(userRepository.findByEmail("owner@example.com")).willReturn(Optional.of(owner));
        given(exerciseRepository.findAllById(any())).willReturn(List.of(weightedExercise));

        assertThatThrownBy(() -> userWodService.create(
                request(WodType.FOR_TIME, null, exerciseRequest(12, 1,
                        prescription("10", WodExercisePrescriptionUnit.REPS, null),
                        prescription("12", WodExercisePrescriptionUnit.REPS, null))),
                AUTHENTICATED_EMAIL))
                .isInstanceOf(InvalidUserWodException.class)
                .hasMessage("No se permiten unidades repetidas en un ejercicio");
        then(wodRepository).shouldHaveNoInteractions();
    }

    private UserWodCreateRequest request(
            WodType type,
            Integer timeLimit,
            UserWodExerciseRequest... exercises) {
        return new UserWodCreateRequest(
                "  Fran  ", type, com.wodexplorer.entity.WodCategory.METCON,
                WodLevel.RX, timeLimit, null, List.of(exercises));
    }

    private UserWodUpdateRequest updateRequest(
            WodType type,
            Integer timeLimit,
            UserWodExerciseRequest... exercises) {
        return new UserWodUpdateRequest(
                "  Fran  ", type, com.wodexplorer.entity.WodCategory.METCON,
                WodLevel.RX, timeLimit, null, List.of(exercises));
    }

    private UserWodExerciseRequest exerciseRequest(
            int exerciseId,
            int position,
            UserWodPrescriptionRequest... prescriptions) {
        return new UserWodExerciseRequest(exerciseId, position, List.of(prescriptions));
    }

    private UserWodPrescriptionRequest prescription(
            String value,
            WodExercisePrescriptionUnit unit,
            String unitLabel) {
        return new UserWodPrescriptionRequest(new BigDecimal(value), unit, unitLabel);
    }

    private WodExercisePrescription prescriptionEntity(
            String value,
            WodExercisePrescriptionUnit unit) {
        WodExercisePrescription prescription = new WodExercisePrescription();
        prescription.setValue(new BigDecimal(value));
        prescription.setUnit(unit);
        return prescription;
    }

    private User user(int id, String email) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setEmail(email);
        return user;
    }

    private Exercise exercise(int id, String name, MeasurementType measurementType) {
        Exercise exercise = new Exercise();
        ReflectionTestUtils.setField(exercise, "id", id);
        exercise.setName(name);
        exercise.setCategory(ExerciseCategory.CARDIO);
        exercise.setMeasurementType(measurementType);
        return exercise;
    }

    private Wod wod(int id, String name, WodType type) {
        Wod wod = new Wod();
        wod.setId(id);
        wod.setName(name);
        wod.setType(type);
        wod.setLevel(WodLevel.RX);
        ReflectionTestUtils.setField(wod, "createdAt", LocalDateTime.of(2026, 9, 14, 10, 0));
        return wod;
    }

    private WodExercise wodExercise(Exercise exercise, int position) {
        WodExercise wodExercise = new WodExercise();
        wodExercise.setExercise(exercise);
        wodExercise.setPosition(position);
        return wodExercise;
    }
}
