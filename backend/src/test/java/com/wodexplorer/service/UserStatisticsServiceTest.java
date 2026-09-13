package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.wodexplorer.dto.UserEvolutionResponse;
import com.wodexplorer.dto.UserStatisticsResponse;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodResult;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.repository.ExerciseResultRepository;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodResultRepository;

@ExtendWith(MockitoExtension.class)
class UserStatisticsServiceTest {

    private static final String EMAIL = "athlete@example.com";
    private static final LocalDateTime OLDER = LocalDateTime.of(2026, 9, 10, 10, 0);
    private static final LocalDateTime NEWER = LocalDateTime.of(2026, 9, 12, 10, 0);

    @Mock
    private UserRepository userRepository;

    @Mock
    private WodResultRepository wodResultRepository;

    @Mock
    private ExerciseResultRepository exerciseResultRepository;

    private UserStatisticsService userStatisticsService;

    @BeforeEach
    void setUp() {
        userStatisticsService = new UserStatisticsService(
                userRepository, wodResultRepository, exerciseResultRepository);
    }

    @Test
    void findStatistics_CalculatesWodAndExerciseRecordsForAuthenticatedUser() {
        User user = user(4);
        Wod forTime = wod(20, "Fran", WodType.FOR_TIME);
        Wod amrap = wod(21, "Cindy", WodType.AMRAP);
        Wod emom = wod(22, "Engine", WodType.EMOM);
        Exercise squat = exercise(125, "Back Squat", MeasurementType.WEIGHT);
        Exercise run = exercise(126, "Run", MeasurementType.TIME);
        WodResult slow = wodResult(1, user, forTime, WodLevel.RX, 400, null, null, OLDER);
        WodResult bestForTime = wodResult(2, user, forTime, WodLevel.RX, 300, null, null, OLDER);
        WodResult sameTimeLater = wodResult(3, user, forTime, WodLevel.RX, 300, null, null, NEWER);
        WodResult beginnerForTime = wodResult(
                4, user, forTime, WodLevel.BEGINNER, 500, null, null, NEWER);
        WodResult bestAmrap = wodResult(5, user, amrap, WodLevel.RX, null, 5, 12, OLDER);
        WodResult weakerAmrap = wodResult(6, user, amrap, WodLevel.RX, null, 5, 10, NEWER);
        WodResult bestEmom = wodResult(7, user, emom, WodLevel.RX, null, null, 25, NEWER);
        ExerciseResult lighterSquat = exerciseResult(
                8, user, squat, "100.00", ExerciseRecordType.ONE_RM,
                ExerciseResultUnit.KG, OLDER);
        ExerciseResult bestSquat = exerciseResult(
                9, user, squat, "120.00", ExerciseRecordType.ONE_RM,
                ExerciseResultUnit.KG, NEWER);
        ExerciseResult slowerRun = exerciseResult(
                10, user, run, "400.00", ExerciseRecordType.BEST_TIME,
                ExerciseResultUnit.SECONDS, OLDER);
        ExerciseResult bestRun = exerciseResult(
                11, user, run, "350.00", ExerciseRecordType.BEST_TIME,
                ExerciseResultUnit.SECONDS, NEWER);
        List<WodResult> wodResults = List.of(
                slow, bestForTime, sameTimeLater, beginnerForTime,
                bestAmrap, weakerAmrap, bestEmom);
        List<ExerciseResult> exerciseResults = List.of(
                lighterSquat, bestSquat, slowerRun, bestRun);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodResultRepository.findByUser_IdOrderByCompletedAtAscIdAsc(4))
                .willReturn(wodResults);
        given(exerciseResultRepository.findByUser_IdOrderByPerformedAtAscIdAsc(4))
                .willReturn(exerciseResults);

        UserStatisticsResponse response = userStatisticsService
                .findStatistics(" ATHLETE@EXAMPLE.COM ");

        assertThat(response.wodResultsCount()).isEqualTo(7);
        assertThat(response.exerciseResultsCount()).isEqualTo(4);
        assertThat(response.wodPersonalRecords()).hasSize(4);
        assertThat(response.wodPersonalRecords()).extracting("resultId")
                .containsExactly(4, 3, 5, 7);
        assertThat(response.wodPersonalRecords().get(2).rounds()).isEqualTo(5);
        assertThat(response.wodPersonalRecords().get(2).reps()).isEqualTo(12);
        assertThat(response.exercisePersonalRecords()).hasSize(2);
        assertThat(response.exercisePersonalRecords()).extracting("resultId")
                .containsExactly(9, 11);
        then(wodResultRepository).should().findByUser_IdOrderByCompletedAtAscIdAsc(4);
        then(exerciseResultRepository).should().findByUser_IdOrderByPerformedAtAscIdAsc(4);
    }

    @Test
    void findStatistics_WhenValuesTie_UsesMostRecentThenHighestId() {
        User user = user(4);
        Wod wod = wod(20, "Fran", WodType.FOR_TIME);
        Exercise exercise = exercise(125, "Back Squat", MeasurementType.WEIGHT);
        WodResult olderWod = wodResult(1, user, wod, WodLevel.RX, 300, null, null, OLDER);
        WodResult newerWod = wodResult(2, user, wod, WodLevel.RX, 300, null, null, NEWER);
        ExerciseResult olderExercise = exerciseResult(
                3, user, exercise, "120.00", ExerciseRecordType.ONE_RM,
                ExerciseResultUnit.KG, OLDER);
        ExerciseResult newerExercise = exerciseResult(
                4, user, exercise, "120.00", ExerciseRecordType.ONE_RM,
                ExerciseResultUnit.KG, NEWER);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodResultRepository.findByUser_IdOrderByCompletedAtAscIdAsc(4))
                .willReturn(List.of(olderWod, newerWod));
        given(exerciseResultRepository.findByUser_IdOrderByPerformedAtAscIdAsc(4))
                .willReturn(List.of(olderExercise, newerExercise));

        UserStatisticsResponse response = userStatisticsService.findStatistics(EMAIL);

        assertThat(response.wodPersonalRecords().getFirst().resultId()).isEqualTo(2);
        assertThat(response.exercisePersonalRecords().getFirst().resultId()).isEqualTo(4);
    }

    @Test
    void findEvolution_MapsBothCollectionsAndPreservesRepositoryOrder() {
        User user = user(4);
        Wod wod = wod(20, "Fran", WodType.FOR_TIME);
        Exercise exercise = exercise(125, "Back Squat", MeasurementType.WEIGHT);
        WodResult wodResult = wodResult(1, user, wod, WodLevel.RX, 300, null, null, OLDER);
        ExerciseResult exerciseResult = exerciseResult(
                2, user, exercise, "120.00", ExerciseRecordType.ONE_RM,
                ExerciseResultUnit.KG, NEWER);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodResultRepository.findByUser_IdOrderByCompletedAtAscIdAsc(4))
                .willReturn(List.of(wodResult));
        given(exerciseResultRepository.findByUser_IdOrderByPerformedAtAscIdAsc(4))
                .willReturn(List.of(exerciseResult));

        UserEvolutionResponse response = userStatisticsService.findEvolution(EMAIL);

        assertThat(response.wodResults()).singleElement()
                .satisfies(point -> {
                    assertThat(point.resultId()).isEqualTo(1);
                    assertThat(point.wodName()).isEqualTo("Fran");
                });
        assertThat(response.exerciseResults()).singleElement()
                .satisfies(point -> {
                    assertThat(point.resultId()).isEqualTo(2);
                    assertThat(point.exerciseName()).isEqualTo("Back Squat");
                });
    }

    @Test
    void findStatistics_WhenUserHasNoResults_ReturnsEmptyListsAndZeroCounts() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4)));
        given(wodResultRepository.findByUser_IdOrderByCompletedAtAscIdAsc(4))
                .willReturn(List.of());
        given(exerciseResultRepository.findByUser_IdOrderByPerformedAtAscIdAsc(4))
                .willReturn(List.of());

        UserStatisticsResponse response = userStatisticsService.findStatistics(EMAIL);

        assertThat(response.wodResultsCount()).isZero();
        assertThat(response.exerciseResultsCount()).isZero();
        assertThat(response.wodPersonalRecords()).isEmpty();
        assertThat(response.exercisePersonalRecords()).isEmpty();
    }

    @Test
    void findEvolution_WhenUserDoesNotExist_DoesNotQueryResults() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.empty());

        assertThatThrownBy(() -> userStatisticsService.findEvolution(EMAIL))
                .isInstanceOf(AuthenticatedUserNotFoundException.class);
        then(wodResultRepository).shouldHaveNoInteractions();
        then(exerciseResultRepository).shouldHaveNoInteractions();
    }

    private User user(int id) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setEmail(EMAIL);
        return user;
    }

    private Wod wod(int id, String name, WodType type) {
        Wod wod = new Wod();
        wod.setId(id);
        wod.setName(name);
        wod.setType(type);
        return wod;
    }

    private Exercise exercise(int id, String name, MeasurementType measurementType) {
        Exercise exercise = new Exercise();
        ReflectionTestUtils.setField(exercise, "id", id);
        exercise.setName(name);
        exercise.setMeasurementType(measurementType);
        return exercise;
    }

    private WodResult wodResult(
            int id,
            User user,
            Wod wod,
            WodLevel level,
            Integer timeSeconds,
            Integer rounds,
            Integer reps,
            LocalDateTime completedAt) {
        WodResult result = new WodResult();
        ReflectionTestUtils.setField(result, "id", id);
        result.setUser(user);
        result.setWod(wod);
        result.setLevel(level);
        result.setTimeSeconds(timeSeconds);
        result.setRounds(rounds);
        result.setReps(reps);
        result.setCompletedAt(completedAt);
        return result;
    }

    private ExerciseResult exerciseResult(
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
