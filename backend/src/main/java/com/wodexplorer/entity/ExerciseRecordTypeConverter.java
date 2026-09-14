package com.wodexplorer.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ExerciseRecordTypeConverter
        implements AttributeConverter<ExerciseRecordType, String> {

    @Override
    public String convertToDatabaseColumn(ExerciseRecordType attribute) {
        return attribute == null ? null : attribute.value();
    }

    @Override
    public ExerciseRecordType convertToEntityAttribute(String value) {
        return value == null
                ? null
                : ExerciseRecordType.fromValue(value)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "record_type no válido: " + value));
    }
}
