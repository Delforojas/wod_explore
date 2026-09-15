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

import com.wodexplorer.dto.FavoriteWodResponse;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.support.MySqlIntegrationTest;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000"
})
class WodFavoriteIntegrationTest extends MySqlIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private WodFavoriteService wodFavoriteService;

    @Test
    void addFavorite_IsIdempotentAndListIsOrdered() {
        String email = uniqueEmail("ordered");
        int userId = insertUser(email);
        int olderWodId = insertWod(null, "Older favorite");
        int newerWodId = insertWod(null, "Newer favorite");

        wodFavoriteService.addFavorite(olderWodId, email);
        wodFavoriteService.addFavorite(newerWodId, email);
        wodFavoriteService.addFavorite(newerWodId, email);

        jdbcTemplate.update(
                "UPDATE wod_favorites SET created_at = ? WHERE user_id = ? AND wod_id = ?",
                LocalDateTime.of(2026, 9, 12, 10, 0), userId, olderWodId);
        jdbcTemplate.update(
                "UPDATE wod_favorites SET created_at = ? WHERE user_id = ? AND wod_id = ?",
                LocalDateTime.of(2026, 9, 13, 10, 0), userId, newerWodId);

        assertThat(wodFavoriteService.findOwnFavorites(email))
                .containsExactly(
                        new FavoriteWodResponse(newerWodId, LocalDateTime.of(2026, 9, 13, 10, 0)),
                        new FavoriteWodResponse(olderWodId, LocalDateTime.of(2026, 9, 12, 10, 0)));
        assertThat(count("SELECT COUNT(*) FROM wod_favorites WHERE user_id = ?", userId))
                .isEqualTo(2);
    }

    @Test
    void usersAreIsolatedAndDeleteIsIdempotent() {
        String firstEmail = uniqueEmail("first");
        String secondEmail = uniqueEmail("second");
        int firstUserId = insertUser(firstEmail);
        int secondUserId = insertUser(secondEmail);
        int wodId = insertWod(null, "Shared global WOD");

        wodFavoriteService.addFavorite(wodId, firstEmail);
        wodFavoriteService.removeFavorite(wodId, secondEmail);

        assertThat(wodFavoriteService.findOwnFavorites(firstEmail))
                .extracting(FavoriteWodResponse::wodId)
                .containsExactly(wodId);
        assertThat(wodFavoriteService.findOwnFavorites(secondEmail)).isEmpty();

        wodFavoriteService.removeFavorite(wodId, firstEmail);
        wodFavoriteService.removeFavorite(wodId, firstEmail);
        assertThat(count("SELECT COUNT(*) FROM wod_favorites WHERE user_id IN (?, ?)",
                firstUserId, secondUserId)).isZero();
    }

    @Test
    void customWodCanOnlyBeFavoritedByItsOwner() {
        String ownerEmail = uniqueEmail("owner");
        String otherEmail = uniqueEmail("other");
        insertUser(ownerEmail);
        insertUser(otherEmail);
        int wodId = insertWod(userId(ownerEmail), "Private custom WOD");

        assertThatThrownBy(() -> wodFavoriteService.addFavorite(wodId, otherEmail))
                .isInstanceOf(WodNotFoundException.class);
        assertThat(count("SELECT COUNT(*) FROM wod_favorites WHERE wod_id = ?", wodId)).isZero();

        wodFavoriteService.addFavorite(wodId, ownerEmail);
        assertThat(count("SELECT COUNT(*) FROM wod_favorites WHERE wod_id = ?", wodId)).isEqualTo(1);
    }

    @Test
    void missingWodDoesNotCreateFavorite() {
        String email = uniqueEmail("missing");
        insertUser(email);

        assertThatThrownBy(() -> wodFavoriteService.addFavorite(999999, email))
                .isInstanceOf(WodNotFoundException.class);
        assertThat(wodFavoriteService.findOwnFavorites(email)).isEmpty();
    }

    @Test
    void foreignKeysCascadeForUserAndWodDeletion() {
        String userEmail = uniqueEmail("cascade-user");
        int userId = insertUser(userEmail);
        int globalWodId = insertWod(null, "Cascade user WOD");
        wodFavoriteService.addFavorite(globalWodId, userEmail);
        jdbcTemplate.update("DELETE FROM users WHERE id = ?", userId);
        assertThat(count("SELECT COUNT(*) FROM wod_favorites WHERE wod_id = ?", globalWodId)).isZero();

        String otherEmail = uniqueEmail("cascade-wod");
        int otherUserId = insertUser(otherEmail);
        int otherWodId = insertWod(null, "Cascade WOD");
        wodFavoriteService.addFavorite(otherWodId, otherEmail);
        jdbcTemplate.update("DELETE FROM wods WHERE id = ?", otherWodId);
        assertThat(count("SELECT COUNT(*) FROM wod_favorites WHERE user_id = ?", otherUserId)).isZero();
    }

    private int insertUser(String email) {
        jdbcTemplate.update(
                "INSERT INTO users (name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
                "Test", "Athlete", email, "not-a-real-password-hash");
        return userId(email);
    }

    private int userId(String email) {
        return jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE email = ?", Integer.class, email);
    }

    private int insertWod(Integer ownerId, String name) {
        String uniqueName = name + " " + UUID.randomUUID();
        jdbcTemplate.update(
                "INSERT INTO wods (owner_id, name, type, level, category) VALUES (?, ?, ?, ?, ?)",
                ownerId, uniqueName, "FOR_TIME", "RX", "METCON");
        return jdbcTemplate.queryForObject(
                "SELECT id FROM wods WHERE name = ?", Integer.class, uniqueName);
    }

    private int count(String sql, Object... arguments) {
        return jdbcTemplate.queryForObject(sql, Integer.class, arguments);
    }

    private String uniqueEmail(String role) {
        return "favorite-" + role + "-" + UUID.randomUUID() + "@example.com";
    }
}
