package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.wodexplorer.dto.ExerciseResultRequest;
import com.wodexplorer.dto.ExerciseResultResponse;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.ExerciseResultNotFoundException;
import com.wodexplorer.exception.InvalidExerciseResultException;
import com.wodexplorer.repository.ExerciseRepository;
import com.wodexplorer.repository.ExerciseResultRepository;
import com.wodexplorer.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ExerciseResultServiceTest {

    private static final LocalDateTime NOW = LocalDateTime.of(2026, 9, 12, 18, 30);
    private static final String EMAIL = "athlete@example.com";

    @Mock
    private UserRepository userRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private ExerciseResultRepository exerciseResultRepository;

    @Captor
    private ArgumentCaptor<ExerciseResult> resultCaptor;

    private ExerciseResultService exerciseResultService;

    @BeforeEach
    void setUp() {
        exerciseResultService = new ExerciseResultService(
                userRepository,
                exerciseRepository,
                exerciseResultRepository,
                Clock.fixed(Instant.parse("2026-09-12T18:30:00Z"), ZoneOffset.UTC));
    }

    @Test
    void create_WeightResult_AssociatesAuthenticatedUserAndExercise() {
        User user = user(4, EMAIL);
        Exercise exercise = exercise(18, MeasurementType.WEIGHT);
        ExerciseResultRequest request = new ExerciseResultRequest(
                new BigDecimal("100.00"),
                ExerciseResultUnit.KG,
                ExerciseRecordType.ONE_RM,
                NOW);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(exerciseRepository.findById(18)).willReturn(Optional.of(exercise));
        given(exerciseResultRepository.save(any(ExerciseResult.class)))
                .willAnswer(invocation -> {
                    ExerciseResult result = invocation.getArgument(0);
                    ReflectionTestUtils.setField(result, "id", 42);
                    return result;
                });

        ExerciseResultResponse response = exerciseResultService.create(
                18, request, " ATHLETE@EXAMPLE.COM ");

        then(exerciseResultRepository).should().save(resultCaptor.capture());
        ExerciseResult savedResult = resultCaptor.getValue();
        assertThat(savedResult.getUser()).isSameAs(user);
        assertThat(savedResult.getExercise()).isSameAs(exercise);
        assertThat(response).isEqualTo(new ExerciseResultResponse(
                42, 18, new BigDecimal("100.00"), ExerciseResultUnit.KG,
                ExerciseRecordType.ONE_RM, NOW));
    }

    @Test
    void create_RepsResult_RequiresIntegerValue() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(exerciseRepository.findById(18))
                .willReturn(Optional.of(exercise(18, MeasurementType.REPS)));

        assertThatThrownBy(() -> exerciseResultService.create(
                18,
                new ExerciseResultRequest(
                        new BigDecimal("12.5"),
                        ExerciseResultUnit.REPS,
                        ExerciseRecordType.MAX_REPS,
                        NOW),
                EMAIL))
                .isInstanceOf(InvalidExerciseResultException.class)
                .hasMessage("value debe ser un entero para la unidad REPS");
        then(exerciseResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenMeasurementDoesNotMatchRequest_RejectsWithoutSaving() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(exerciseRepository.findById(18))
                .willReturn(Optional.of(exercise(18, MeasurementType.TIME)));

        assertThatThrownBy(() -> exerciseResultService.create(
                18,
                new ExerciseResultRequest(
                        new BigDecimal("100.00"),
                        ExerciseResultUnit.KG,
                        ExerciseRecordType.ONE_RM,
                        NOW),
                EMAIL))
                .isInstanceOf(InvalidExerciseResultException.class)
                .hasMessage("unit y recordType no son compatibles con measurementType del ejercicio");
        then(exerciseResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenPerformedAtIsFuture_RejectsWithoutSaving() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(exerciseRepository.findById(18))
                .willReturn(Optional.of(exercise(18, MeasurementType.WEIGHT)));

        assertThatThrownBy(() -> exerciseResultService.create(
                18,
                new ExerciseResultRequest(
                        new BigDecimal("100.00"),
                        ExerciseResultUnit.KG,
                        ExerciseRecordType.ONE_RM,
                        NOW.plusSeconds(1)),
                EMAIL))
                .isInstanceOf(InvalidExerciseResultException.class)
                .hasMessage("performedAt no puede ser una fecha futura");
        then(exerciseResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenAuthenticatedUserDoesNotExist_RejectsBeforeLoadingExercise() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.empty());

        assertThatThrownBy(() -> exerciseResultService.create(
                18,
                new ExerciseResultRequest(
                        new BigDecimal("100.00"), ExerciseResultUnit.KG,
                        ExerciseRecordType.ONE_RM, NOW),
                EMAIL))
                .isInstanceOf(AuthenticatedUserNotFoundException.class);
        then(exerciseRepository).shouldHaveNoInteractions();
        then(exerciseResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void findOwnResults_FiltersByAuthenticatedUserAndExercise() {
        User user = user(4, EMAIL);
        Exercise exercise = exercise(18, MeasurementType.WEIGHT);
        ExerciseResult result = result(42, user, exercise, "100.00", ExerciseRecordType.ONE_RM,
                ExerciseResultUnit.KG, NOW);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(exerciseRepository.findById(18)).willReturn(Optional.of(exercise));
        given(exerciseResultRepository.findByUser_IdAndExercise_IdOrderByPerformedAtDescIdDesc(4, 18))
                .willReturn(List.of(result));

        List<ExerciseResultResponse> response = exerciseResultService.findOwnResults(18, EMAIL);

        assertThat(response).containsExactly(new ExerciseResultResponse(
                42, 18, new BigDecimal("100.00"), ExerciseResultUnit.KG,
                ExerciseRecordType.ONE_RM, NOW));
        then(exerciseResultRepository).should()
                .findByUser_IdAndExercise_IdOrderByPerformedAtDescIdDesc(4, 18);
    }

    @Test
    void findBest_WeightUsesHighestValue() {
        User user = user(4, EMAIL);
        Exercise exercise = exercise(18, MeasurementType.WEIGHT);
        ExerciseResult result = result(42, user, exercise, "120.00", ExerciseRecordType.ONE_RM,
                ExerciseResultUnit.KG, NOW);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(exerciseRepository.findById(18)).willReturn(Optional.of(exercise));
        given(exerciseResultRepository
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueDescPerformedAtDescIdDesc(
                        4, 18, ExerciseRecordType.ONE_RM))
                .willReturn(Optional.of(result));

        ExerciseResultResponse response = exerciseResultService.findBest(18, "1RM", EMAIL);

        assertThat(response.value()).isEqualByComparingTo("120.00");
        then(exerciseResultRepository).should()
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueDescPerformedAtDescIdDesc(
                        4, 18, ExerciseRecordType.ONE_RM);
    }

    @Test
    void findBest_TimeUsesLowestValue() {
        User user = user(4, EMAIL);
        Exercise exercise = exercise(18, MeasurementType.TIME);
        ExerciseResult result = result(42, user, exercise, "342.00", ExerciseRecordType.BEST_TIME,
                ExerciseResultUnit.SECONDS, NOW);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(exerciseRepository.findById(18)).willReturn(Optional.of(exercise));
        given(exerciseResultRepository
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueAscPerformedAtDescIdDesc(
                        4, 18, ExerciseRecordType.BEST_TIME))
                .willReturn(Optional.of(result));

        ExerciseResultResponse response = exerciseResultService.findBest(
                18, "BEST_TIME", EMAIL);

        assertThat(response.unit()).isEqualTo(ExerciseResultUnit.SECONDS);
        then(exerciseResultRepository).should()
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueAscPerformedAtDescIdDesc(
                        4, 18, ExerciseRecordType.BEST_TIME);
    }

    @Test
    void findBest_WhenNoMatchingResult_ThrowsNotFound() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(exerciseRepository.findById(18))
                .willReturn(Optional.of(exercise(18, MeasurementType.WEIGHT)));
        given(exerciseResultRepository
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueDescPerformedAtDescIdDesc(
                        4, 18, ExerciseRecordType.ONE_RM))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> exerciseResultService.findBest(18, "1RM", EMAIL))
                .isInstanceOf(ExerciseResultNotFoundException.class);
    }

    private User user(int id, String email) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setEmail(email);
        return user;
    }

    private Exercise exercise(int id, MeasurementType measurementType) {
        Exercise exercise = new Exercise();
        ReflectionTestUtils.setField(exercise, "id", id);
        exercise.setMeasurementType(measurementType);
        return exercise;
    }

    private ExerciseResult result(
            int id,
            User user,
            Exercise exercise,
            String value,
            ExerciseRecordType recordType,
            ExerciseResultUnit unit,
            LocalDateTime performedAt) {
        ExerciseResult result = new ExerciseResult();
        ReflectionTestUtils.setField(result, "id", id);
        result.setUser(user);
        result.setExercise(exercise);
        result.setValue(new BigDecimal(value));
        result.setRecordType(recordType);
        result.setUnit(unit);
        result.setPerformedAt(performedAt);
        return result;
    }
}
