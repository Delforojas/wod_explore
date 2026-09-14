package com.wodexplorer.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import org.junit.jupiter.api.Test;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers
class WodMigrationTest {

    @Container
    static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4")
            .withDatabaseName("wod_explorer_legacy_test")
            .withUsername("wod_test")
            .withPassword("wod_test_password")
            .withInitScript("db/legacy-migration-schema.sql");

    @Test
    void migrationAddsModelAndConvertsLegacyReps() throws Exception {
        try (Connection connection = DriverManager.getConnection(
                MYSQL.getJdbcUrl(), MYSQL.getUsername(), MYSQL.getPassword())) {
            String migration = Files.readString(
                    Path.of("../Docker/mysql/migrations/V029__add_custom_wod_persistence.sql"),
                    StandardCharsets.UTF_8);

            try (Statement statement = connection.createStatement()) {
                for (String sql : migration.split(";")) {
                    if (!sql.isBlank()) {
                        statement.execute(sql);
                    }
                }

                assertThat(count(statement, "wods", "owner_id IS NULL")).isEqualTo(1);
                assertThat(count(statement, "wod_exercise_prescriptions", "unit = 'REPS'"))
                        .isEqualTo(1);
                assertThat(singleDecimal(statement,
                        "SELECT value FROM wod_exercise_prescriptions WHERE wod_exercise_id = 1"))
                        .isEqualByComparingTo("21.00");
                assertThat(columnExists(statement, "wods", "owner_id")).isTrue();
                assertThat(columnExists(statement, "wods", "category")).isTrue();
                assertThat(columnExists(statement, "wod_exercise_prescriptions", "unit_label"))
                        .isTrue();
                assertThat(indexExists(statement, "wod_exercises", "wod_exercises_wod_position_uk"))
                        .isTrue();
                assertThat(tableExists(statement, "wod_exercise_prescriptions")).isTrue();
                assertThat(foreignKeyExists(statement, "wods", "owner_id", "users", "id"))
                        .isTrue();
                assertThat(foreignKeyExists(statement, "wod_exercise_prescriptions",
                        "wod_exercise_id", "wod_exercises", "id")).isTrue();
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

    private BigDecimal singleDecimal(Statement statement, String sql) throws Exception {
        try (ResultSet result = statement.executeQuery(sql)) {
            result.next();
            return result.getBigDecimal(1);
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

    private boolean tableExists(Statement statement, String table) throws Exception {
        try (ResultSet result = statement.executeQuery("SHOW TABLES LIKE '" + table + "'")) {
            return result.next();
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
