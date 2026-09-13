package com.wodexplorer.dto;

import java.time.LocalDateTime;

import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;

public record WodPersonalRecordResponse(
        Integer resultId,
        Integer wodId,
        String wodName,
        WodType wodType,
        WodLevel level,
        Integer timeSeconds,
        Integer rounds,
        Integer reps,
        LocalDateTime completedAt
) {
}
