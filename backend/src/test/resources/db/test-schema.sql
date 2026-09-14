CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wods (
    id INT NOT NULL AUTO_INCREMENT,
    owner_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('FOR_TIME', 'AMRAP', 'EMOM') NOT NULL,
    time_limit INT DEFAULT NULL,
    rounds INT DEFAULT NULL,
    level ENUM('BEGINNER', 'INTERMEDIATE', 'RX') NOT NULL,
    category VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY wods_owner_created_id_idx (owner_id, created_at, id),
    CONSTRAINT wods_owner_fk FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT wods_category_chk CHECK (category IS NULL OR category = 'METCON')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE exercises (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category ENUM('WEIGHTLIFTING', 'GYMNASTICS', 'STRONGMAN', 'CARDIO', 'OTHER') DEFAULT NULL,
    measurement_type ENUM('WEIGHT', 'REPS', 'TIME', 'DISTANCE', 'WEIGHT_DISTANCE', 'OTHER') NOT NULL DEFAULT 'REPS',
    PRIMARY KEY (id),
    UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wod_exercises (
    id INT NOT NULL AUTO_INCREMENT,
    wod_id INT NOT NULL,
    exercise_id INT NOT NULL,
    reps INT DEFAULT NULL,
    position INT NOT NULL,
    PRIMARY KEY (id),
    KEY wod_id (wod_id),
    KEY exercise_id (exercise_id),
    UNIQUE KEY wod_exercises_wod_position_uk (wod_id, position),
    CONSTRAINT wod_exercises_wod_fk FOREIGN KEY (wod_id) REFERENCES wods (id) ON DELETE CASCADE,
    CONSTRAINT wod_exercises_exercise_fk FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE RESTRICT,
    CONSTRAINT wod_exercises_position_chk CHECK (position > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wod_exercise_prescriptions (
    id INT NOT NULL AUTO_INCREMENT,
    wod_exercise_id INT NOT NULL,
    value DECIMAL(8, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_label VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY wod_exercise_prescriptions_wod_exercise_idx (wod_exercise_id),
    UNIQUE KEY wod_exercise_prescriptions_unit_uk (wod_exercise_id, unit),
    CONSTRAINT wod_exercise_prescriptions_wod_exercise_fk
        FOREIGN KEY (wod_exercise_id) REFERENCES wod_exercises (id) ON DELETE CASCADE,
    CONSTRAINT wod_exercise_prescriptions_value_chk CHECK (value > 0),
    CONSTRAINT wod_exercise_prescriptions_unit_chk
        CHECK (unit IN ('REPS', 'METERS', 'KG', 'SECONDS', 'OTHER')),
    CONSTRAINT wod_exercise_prescriptions_integer_unit_chk
        CHECK (unit NOT IN ('REPS', 'SECONDS') OR value = FLOOR(value)),
    CONSTRAINT wod_exercise_prescriptions_label_chk
        CHECK (
            (unit = 'OTHER' AND unit_label IS NOT NULL AND CHAR_LENGTH(TRIM(unit_label)) > 0)
            OR (unit <> 'OTHER' AND unit_label IS NULL)
        )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wod_results (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    wod_id INT NOT NULL,
    time_seconds INT DEFAULT NULL,
    rounds INT DEFAULT NULL,
    reps INT DEFAULT NULL,
    level ENUM('BEGINNER', 'INTERMEDIATE', 'RX') NOT NULL,
    completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY wod_id (wod_id),
    KEY wod_results_user_completed_id_idx (user_id, completed_at, id),
    CONSTRAINT wod_results_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT wod_results_wod_fk FOREIGN KEY (wod_id) REFERENCES wods (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE exercise_results (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    value DECIMAL(8, 2) NOT NULL,
    unit ENUM('KG', 'REPS', 'SECONDS', 'METERS') NOT NULL,
    record_type ENUM('1RM', '3RM', '5RM', '10RM', 'MAX_REPS', 'BEST_TIME') NOT NULL,
    performed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY exercise_id (exercise_id),
    KEY exercise_results_user_performed_id_idx (user_id, performed_at, id),
    CONSTRAINT exercise_results_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT exercise_results_exercise_fk FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
