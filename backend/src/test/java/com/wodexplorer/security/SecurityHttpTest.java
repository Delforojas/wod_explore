package com.wodexplorer.security;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import com.wodexplorer.controller.AuthController;
import com.wodexplorer.controller.ExerciseController;
import com.wodexplorer.controller.UserController;
import com.wodexplorer.dto.LoginResponse;
import com.wodexplorer.dto.UserResponse;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.service.AuthService;
import com.wodexplorer.service.ExerciseService;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.UserService;

import io.jsonwebtoken.Jwts;

@WebMvcTest({ExerciseController.class, UserController.class, AuthController.class})
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import({
        CorsConfig.class,
        GlobalExceptionHandler.class,
        JwtAuthenticationFilter.class,
        JwtConfiguration.class,
        JwtService.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class
})
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000"
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
    private UserService userService;

    @MockitoBean
    private AuthService authService;

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
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
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
}
