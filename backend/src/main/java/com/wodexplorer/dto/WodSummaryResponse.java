package com.wodexplorer.dto;

import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;

public record WodSummaryResponse(
        Integer id,
        String name,
        WodType type,
        Integer timeLimit,
        Integer rounds,
        WodLevel level
) {
}
