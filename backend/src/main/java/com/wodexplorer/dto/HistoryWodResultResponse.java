package com.wodexplorer.dto;

import java.time.LocalDateTime;

import com.wodexplorer.entity.WodLevel;

public record HistoryWodResultResponse(
        Integer id,
        Integer wodId,
        String wodName,
        Integer timeSeconds,
        Integer rounds,
        Integer reps,
        WodLevel level,
        LocalDateTime completedAt
) {
}
