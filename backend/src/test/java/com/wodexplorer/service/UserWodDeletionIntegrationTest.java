package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import com.wodexplorer.exception.UserWodDeletionBlockedException;
import com.wodexplorer.support.MySqlIntegrationTest;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000"
})
class UserWodDeletionIntegrationTest extends MySqlIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserWodService userWodService;

    @Test
    void delete_RemovesWodChildrenAndPreservesCatalogExercise() {
        String email = uniqueEmail();
        int ownerId = insertUser(email);
        int exerciseId = insertExercise();
        int wodId = insertWod(ownerId, "Delete me");
        int wodExerciseId = insertWodExercise(wodId, exerciseId);
        insertPrescription(wodExerciseId);

        userWodService.delete(wodId, email);

        assertThat(count("SELECT COUNT(*) FROM wods WHERE id = ?", wodId)).isZero();
        assertThat(count("SELECT COUNT(*) FROM wod_exercises WHERE wod_id = ?", wodId)).isZero();
        assertThat(count("SELECT COUNT(*) FROM wod_exercise_prescriptions WHERE wod_exercise_id = ?",
                wodExerciseId)).isZero();
        assertThat(count("SELECT COUNT(*) FROM exercises WHERE id = ?", exerciseId)).isEqualTo(1);
    }

    @Test
    void delete_WhenWodHasResultPreservesWodChildrenAndHistory() {
        String email = uniqueEmail();
        int ownerId = insertUser(email);
        int exerciseId = insertExercise();
        int wodId = insertWod(ownerId, "Keep history");
        int wodExerciseId = insertWodExercise(wodId, exerciseId);
        insertPrescription(wodExerciseId);
        int resultId = insertWodResult(ownerId, wodId);

        assertThatThrownBy(() -> userWodService.delete(wodId, email))
                .isInstanceOf(UserWodDeletionBlockedException.class);

        assertThat(count("SELECT COUNT(*) FROM wods WHERE id = ?", wodId)).isEqualTo(1);
        assertThat(count("SELECT COUNT(*) FROM wod_exercises WHERE wod_id = ?", wodId)).isEqualTo(1);
        assertThat(count("SELECT COUNT(*) FROM wod_exercise_prescriptions WHERE wod_exercise_id = ?",
                wodExerciseId)).isEqualTo(1);
        assertThat(count("SELECT COUNT(*) FROM wod_results WHERE id = ?", resultId)).isEqualTo(1);
    }

    private int insertUser(String email) {
        jdbcTemplate.update(
                "INSERT INTO users (name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
                "Test", "Athlete", email, "not-a-real-password-hash");
        return jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE email = ?", Integer.class, email);
    }

    private int insertExercise() {
        String name = "Exercise " + UUID.randomUUID();
        jdbcTemplate.update(
                "INSERT INTO exercises (name, category, measurement_type) VALUES (?, ?, ?)",
                name, "CARDIO", "REPS");
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

    private int insertWodExercise(int wodId, int exerciseId) {
        jdbcTemplate.update(
                "INSERT INTO wod_exercises (wod_id, exercise_id, position) VALUES (?, ?, ?)",
                wodId, exerciseId, 1);
        return jdbcTemplate.queryForObject(
                "SELECT id FROM wod_exercises WHERE wod_id = ? AND position = ?",
                Integer.class, wodId, 1);
    }

    private void insertPrescription(int wodExerciseId) {
        jdbcTemplate.update(
                "INSERT INTO wod_exercise_prescriptions (wod_exercise_id, value, unit) VALUES (?, ?, ?)",
                wodExerciseId, 10, "REPS");
    }

    private int insertWodResult(int userId, int wodId) {
        jdbcTemplate.update(
                "INSERT INTO wod_results (user_id, wod_id, level, completed_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
                userId, wodId, "RX");
        return jdbcTemplate.queryForObject(
                "SELECT id FROM wod_results WHERE user_id = ? AND wod_id = ? ORDER BY id DESC LIMIT 1",
                Integer.class, userId, wodId);
    }

    private int count(String sql, int id) {
        return jdbcTemplate.queryForObject(sql, Integer.class, id);
    }

    private String uniqueEmail() {
        return "delete-" + UUID.randomUUID() + "@example.com";
    }
}
