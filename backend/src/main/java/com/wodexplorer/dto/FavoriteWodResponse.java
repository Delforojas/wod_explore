package com.wodexplorer.dto;

import java.time.LocalDateTime;

public record FavoriteWodResponse(
        Integer wodId,
        LocalDateTime favoritedAt) {
}
