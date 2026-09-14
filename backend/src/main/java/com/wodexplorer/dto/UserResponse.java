package com.wodexplorer.dto;

import java.time.LocalDateTime;

public record UserResponse(
        Integer id,
        String name,
        String lastName,
        String email,
        LocalDateTime createdAt
) {
}
