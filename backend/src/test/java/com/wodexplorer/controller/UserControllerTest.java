package com.wodexplorer.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import com.wodexplorer.dto.FavoriteWodResponse;
import com.wodexplorer.dto.HistoryExerciseResultResponse;
import com.wodexplorer.dto.HistoryWodResultResponse;
import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.UserHistoryResponse;
import com.wodexplorer.dto.UserResponse;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.exception.EmailAlreadyExistsException;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.security.AdminAuthorizationService;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.UserHistoryService;
import com.wodexplorer.service.UserService;
import com.wodexplorer.service.WodFavoriteService;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserHistoryService userHistoryService;

    @MockitoBean
    private WodFavoriteService wodFavoriteService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AdminAuthorizationService adminAuthorizationService;

    @Test
    void register_ValidRequest_ReturnsCreatedWithoutSensitiveFields() throws Exception {
        given(userService.register(any())).willReturn(new UserResponse(
                1,
                "Delfin",
                "Rojas",
                "delfin@example.com",
                LocalDateTime.of(2026, 9, 12, 16, 0)));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Delfin",
                                  "lastName": "Rojas",
                                  "email": "delfin@example.com",
                                  "password": "ExamplePassword123"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("delfin@example.com"))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.password_hash").doesNotExist());
    }

    @Test
    void register_InvalidRequest_ReturnsBadRequestWithDetails() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "lastName": "",
                                  "email": "invalid-email",
                                  "password": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").value("Datos inválidos"))
                .andExpect(jsonPath("$.details.name").exists())
                .andExpect(jsonPath("$.details.lastName").exists())
                .andExpect(jsonPath("$.details.email").exists())
                .andExpect(jsonPath("$.details.password").exists());
    }

    @Test
    void register_MissingRequiredFields_ReturnsBadRequestWithDetails() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").value("Datos inválidos"))
                .andExpect(jsonPath("$.details.name").exists())
                .andExpect(jsonPath("$.details.lastName").exists())
                .andExpect(jsonPath("$.details.email").exists())
                .andExpect(jsonPath("$.details.password").exists());
    }

    @Test
    void register_EmailLongerThan150Characters_ReturnsBadRequest() throws Exception {
        String email = "a".repeat(145) + "@x.com";

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Delfin",
                                  "lastName": "Rojas",
                                  "email": "%s",
                                  "password": "ExamplePassword123"
                                }
                                """.formatted(email)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.email").exists());
    }

    @Test
    void register_DuplicateEmail_ReturnsConflict() throws Exception {
        given(userService.register(any())).willThrow(new EmailAlreadyExistsException());

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Delfin",
                                  "lastName": "Rojas",
                                  "email": "delfin@example.com",
                                  "password": "ExamplePassword123"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("EMAIL_ALREADY_EXISTS"))
                .andExpect(jsonPath("$.message").value("El email ya está registrado"))
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    void currentUser_ReturnsAuthenticatedProfileWithoutSensitiveFields() throws Exception {
        given(userService.findCurrentUser("athlete@example.com")).willReturn(new UserResponse(
                4,
                "Delfin",
                "Rojas",
                "athlete@example.com",
                LocalDateTime.of(2026, 9, 12, 16, 0)));

        mockMvc.perform(get("/api/users/me")
                        .principal(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4))
                .andExpect(jsonPath("$.email").value("athlete@example.com"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.password_hash").doesNotExist())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void currentUserHistory_ReturnsSeparateResultCollections() throws Exception {
        given(userHistoryService.findOwnHistory("athlete@example.com", 0, 20))
                .willReturn(emptyHistory());

        mockMvc.perform(get("/api/users/me/history")
                        .principal(authenticatedUser())
                        .queryParam("userId", "999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wodResults.items").isEmpty())
                .andExpect(jsonPath("$.exerciseResults.items").isEmpty())
                .andExpect(jsonPath("$.userId").doesNotExist());

        then(userHistoryService).should().findOwnHistory("athlete@example.com", 0, 20);
    }

    @Test
    void currentUserHistory_IncludesRelatedResourceNames() throws Exception {
        given(userHistoryService.findOwnHistory("athlete@example.com", 0, 20))
                .willReturn(historyWithNames());

        mockMvc.perform(get("/api/users/me/history")
                        .principal(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wodResults.items[0].wodId").value(20))
                .andExpect(jsonPath("$.wodResults.items[0].wodName").value("Fran"))
                .andExpect(jsonPath("$.exerciseResults.items[0].exerciseId").value(125))
                .andExpect(jsonPath("$.exerciseResults.items[0].exerciseName").value("Back Squat"));
    }

    @Test
    void currentUserHistory_WithNegativePage_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/users/me/history")
                        .principal(authenticatedUser())
                        .param("page", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.page").exists());
    }

    @Test
    void currentUserFavorites_ReturnsPublicFavoritesWithoutUserId() throws Exception {
        given(wodFavoriteService.findOwnFavorites("athlete@example.com"))
                .willReturn(List.of(new FavoriteWodResponse(
                        18, LocalDateTime.of(2026, 9, 13, 10, 30))));

        mockMvc.perform(get("/api/users/me/favorites")
                        .principal(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].wodId").value(18))
                .andExpect(jsonPath("$[0].favoritedAt").exists())
                .andExpect(jsonPath("$[0].userId").doesNotExist());
    }

    @Test
    void addFavorite_ReturnsNoContentWithoutAcceptingUserIdentity() throws Exception {
        mockMvc.perform(put("/api/users/me/favorites/18")
                        .principal(authenticatedUser())
                        .queryParam("userId", "999"))
                .andExpect(status().isNoContent());

        then(wodFavoriteService).should()
                .addFavorite(18, "athlete@example.com");
    }

    @Test
    void removeFavorite_ReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/users/me/favorites/18")
                        .principal(authenticatedUser()))
                .andExpect(status().isNoContent());

        then(wodFavoriteService).should()
                .removeFavorite(18, "athlete@example.com");
    }

    private UserHistoryResponse emptyHistory() {
        return new UserHistoryResponse(
                new PageResponse<>(List.of(), 0, 20, 0, 0, false),
                new PageResponse<>(List.of(), 0, 20, 0, 0, false));
    }

    private UserHistoryResponse historyWithNames() {
        return new UserHistoryResponse(
                new PageResponse<>(List.of(new HistoryWodResultResponse(
                        42, 20, "Fran", 342, null, null, WodLevel.RX,
                        LocalDateTime.of(2026, 9, 12, 18, 30))), 0, 20, 1, 1, false),
                new PageResponse<>(List.of(new HistoryExerciseResultResponse(
                        7, 125, "Back Squat", new BigDecimal("100.00"), ExerciseResultUnit.KG,
                        ExerciseRecordType.ONE_RM, LocalDateTime.of(2026, 9, 12, 17, 30))),
                        0, 20, 1, 1, false));
    }

    private UsernamePasswordAuthenticationToken authenticatedUser() {
        return UsernamePasswordAuthenticationToken.authenticated(
                "athlete@example.com", null, List.of());
    }
}
