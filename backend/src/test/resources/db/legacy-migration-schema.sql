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

INSERT INTO users (name, last_name, email, password_hash)
VALUES ('Migration', 'Test', 'migration@example.com', 'not-a-real-password-hash');

INSERT INTO wods (name, type, level)
VALUES ('Legacy global', 'FOR_TIME', 'RX');

INSERT INTO exercises (name, measurement_type)
VALUES ('Legacy reps', 'REPS');

INSERT INTO wod_exercises (wod_id, exercise_id, reps, position)
VALUES (1, 1, 21, 1), (1, 1, NULL, 2);
