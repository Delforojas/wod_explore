package com.wodexplorer.security;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.wodexplorer.config.CorsConfig;
import com.wodexplorer.config.JwtConfiguration;
import com.wodexplorer.config.SecurityConfig;
import com.wodexplorer.dto.ExerciseResponse;
import com.wodexplorer.controller.AuthController;
import com.wodexplorer.controller.ExerciseController;
import com.wodexplorer.controller.ExerciseResultController;
import com.wodexplorer.controller.UserController;
import com.wodexplorer.controller.UserStatisticsController;
import com.wodexplorer.controller.WodController;
import com.wodexplorer.controller.WodResultController;
import com.wodexplorer.dto.LoginResponse;
import com.wodexplorer.dto.UserHistoryResponse;
import com.wodexplorer.dto.UserResponse;
import com.wodexplorer.dto.UserStatisticsResponse;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.service.AuthService;
import com.wodexplorer.service.ExerciseService;
import com.wodexplorer.service.ExerciseResultService;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.UserService;
import com.wodexplorer.service.UserHistoryService;
import com.wodexplorer.service.UserStatisticsService;
import com.wodexplorer.service.WodService;
import com.wodexplorer.service.WodResultService;

import io.jsonwebtoken.Jwts;

@WebMvcTest({ExerciseController.class, UserController.class, AuthController.class,
        UserStatisticsController.class, WodController.class, WodResultController.class,
        ExerciseResultController.class})
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import({
        CorsConfig.class,
        GlobalExceptionHandler.class,
        AdminAuthorizationService.class,
        JwtAuthenticationFilter.class,
        JwtConfiguration.class,
        JwtService.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000",
        "cors.allowed-origin=http://localhost:4173",
        "security.admin-emails=admin@example.com"
})
class SecurityHttpTest {

    private static final String TEST_EMAIL = "delfin@example.com";
    private static final String TEST_SECRET = "01234567890123456789012345678901";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private ExerciseService exerciseService;

    @MockitoBean
    private ExerciseResultService exerciseResultService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserHistoryService userHistoryService;

    @MockitoBean
    private UserStatisticsService userStatisticsService;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private WodService wodService;

    @MockitoBean
    private WodResultService wodResultService;

    @BeforeEach
    void setUp() {
        given(exerciseService.findAll()).willReturn(List.of());
        given(authService.login(any())).willReturn(new LoginResponse("test-token"));
        given(userService.register(any())).willReturn(new UserResponse(
                1, "Delfin", "Rojas", TEST_EMAIL, null));
    }

    @Test
    void register_WithoutJwt_RemainsPublic() throws Exception {
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
                .andExpect(status().isCreated());
    }

    @Test
    void login_WithoutJwt_RemainsPublic() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "delfin@example.com",
                                  "password": "ExamplePassword123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-token"));
    }

    @Test
    void exercises_WithoutJwt_ReturnsJsonUnauthorized() throws Exception {
        mockMvc.perform(get("/api/exercises"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Autenticación requerida"))
                .andExpect(header().string("Content-Type", org.hamcrest.Matchers.containsString(
                        MediaType.APPLICATION_JSON_VALUE)));

        then(exerciseService).shouldHaveNoInteractions();
    }

    @Test
    void exercises_WithValidJwt_AllowsAccessAndUsesJwtSubject() throws Exception {
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(get("/api/exercises")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        then(exerciseService).should().findAll();
    }

    @Test
    void exerciseMutations_WithoutJwt_ReturnJsonUnauthorized() throws Exception {
        mockMvc.perform(post("/api/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validExerciseJson()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Autenticación requerida"));

        then(exerciseService).shouldHaveNoInteractions();
    }

    @Test
    void exerciseMutations_WithNormalJwt_ReturnForbiddenWithoutCallingService() throws Exception {
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(post("/api/exercises")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validExerciseJson()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("FORBIDDEN"))
                .andExpect(jsonPath("$.message").value("Acceso denegado"));

        mockMvc.perform(put("/api/exercises/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validExerciseJson()))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/exercises/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());

        then(exerciseService).shouldHaveNoInteractions();
    }

    @Test
    void exerciseMutations_WithRoleInBody_DoNotElevateNormalUser() throws Exception {
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(post("/api/exercises")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Burpee",
                                  "category": "GYMNASTICS",
                                  "measurementType": "REPS",
                                  "role": "ADMIN"
                                }
                                """))
                .andExpect(status().isForbidden());

        then(exerciseService).shouldHaveNoInteractions();
    }

    @Test
    void exerciseMutations_WithAdminJwt_AllowsCreateUpdateAndDelete() throws Exception {
        given(exerciseService.create(any())).willReturn(exerciseResponse());
        given(exerciseService.update(any(Integer.class), any())).willReturn(exerciseResponse());
        String token = jwtService.generateToken(" ADMIN@EXAMPLE.COM ");

        mockMvc.perform(post("/api/exercises")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validExerciseJson()))
                .andExpect(status().isCreated());

        mockMvc.perform(put("/api/exercises/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validExerciseJson()))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/exercises/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        then(exerciseService).should().create(any());
        then(exerciseService).should().update(eq(1), any());
        then(exerciseService).should().delete(1);
    }

    @ParameterizedTest
    @ValueSource(strings = {"/api/wods", "/api/wods/1"})
    void wods_WithoutJwt_ReturnsJsonUnauthorized(String path) throws Exception {
        mockMvc.perform(get(path))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));

        then(wodService).shouldHaveNoInteractions();
    }

    @Test
    void wods_WithValidJwt_AllowsCatalogAccess() throws Exception {
        given(wodService.findAll(null, null, null)).willReturn(List.of());
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(get("/api/wods")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        then(wodService).should().findAll(null, null, null);
    }

    @Test
    void wodResults_WithoutJwt_ReturnsJsonUnauthorized() throws Exception {
        mockMvc.perform(get("/api/wods/18/results"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Autenticación requerida"));

        then(wodResultService).shouldHaveNoInteractions();
    }

    @Test
    void wodResults_WithValidJwt_UsesJwtSubject() throws Exception {
        given(wodResultService.findOwnResults(18, TEST_EMAIL)).willReturn(List.of());
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(get("/api/wods/18/results")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        then(wodResultService).should().findOwnResults(18, TEST_EMAIL);
    }

    @Test
    void exerciseResults_WithoutJwt_ReturnsJsonUnauthorized() throws Exception {
        mockMvc.perform(get("/api/exercises/18/results"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Autenticación requerida"));

        then(exerciseResultService).shouldHaveNoInteractions();
    }

    @Test
    void exerciseResults_WithValidJwt_UsesJwtSubject() throws Exception {
        given(exerciseResultService.findOwnResults(18, TEST_EMAIL)).willReturn(List.of());
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(get("/api/exercises/18/results")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        then(exerciseResultService).should().findOwnResults(18, TEST_EMAIL);
    }

    @Test
    void currentUser_WithoutJwt_ReturnsJsonUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"))
                .andExpect(jsonPath("$.message").value("Autenticación requerida"));

        then(userService).shouldHaveNoInteractions();
    }

    @Test
    void currentUser_WithValidJwt_UsesJwtSubject() throws Exception {
        given(userService.findCurrentUser(TEST_EMAIL)).willReturn(new UserResponse(
                1, "Delfin", "Rojas", TEST_EMAIL, null));
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(TEST_EMAIL));

        then(userService).should().findCurrentUser(TEST_EMAIL);
    }

    @Test
    void currentUserHistory_WithoutJwt_ReturnsJsonUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me/history"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));

        then(userHistoryService).shouldHaveNoInteractions();
    }

    @Test
    void currentUserHistory_WithValidJwt_UsesJwtSubject() throws Exception {
        given(userHistoryService.findOwnHistory(TEST_EMAIL)).willReturn(
                new UserHistoryResponse(List.of(), List.of()));
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(get("/api/users/me/history")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wodResults").isEmpty())
                .andExpect(jsonPath("$.exerciseResults").isEmpty());

        then(userHistoryService).should().findOwnHistory(TEST_EMAIL);
    }

    @Test
    void userStatistics_WithoutJwt_ReturnsJsonUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me/statistics"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));

        then(userStatisticsService).shouldHaveNoInteractions();
    }

    @Test
    void userStatistics_WithValidJwt_UsesJwtSubject() throws Exception {
        given(userStatisticsService.findStatistics(TEST_EMAIL))
                .willReturn(new UserStatisticsResponse(0, 0, List.of(), List.of()));
        String token = jwtService.generateToken(TEST_EMAIL);

        mockMvc.perform(get("/api/users/me/statistics")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wodResultsCount").value(0));

        then(userStatisticsService).should().findStatistics(TEST_EMAIL);
    }

    @Test
    void userEvolution_WithoutJwt_ReturnsJsonUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me/evolution"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));

        then(userStatisticsService).shouldHaveNoInteractions();
    }

    @Test
    void exercises_WithExpiredJwt_ReturnsUnauthorized() throws Exception {
        String token = createExpiredToken();

        mockMvc.perform(get("/api/exercises")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    void exercises_WithManipulatedJwt_ReturnsUnauthorized() throws Exception {
        String token = jwtService.generateToken(TEST_EMAIL);
        String[] tokenParts = token.split("\\.");
        char firstSignatureCharacter = tokenParts[2].charAt(0);
        char replacement = firstSignatureCharacter == 'a' ? 'b' : 'a';
        String manipulatedToken = tokenParts[0] + "." + tokenParts[1] + "."
                + replacement + tokenParts[2].substring(1);

        mockMvc.perform(get("/api/exercises")
                        .header("Authorization", "Bearer " + manipulatedToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    void exercises_WithMalformedJwt_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/exercises")
                        .header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    void exercises_WithNonBearerAuthorization_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/exercises")
                        .header("Authorization", "Basic credentials"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    void api_PreflightFromConfiguredOrigin_IsAllowedWithoutAuthentication() throws Exception {
        mockMvc.perform(options("/api/exercises")
                        .header("Origin", "http://localhost:4173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4173"))
                .andExpect(header().string("Access-Control-Allow-Headers", "Authorization"));
    }

    private String createExpiredToken() {
        SecretKey signingKey = new SecretKeySpec(
                TEST_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(TEST_EMAIL)
                .issuedAt(Date.from(now.minusSeconds(10)))
                .expiration(Date.from(now.minusSeconds(1)))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    private String validExerciseJson() {
        return """
                {
                  "name": "Burpee",
                  "category": "GYMNASTICS",
                  "measurementType": "REPS"
                }
                """;
    }

    private ExerciseResponse exerciseResponse() {
        return new ExerciseResponse(1, "Burpee", ExerciseCategory.GYMNASTICS, MeasurementType.REPS);
    }
}
