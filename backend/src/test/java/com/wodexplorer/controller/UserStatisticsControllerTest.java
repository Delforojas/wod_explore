package com.wodexplorer.controller;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.wodexplorer.dto.UserEvolutionResponse;
import com.wodexplorer.dto.UserStatisticsResponse;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.security.AdminAuthorizationService;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.UserStatisticsService;

@WebMvcTest(UserStatisticsController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
class UserStatisticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserStatisticsService userStatisticsService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AdminAuthorizationService adminAuthorizationService;

    @Test
    void statistics_ReturnsCountsAndPersonalRecords() throws Exception {
        given(userStatisticsService.findStatistics("athlete@example.com"))
                .willReturn(new UserStatisticsResponse(3, 2, List.of(), List.of()));

        mockMvc.perform(get("/api/users/me/statistics")
                        .principal(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wodResultsCount").value(3))
                .andExpect(jsonPath("$.exerciseResultsCount").value(2))
                .andExpect(jsonPath("$.wodPersonalRecords").isEmpty())
                .andExpect(jsonPath("$.exercisePersonalRecords").isEmpty())
                .andExpect(jsonPath("$.userId").doesNotExist());
    }

    @Test
    void evolution_ReturnsSeparateTemporalCollections() throws Exception {
        given(userStatisticsService.findEvolution("athlete@example.com"))
                .willReturn(new UserEvolutionResponse(List.of(), List.of()));

        mockMvc.perform(get("/api/users/me/evolution")
                        .principal(authenticatedUser())
                        .queryParam("userId", "999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wodResults").isEmpty())
                .andExpect(jsonPath("$.exerciseResults").isEmpty())
                .andExpect(jsonPath("$.userId").doesNotExist());
    }

    private UsernamePasswordAuthenticationToken authenticatedUser() {
        return UsernamePasswordAuthenticationToken.authenticated(
                "athlete@example.com", null, List.of());
    }
}
