package com.wodexplorer.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.junit.jupiter.api.Test;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
class WodFavoriteMigrationTest {

    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4")
            .withDatabaseName("wod_explorer_favorite_migration_test")
            .withUsername("wod_test")
            .withPassword("wod_test_password")
            .withInitScript("db/test-schema.sql");

    @Test
    void migrationCreatesFavoriteTableWithConstraintsAndCascades() throws Exception {
        try (Connection connection = DriverManager.getConnection(
                MYSQL.getJdbcUrl(), MYSQL.getUsername(), MYSQL.getPassword())) {
            String migration = Files.readString(
                    Path.of("../Docker/mysql/migrations/V030__add_wod_favorites.sql"),
                    StandardCharsets.UTF_8);

            try (Statement statement = connection.createStatement()) {
                statement.executeUpdate("DROP TABLE wod_favorites");
                statement.execute(migration);

                assertThat(tableExists(statement, "wod_favorites")).isTrue();
                assertThat(columnExists(statement, "wod_favorites", "created_at")).isTrue();
                assertThat(indexExists(statement, "wod_favorites", "wod_favorites_wod_idx"))
                        .isTrue();
                assertThat(indexExists(statement, "wod_favorites",
                        "wod_favorites_user_created_wod_idx")).isTrue();
                assertThat(foreignKeyExists(statement, "wod_favorites", "user_id", "users", "id"))
                        .isTrue();
                assertThat(foreignKeyExists(statement, "wod_favorites", "wod_id", "wods", "id"))
                        .isTrue();

                statement.executeUpdate(
                        "INSERT INTO users (name, last_name, email, password_hash) "
                                + "VALUES ('Test', 'Athlete', 'migration@example.com', 'hash')");
                statement.executeUpdate(
                        "INSERT INTO wods (name, type, level) VALUES ('Migration WOD', 'FOR_TIME', 'RX')");
                statement.executeUpdate(
                        "INSERT INTO wod_favorites (user_id, wod_id) VALUES (1, 1)");

                assertThatThrownBy(() -> statement.executeUpdate(
                        "INSERT INTO wod_favorites (user_id, wod_id) VALUES (1, 1)"))
                        .isInstanceOf(SQLException.class);

                statement.executeUpdate("DELETE FROM users WHERE id = 1");
                assertThat(count(statement, "wod_favorites", "user_id = 1")).isZero();
            }
        }
    }

    private int count(Statement statement, String table, String condition) throws Exception {
        try (ResultSet result = statement.executeQuery(
                "SELECT COUNT(*) FROM " + table + " WHERE " + condition)) {
            result.next();
            return result.getInt(1);
        }
    }

    private boolean tableExists(Statement statement, String table) throws Exception {
        try (ResultSet result = statement.executeQuery("SHOW TABLES LIKE '" + table + "'")) {
            return result.next();
        }
    }

    private boolean columnExists(Statement statement, String table, String column) throws Exception {
        try (ResultSet result = statement.executeQuery(
                "SELECT COUNT(*) FROM information_schema.columns "
                        + "WHERE table_schema = DATABASE() AND table_name = '" + table
                        + "' AND column_name = '" + column + "'")) {
            result.next();
            return result.getInt(1) == 1;
        }
    }

    private boolean indexExists(Statement statement, String table, String index) throws Exception {
        try (ResultSet result = statement.executeQuery(
                "SELECT COUNT(*) FROM information_schema.statistics "
                        + "WHERE table_schema = DATABASE() AND table_name = '" + table
                        + "' AND index_name = '" + index + "'")) {
            result.next();
            return result.getInt(1) > 0;
        }
    }

    private boolean foreignKeyExists(
            Statement statement,
            String table,
            String column,
            String referencedTable,
            String referencedColumn) throws Exception {
        String sql = "SELECT COUNT(*) FROM information_schema.key_column_usage "
                + "WHERE table_schema = DATABASE() AND table_name = '" + table
                + "' AND column_name = '" + column + "' AND referenced_table_name = '"
                + referencedTable + "' AND referenced_column_name = '" + referencedColumn + "'";
        try (ResultSet result = statement.executeQuery(sql)) {
            result.next();
            return result.getInt(1) == 1;
        }
    }
}
