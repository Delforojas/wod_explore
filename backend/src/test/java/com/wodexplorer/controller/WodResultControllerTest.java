package com.wodexplorer.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.wodexplorer.dto.WodResultRequest;
import com.wodexplorer.dto.WodResultResponse;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.security.AdminAuthorizationService;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.WodResultService;

@WebMvcTest(WodResultController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
class WodResultControllerTest {

    private static final String EMAIL = "athlete@example.com";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private WodResultService wodResultService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AdminAuthorizationService adminAuthorizationService;

    @Test
    void create_WithAuthenticatedUser_ReturnsCreatedWithoutUserId() throws Exception {
        LocalDateTime completedAt = LocalDateTime.of(2026, 9, 12, 18, 30);
        given(wodResultService.create(
                eq(18),
                eq(new WodResultRequest(342, null, null, WodLevel.RX, completedAt)),
                eq(EMAIL)))
                .willReturn(new WodResultResponse(
                        42, 18, 342, null, null, WodLevel.RX, completedAt));

        mockMvc.perform(post("/api/wods/18/results")
                        .principal(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "timeSeconds": 342,
                                  "level": "RX",
                                  "completedAt": "2026-09-12T18:30:00"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.wodId").value(18))
                .andExpect(jsonPath("$.timeSeconds").value(342))
                .andExpect(jsonPath("$.level").value("RX"))
                .andExpect(jsonPath("$.completedAt").value("2026-09-12T18:30:00"))
                .andExpect(jsonPath("$.userId").doesNotExist());
    }

    @Test
    void create_WithUserIdInPayload_ReturnsBadRequestAndCannotOverrideOwner() throws Exception {
        mockMvc.perform(post("/api/wods/18/results")
                        .principal(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "timeSeconds": 342,
                                  "level": "RX",
                                  "userId": 999
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));

        then(wodResultService).shouldHaveNoInteractions();
    }

    @Test
    void create_WithMissingLevel_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/wods/18/results")
                        .principal(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "timeSeconds": 342
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.level").exists());

        then(wodResultService).shouldHaveNoInteractions();
    }

    @Test
    void findOwnResults_ReturnsOnlyServiceResultsWithoutUserId() throws Exception {
        LocalDateTime completedAt = LocalDateTime.of(2026, 9, 12, 18, 30);
        given(wodResultService.findOwnResults(18, EMAIL)).willReturn(List.of(
                new WodResultResponse(42, 18, 342, null, null, WodLevel.RX, completedAt)));

        mockMvc.perform(get("/api/wods/18/results")
                        .principal(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(42))
                .andExpect(jsonPath("$[0].wodId").value(18))
                .andExpect(jsonPath("$[0].userId").doesNotExist());
    }

    @Test
    void findOwnResults_WhenWodDoesNotExist_ReturnsNotFound() throws Exception {
        given(wodResultService.findOwnResults(999, EMAIL))
                .willThrow(new WodNotFoundException(999));

        mockMvc.perform(get("/api/wods/999/results")
                        .principal(authenticatedUser()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("WOD no encontrado con id: 999"));
    }

    private UsernamePasswordAuthenticationToken authenticatedUser() {
        return UsernamePasswordAuthenticationToken.authenticated(EMAIL, null, List.of());
    }
}
