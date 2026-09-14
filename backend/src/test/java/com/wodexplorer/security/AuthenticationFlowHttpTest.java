package com.wodexplorer.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wodexplorer.config.CorsConfig;
import com.wodexplorer.config.JwtConfiguration;
import com.wodexplorer.config.PasswordEncoderConfig;
import com.wodexplorer.config.SecurityConfig;
import com.wodexplorer.controller.AuthController;
import com.wodexplorer.controller.ExerciseController;
import com.wodexplorer.controller.UserController;
import com.wodexplorer.entity.User;
import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.service.AuthService;
import com.wodexplorer.service.ExerciseService;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.UserHistoryService;
import com.wodexplorer.service.UserService;

@WebMvcTest({ExerciseController.class, UserController.class, AuthController.class})
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import({
        AdminAuthorizationService.class,
        AuthService.class,
        CorsConfig.class,
        GlobalExceptionHandler.class,
        JwtAuthenticationFilter.class,
        JwtConfiguration.class,
        JwtService.class,
        PasswordEncoderConfig.class,
        RestAccessDeniedHandler.class,
        RestAuthenticationEntryPoint.class,
        SecurityConfig.class,
        UserService.class
})
@TestPropertySource(properties = {
        "jwt.secret=01234567890123456789012345678901",
        "jwt.expiration=3600000",
        "security.admin-emails="
})
class AuthenticationFlowHttpTest {

    private static final String EMAIL = "flow@example.com";
    private static final String PASSWORD = "ExamplePassword123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private ExerciseService exerciseService;

    @MockitoBean
    private UserHistoryService userHistoryService;

    @Test
    void registerLoginAndAccessProtectedEndpoint_UsesCompleteAuthenticationFlow() throws Exception {
        given(userRepository.existsByEmail(EMAIL)).willReturn(false);
        given(userRepository.saveAndFlush(any(User.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Delfin",
                                  "lastName": "Rojas",
                                  "email": "flow@example.com",
                                  "password": "ExamplePassword123"
                                }
                                """))
                .andExpect(status().isCreated());

        User registeredUser = captureRegisteredUser();
        assertThat(passwordEncoder.matches(PASSWORD, registeredUser.getPasswordHash())).isTrue();
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(registeredUser));
        given(exerciseService.findAll(null, 0, 20)).willAnswer(invocation -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            assertThat(authentication).isNotNull();
            assertThat(authentication.getPrincipal()).isEqualTo(EMAIL);
            assertThat(authentication.getAuthorities()).isEmpty();
            return new PageResponse<>(List.of(), 0, 20, 0, 0, false);
        });

        String loginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "FLOW@EXAMPLE.COM",
                                  "password": "ExamplePassword123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode tokenNode = objectMapper.readTree(loginResponse).get("token");
        String token = tokenNode.asText();
        assertThat(token).isNotBlank();
        assertThat(jwtService.extractSubject(token)).isEqualTo(EMAIL);

        mockMvc.perform(get("/api/exercises")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        then(exerciseService).should().findAll(null, 0, 20);
    }

    private User captureRegisteredUser() {
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        then(userRepository).should().saveAndFlush(captor.capture());
        return captor.getValue();
    }
}
