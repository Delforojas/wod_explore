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
    name VARCHAR(100) NOT NULL,
    type ENUM('FOR_TIME', 'AMRAP', 'EMOM') NOT NULL,
    time_limit INT DEFAULT NULL,
    rounds INT DEFAULT NULL,
    level ENUM('BEGINNER', 'INTERMEDIATE', 'RX') NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
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
    CONSTRAINT wod_exercises_wod_fk FOREIGN KEY (wod_id) REFERENCES wods (id) ON DELETE CASCADE,
    CONSTRAINT wod_exercises_exercise_fk FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE RESTRICT
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
    CONSTRAINT exercise_results_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT exercise_results_exercise_fk FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
