package com.wodexplorer.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;

public record WodDetailResponse(
        Integer id,
        String name,
        WodType type,
        Integer timeLimit,
        Integer rounds,
        WodLevel level,
        LocalDateTime createdAt,
        List<WodExerciseResponse> exercises
) {
}
