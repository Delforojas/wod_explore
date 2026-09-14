package com.wodexplorer.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.wodexplorer.entity.WodCategory;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;

public record UserWodDetailResponse(
        Integer id,
        String name,
        WodType type,
        WodCategory category,
        Integer timeLimit,
        Integer rounds,
        WodLevel level,
        LocalDateTime createdAt,
        List<UserWodExerciseResponse> exercises
) {
}
