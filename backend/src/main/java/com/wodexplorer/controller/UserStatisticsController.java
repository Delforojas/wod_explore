package com.wodexplorer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import com.wodexplorer.dto.UserEvolutionResponse;
import com.wodexplorer.dto.UserStatisticsResponse;
import com.wodexplorer.service.UserStatisticsService;

@RestController
@RequestMapping("/api/users/me")
public class UserStatisticsController {

    private final UserStatisticsService userStatisticsService;

    public UserStatisticsController(UserStatisticsService userStatisticsService) {
        this.userStatisticsService = userStatisticsService;
    }

    @GetMapping("/statistics")
    public UserStatisticsResponse statistics(Authentication authentication) {
        return userStatisticsService.findStatistics(authenticatedEmail(authentication));
    }

    @GetMapping("/evolution")
    public UserEvolutionResponse evolution(Authentication authentication) {
        return userStatisticsService.findEvolution(authenticatedEmail(authentication));
    }

    private String authenticatedEmail(Authentication authentication) {
        return authentication == null ? null : authentication.getName();
    }
}
