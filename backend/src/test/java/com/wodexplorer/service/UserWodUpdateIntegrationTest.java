package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import com.wodexplorer.dto.UserWodDetailResponse;
import com.wodexplorer.dto.UserWodExerciseRequest;
import com.wodexplorer.dto.UserWodPrescriptionRequest;
import com.wodexplorer.dto.UserWodUpdateRequest;
import com.wodexplorer.entity.WodExercisePrescriptionUnit;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.InvalidUserWodException;
import com.wodexplorer.repository.WodExerciseRepository;
import com.wodexplorer.repository.WodRepository;
import com.wodexplorer.support.MySqlIntegrationTest;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000"
})
class UserWodUpdateIntegrationTest extends MySqlIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserWodService userWodService;

    @Autowired
    private WodRepository wodRepository;

    @Autowired
    private WodExerciseRepository wodExerciseRepository;

    @Test
    void update_ReplacesRowsAndPreservesOrderWithoutOrphans() {
        String email = uniqueEmail();
        int ownerId = insertUser(email);
        int oldExerciseId = insertExercise("REPS");
        int firstNewExerciseId = insertExercise("WEIGHT");
        int secondNewExerciseId = insertExercise("REPS");
        int wodId = insertWod(ownerId, "Before update");
        int oldWodExerciseId = insertWodExercise(wodId, oldExerciseId, 1);
        insertPrescription(oldWodExerciseId, "10.00", "REPS", null);

        UserWodDetailResponse response = userWodService.update(
                wodId,
                updateRequest(
                        "After update",
                        WodType.FOR_TIME,
                         null,
                         exerciseRequest(firstNewExerciseId, 1,
                                 prescription("10", WodExercisePrescriptionUnit.REPS),
                                 prescription("60", WodExercisePrescriptionUnit.KG)),
                        exerciseRequest(secondNewExerciseId, 2,
                                prescription("12", WodExercisePrescriptionUnit.REPS))),
                email);

        assertThat(response.name()).isEqualTo("After update");
        assertThat(response.exercises()).extracting(exercise -> exercise.exerciseId())
                .containsExactly(firstNewExerciseId, secondNewExerciseId);
        assertThat(jdbcTemplate.queryForObject(
                "SELECT name FROM wods WHERE id = ?", String.class, wodId))
                .isEqualTo("After update");
        assertThat(jdbcTemplate.queryForList(
                "SELECT exercise_id FROM wod_exercises WHERE wod_id = ? ORDER BY position",
                Integer.class, wodId))
                .containsExactly(firstNewExerciseId, secondNewExerciseId);
        assertThat(jdbcTemplate.queryForList(
                "SELECT position FROM wod_exercises WHERE wod_id = ? ORDER BY position",
                Integer.class, wodId))
                .containsExactly(1, 2);
        assertThat(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM wod_exercises WHERE wod_id = ?", Integer.class, wodId))
                .isEqualTo(2);
        assertThat(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM wod_exercise_prescriptions WHERE wod_exercise_id = ?",
                Integer.class, oldWodExerciseId))
                .isZero();
        int newWodExerciseId = jdbcTemplate.queryForObject(
                "SELECT id FROM wod_exercises WHERE wod_id = ? AND exercise_id = ?",
                Integer.class, wodId, firstNewExerciseId);
        assertThat(jdbcTemplate.queryForList(
                "SELECT unit FROM wod_exercise_prescriptions WHERE wod_exercise_id = ? ORDER BY unit",
                String.class, newWodExerciseId))
                .containsExactly("KG", "REPS");
        assertThat(wodRepository.findByIdAndOwner_Id(wodId, ownerId)).isPresent();
        assertThat(wodExerciseRepository.findByWodIdWithExerciseOrderByPositionAsc(wodId))
                .extracting(exercise -> exercise.getPosition())
                .containsExactly(1, 2);
    }

    @Test
    void update_WhenValidationFailsRestoresPreviousConfiguration() {
        String email = uniqueEmail();
        int ownerId = insertUser(email);
        int oldExerciseId = insertExercise("REPS");
        int validNewExerciseId = insertExercise("REPS");
        int invalidNewExerciseId = insertExercise("DISTANCE");
        int wodId = insertWod(ownerId, "Stable WOD");
        int oldWodExerciseId = insertWodExercise(wodId, oldExerciseId, 1);
        insertPrescription(oldWodExerciseId, "10.00", "REPS", null);

        assertThatThrownBy(() -> userWodService.update(
                wodId,
                updateRequest(
                        "Should not persist",
                        WodType.FOR_TIME,
                        null,
                        exerciseRequest(validNewExerciseId, 1,
                                prescription("12", WodExercisePrescriptionUnit.REPS)),
                        exerciseRequest(invalidNewExerciseId, 2,
                                prescription("400", WodExercisePrescriptionUnit.REPS))),
                email))
                .isInstanceOf(InvalidUserWodException.class);

        assertThat(jdbcTemplate.queryForObject(
                "SELECT name FROM wods WHERE id = ?", String.class, wodId))
                .isEqualTo("Stable WOD");
        assertThat(jdbcTemplate.queryForObject(
                "SELECT exercise_id FROM wod_exercises WHERE wod_id = ? AND position = 1",
                Integer.class, wodId))
                .isEqualTo(oldExerciseId);
        assertThat(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM wod_exercises WHERE wod_id = ?", Integer.class, wodId))
                .isEqualTo(1);
        assertThat(jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM wod_exercise_prescriptions WHERE wod_exercise_id = ?",
                Integer.class, oldWodExerciseId))
                .isEqualTo(1);
    }

    private UserWodUpdateRequest updateRequest(
            String name,
            WodType type,
            Integer timeLimit,
            UserWodExerciseRequest... exercises) {
        return new UserWodUpdateRequest(
                name,
                type,
                null,
                WodLevel.RX,
                timeLimit,
                null,
                List.of(exercises));
    }

    private UserWodExerciseRequest exerciseRequest(
            int exerciseId,
            int position,
            UserWodPrescriptionRequest... prescriptions) {
        return new UserWodExerciseRequest(exerciseId, position, List.of(prescriptions));
    }

    private UserWodPrescriptionRequest prescription(
            String value,
            WodExercisePrescriptionUnit unit) {
        return new UserWodPrescriptionRequest(new BigDecimal(value), unit, null);
    }

    private int insertUser(String email) {
        jdbcTemplate.update(
                "INSERT INTO users (name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
                "Test", "Athlete", email, "not-a-real-password-hash");
        return jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE email = ?", Integer.class, email);
    }

    private int insertExercise(String measurementType) {
        String name = "Exercise " + UUID.randomUUID();
        jdbcTemplate.update(
                "INSERT INTO exercises (name, category, measurement_type) VALUES (?, ?, ?)",
                name, "CARDIO", measurementType);
        return jdbcTemplate.queryForObject(
                "SELECT id FROM exercises WHERE name = ?", Integer.class, name);
    }

    private int insertWod(int ownerId, String name) {
        jdbcTemplate.update(
                "INSERT INTO wods (owner_id, name, type, level, category) VALUES (?, ?, ?, ?, ?)",
                ownerId, name, "FOR_TIME", "RX", "METCON");
        return jdbcTemplate.queryForObject(
                "SELECT id FROM wods WHERE owner_id = ? AND name = ? ORDER BY id DESC LIMIT 1",
                Integer.class, ownerId, name);
    }

    private int insertWodExercise(int wodId, int exerciseId, int position) {
        jdbcTemplate.update(
                "INSERT INTO wod_exercises (wod_id, exercise_id, position) VALUES (?, ?, ?)",
                wodId, exerciseId, position);
        return jdbcTemplate.queryForObject(
                "SELECT id FROM wod_exercises WHERE wod_id = ? AND position = ?",
                Integer.class, wodId, position);
    }

    private void insertPrescription(int wodExerciseId, String value, String unit, String unitLabel) {
        jdbcTemplate.update(
                "INSERT INTO wod_exercise_prescriptions (wod_exercise_id, value, unit, unit_label) VALUES (?, ?, ?, ?)",
                wodExerciseId, new BigDecimal(value), unit, unitLabel);
    }

    private String uniqueEmail() {
        return "update-" + UUID.randomUUID() + "@example.com";
    }
}
