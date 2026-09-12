package com.trainguard.backend.recovery;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.List;

@Converter
public class PainLocationEnumConverter implements AttributeConverter<List<Integer>, String> {

    @Override
    public String convertToDatabaseColumn(List<Integer> value) {
        if (value == null || value.isEmpty()) {
            return null;
        }

        return value.stream()
                .map(String::valueOf)
                .collect(java.util.stream.Collectors.joining(","));
    }

    @Override
    public List<Integer> convertToEntityAttribute(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }

        try {
            return Arrays.stream(value.split(","))
                    .map(String::trim)
                    .map(Integer::valueOf)
                    .toList();
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Unable to deserialize pain location enum.", exception);
        }
    }
}
