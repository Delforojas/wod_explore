-- Issue #44: add ownership and normalized prescriptions for custom WODs.
ALTER TABLE wods
    ADD COLUMN owner_id INT NULL AFTER id,
    ADD COLUMN category VARCHAR(20) NULL AFTER level,
    ADD INDEX wods_owner_created_id_idx (owner_id, created_at, id),
    ADD CONSTRAINT wods_owner_fk
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE,
    ADD CONSTRAINT wods_category_chk
        CHECK (category IS NULL OR category = 'METCON');

ALTER TABLE wod_exercises
    ADD CONSTRAINT wod_exercises_position_chk CHECK (position > 0),
    ADD CONSTRAINT wod_exercises_wod_position_uk UNIQUE (wod_id, position);

CREATE TABLE wod_exercise_prescriptions (
    id INT NOT NULL AUTO_INCREMENT,
    wod_exercise_id INT NOT NULL,
    value DECIMAL(8, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_label VARCHAR(100) NULL,
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

INSERT INTO wod_exercise_prescriptions (wod_exercise_id, value, unit)
SELECT id, CAST(reps AS DECIMAL(8, 2)), 'REPS'
FROM wod_exercises
WHERE reps IS NOT NULL;
