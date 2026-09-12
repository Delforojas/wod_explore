package com.wodexplorer.entity;

import java.util.Arrays;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ExerciseRecordType {

    ONE_RM("1RM"),
    THREE_RM("3RM"),
    FIVE_RM("5RM"),
    TEN_RM("10RM"),
    MAX_REPS("MAX_REPS"),
    BEST_TIME("BEST_TIME");

    private final String value;

    ExerciseRecordType(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static ExerciseRecordType fromJson(String value) {
        return fromValue(value)
                .orElseThrow(() -> new IllegalArgumentException("recordType no válido"));
    }

    public static Optional<ExerciseRecordType> fromValue(String value) {
        return Arrays.stream(values())
                .filter(recordType -> recordType.value.equals(value))
                .findFirst();
    }
}
