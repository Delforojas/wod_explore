package com.wodexplorer.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class ExerciseResultRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ExerciseResultRepository exerciseResultRepository;

    @Test
    void findByUserAndExercise_ReturnsOnlyMatchingResultsInStableOrder() {
        User firstUser = persistUser();
        User secondUser = persistUser();
        Exercise exercise = persistExercise("WEIGHT");
        Exercise otherExercise = persistExercise("OTHER");
        LocalDateTime older = LocalDateTime.of(2026, 9, 10, 10, 0);
        LocalDateTime newer = LocalDateTime.of(2026, 9, 12, 10, 0);

        ExerciseResult olderResult = persistResult(
                firstUser, exercise, "100.00", ExerciseRecordType.ONE_RM, older);
        ExerciseResult newerResult = persistResult(
                firstUser, exercise, "120.00", ExerciseRecordType.ONE_RM, newer);
        persistResult(secondUser, exercise, "140.00", ExerciseRecordType.ONE_RM, newer);
        ExerciseResult otherExerciseResult = persistResult(
                firstUser, otherExercise, "160.00", ExerciseRecordType.ONE_RM, newer);
        entityManager.flush();
        entityManager.clear();

        List<ExerciseResult> results = exerciseResultRepository
                .findByUser_IdAndExercise_IdOrderByPerformedAtDescIdDesc(
                        firstUser.getId(), exercise.getId());

        assertThat(results).extracting(ExerciseResult::getId)
                .containsExactly(newerResult.getId(), olderResult.getId());

        List<ExerciseResult> userResults = exerciseResultRepository
                .findByUser_IdOrderByPerformedAtDescIdDesc(firstUser.getId());
        assertThat(userResults).extracting(ExerciseResult::getId)
                .containsExactly(otherExerciseResult.getId(), newerResult.getId(), olderResult.getId());
    }

    @Test
    void findBestValue_ReturnsHighestValueForRequestedRecordType() {
        User user = persistUser();
        Exercise exercise = persistExercise("WEIGHT");
        persistResult(user, exercise, "100.00", ExerciseRecordType.ONE_RM,
                LocalDateTime.of(2026, 9, 10, 10, 0));
        ExerciseResult best = persistResult(user, exercise, "120.00", ExerciseRecordType.ONE_RM,
                LocalDateTime.of(2026, 9, 12, 10, 0));
        persistResult(user, exercise, "200.00", ExerciseRecordType.THREE_RM,
                LocalDateTime.of(2026, 9, 12, 11, 0));
        entityManager.flush();
        entityManager.clear();

        ExerciseResult result = exerciseResultRepository
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueDescPerformedAtDescIdDesc(
                        user.getId(), exercise.getId(), ExerciseRecordType.ONE_RM)
                .orElseThrow();

        assertThat(result.getId()).isEqualTo(best.getId());
        assertThat(result.getValue()).isEqualByComparingTo("120.00");
    }

    @Test
    void findBestTime_ReturnsLowestValue() {
        User user = persistUser();
        Exercise exercise = persistExercise("TIME");
        persistResult(user, exercise, "400.00", ExerciseRecordType.BEST_TIME,
                LocalDateTime.of(2026, 9, 10, 10, 0));
        ExerciseResult best = persistResult(user, exercise, "342.00", ExerciseRecordType.BEST_TIME,
                LocalDateTime.of(2026, 9, 12, 10, 0));
        entityManager.flush();
        entityManager.clear();

        ExerciseResult result = exerciseResultRepository
                .findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueAscPerformedAtDescIdDesc(
                        user.getId(), exercise.getId(), ExerciseRecordType.BEST_TIME)
                .orElseThrow();

        assertThat(result.getId()).isEqualTo(best.getId());
        assertThat(result.getValue()).isEqualByComparingTo("342.00");
    }

    @Test
    void findByUserAscending_LoadsExerciseAndOrdersByDateAndId() {
        User user = persistUser();
        Exercise exercise = persistExercise("WEIGHT");
        LocalDateTime older = LocalDateTime.of(2026, 9, 10, 10, 0);
        LocalDateTime newer = LocalDateTime.of(2026, 9, 12, 10, 0);
        ExerciseResult olderResult = persistResult(
                user, exercise, "100.00", ExerciseRecordType.ONE_RM, older);
        ExerciseResult newerResult = persistResult(
                user, exercise, "120.00", ExerciseRecordType.ONE_RM, newer);
        entityManager.flush();
        entityManager.clear();

        List<ExerciseResult> results = exerciseResultRepository
                .findByUser_IdOrderByPerformedAtAscIdAsc(user.getId());

        assertThat(results).extracting(ExerciseResult::getId)
                .containsExactly(olderResult.getId(), newerResult.getId());
        assertThat(Hibernate.isInitialized(results.getFirst().getExercise())).isTrue();
    }

    private User persistUser() {
        User user = new User();
        user.setName("Test");
        user.setLastName("Athlete");
        user.setEmail("exercise-result-test-" + UUID.randomUUID() + "@example.com");
        user.setPasswordHash("not-a-real-password-hash");
        return entityManager.persistFlushFind(user);
    }

    private Exercise persistExercise(String type) {
        Exercise exercise = new Exercise();
        exercise.setName("Repository test exercise " + type + " " + UUID.randomUUID());
        exercise.setCategory(ExerciseCategory.WEIGHTLIFTING);
        exercise.setMeasurementType(MeasurementType.valueOf(type));
        return entityManager.persistFlushFind(exercise);
    }

    private ExerciseResult persistResult(
            User user,
            Exercise exercise,
            String value,
            ExerciseRecordType recordType,
            LocalDateTime performedAt) {
        ExerciseResult result = new ExerciseResult();
        result.setUser(user);
        result.setExercise(exercise);
        result.setValue(new BigDecimal(value));
        result.setUnit(recordType == ExerciseRecordType.BEST_TIME
                ? ExerciseResultUnit.SECONDS : ExerciseResultUnit.KG);
        result.setRecordType(recordType);
        result.setPerformedAt(performedAt);
        return entityManager.persist(result);
    }
}
