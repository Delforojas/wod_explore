package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.wodexplorer.dto.LoginRequest;
import com.wodexplorer.dto.LoginResponse;
import com.wodexplorer.entity.User;
import com.wodexplorer.exception.InvalidCredentialsException;
import com.wodexplorer.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_ValidCredentials_NormalizesEmailAndReturnsToken() {
        LoginRequest request = new LoginRequest("  DELFIN@EXAMPLE.COM ", "ExamplePassword123");
        User user = userWithEmail("delfin@example.com");
        given(userRepository.findByEmail("delfin@example.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("ExamplePassword123", "bcrypt-hash")).willReturn(true);
        given(jwtService.generateToken("delfin@example.com")).willReturn("jwt-token");

        LoginResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("jwt-token");
        then(userRepository).should().findByEmail("delfin@example.com");
        then(passwordEncoder).should().matches("ExamplePassword123", "bcrypt-hash");
        then(jwtService).should().generateToken("delfin@example.com");
    }

    @Test
    void login_UnknownEmail_UsesDummyHashAndDoesNotGenerateToken() {
        LoginRequest request = new LoginRequest("unknown@example.com", "ExamplePassword123");
        given(userRepository.findByEmail("unknown@example.com")).willReturn(Optional.empty());
        given(passwordEncoder.matches(any(String.class), any(String.class))).willReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Credenciales inválidas");

        then(jwtService).should(never()).generateToken(any(String.class));
    }

    @Test
    void login_WrongPassword_DoesNotGenerateToken() {
        LoginRequest request = new LoginRequest("delfin@example.com", "WrongPassword");
        User user = userWithEmail("delfin@example.com");
        given(userRepository.findByEmail("delfin@example.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("WrongPassword", "bcrypt-hash")).willReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Credenciales inválidas");

        then(jwtService).should(never()).generateToken(any(String.class));
    }

    private User userWithEmail(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash("bcrypt-hash");
        return user;
    }
}
