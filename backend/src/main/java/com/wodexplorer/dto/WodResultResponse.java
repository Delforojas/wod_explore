package com.wodexplorer.dto;

import java.time.LocalDateTime;

import com.wodexplorer.entity.WodLevel;

public record WodResultResponse(
        Integer id,
        Integer wodId,
        Integer timeSeconds,
        Integer rounds,
        Integer reps,
        WodLevel level,
        LocalDateTime completedAt
) {
}
