package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import com.wodexplorer.dto.WodResultRequest;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.support.MySqlIntegrationTest;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000"
})
class WodResultOwnershipIntegrationTest extends MySqlIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private WodResultService wodResultService;

    @Test
    void create_OwnedCustomWod_AllowsOwner() {
        String ownerEmail = uniqueEmail("owner");
        int ownerId = insertUser(ownerEmail);
        int wodId = insertWod(ownerId, "Owned custom WOD");

        wodResultService.create(
                wodId,
                new WodResultRequest(342, null, null, WodLevel.RX, null),
                ownerEmail);

        assertThat(count("SELECT COUNT(*) FROM wod_results WHERE user_id = ? AND wod_id = ?",
                ownerId, wodId)).isEqualTo(1);
    }

    @Test
    void create_CustomWodOwnedByAnotherUser_ReturnsNotFoundWithoutPersisting() {
        String ownerEmail = uniqueEmail("owner");
        String otherEmail = uniqueEmail("other");
        int ownerId = insertUser(ownerEmail);
        insertUser(otherEmail);
        int wodId = insertWod(ownerId, "Foreign custom WOD");

        assertThatThrownBy(() -> wodResultService.create(
                wodId,
                new WodResultRequest(342, null, null, WodLevel.RX, null),
                otherEmail))
                .isInstanceOf(WodNotFoundException.class);

        assertThat(count("SELECT COUNT(*) FROM wod_results WHERE wod_id = ?", wodId)).isZero();
    }

    @Test
    void findOwnResults_CustomWodOwnedByAnotherUser_ReturnsNotFoundWithoutExposingResults() {
        String ownerEmail = uniqueEmail("owner");
        String otherEmail = uniqueEmail("other");
        int ownerId = insertUser(ownerEmail);
        int otherId = insertUser(otherEmail);
        int wodId = insertWod(ownerId, "Hidden custom WOD");
        insertResult(ownerId, wodId);

        assertThatThrownBy(() -> wodResultService.findOwnResults(wodId, otherEmail))
                .isInstanceOf(WodNotFoundException.class);

        assertThat(count("SELECT COUNT(*) FROM wod_results WHERE user_id = ? AND wod_id = ?",
                ownerId, wodId)).isEqualTo(1);
        assertThat(count("SELECT COUNT(*) FROM wod_results WHERE user_id = ? AND wod_id = ?",
                otherId, wodId)).isZero();
    }

    @Test
    void create_GlobalWod_AllowsAuthenticatedUser() {
        String email = uniqueEmail("athlete");
        int userId = insertUser(email);
        int wodId = insertWod(null, "Global WOD");

        wodResultService.create(
                wodId,
                new WodResultRequest(342, null, null, WodLevel.RX, null),
                email);

        assertThat(count("SELECT COUNT(*) FROM wod_results WHERE user_id = ? AND wod_id = ?",
                userId, wodId)).isEqualTo(1);
    }

    private int insertUser(String email) {
        jdbcTemplate.update(
                "INSERT INTO users (name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
                "Test", "Athlete", email, "not-a-real-password-hash");
        return jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE email = ?", Integer.class, email);
    }

    private int insertWod(Integer ownerId, String name) {
        jdbcTemplate.update(
                "INSERT INTO wods (owner_id, name, type, level, category) VALUES (?, ?, ?, ?, ?)",
                ownerId, name + " " + UUID.randomUUID(), "FOR_TIME", "RX", "METCON");
        return jdbcTemplate.queryForObject(
                "SELECT id FROM wods WHERE name LIKE ? ORDER BY id DESC LIMIT 1",
                Integer.class, name + "%");
    }

    private void insertResult(int userId, int wodId) {
        jdbcTemplate.update(
                "INSERT INTO wod_results (user_id, wod_id, level, completed_at) VALUES (?, ?, ?, ?)",
                userId, wodId, "RX", LocalDateTime.of(2026, 9, 12, 18, 30));
    }

    private int count(String sql, Object... arguments) {
        return jdbcTemplate.queryForObject(sql, Integer.class, arguments);
    }

    private String uniqueEmail(String role) {
        return "ownership-" + role + "-" + UUID.randomUUID() + "@example.com";
    }
}
