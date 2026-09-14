package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Optional;

import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.wodexplorer.dto.UserRegistrationRequest;
import com.wodexplorer.dto.UserResponse;
import com.wodexplorer.entity.User;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.EmailAlreadyExistsException;
import com.wodexplorer.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void register_NormalizesEmailHashesPasswordAndReturnsSafeResponse() {
        UserRegistrationRequest request = new UserRegistrationRequest(
                "Delfin", "Rojas", "  DELFIN@EXAMPLE.COM ", "ExamplePassword123");
        given(passwordEncoder.encode(request.password())).willReturn("bcrypt-hash");
        given(userRepository.saveAndFlush(any(User.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        then(userRepository).should().existsByEmail("delfin@example.com");
        then(userRepository).should().saveAndFlush(userCaptor.capture());
        then(passwordEncoder).should().encode("ExamplePassword123");

        User persistedUser = userCaptor.getValue();
        assertThat(persistedUser.getEmail()).isEqualTo("delfin@example.com");
        assertThat(persistedUser.getPasswordHash()).isEqualTo("bcrypt-hash");
        assertThat(response.email()).isEqualTo("delfin@example.com");
        assertThat(response.name()).isEqualTo("Delfin");
        assertThat(response.lastName()).isEqualTo("Rojas");
    }

    @Test
    void register_WhenEmailExists_DoesNotEncodeOrPersist() {
        UserRegistrationRequest request = new UserRegistrationRequest(
                "Delfin", "Rojas", "  DELFIN@EXAMPLE.COM ", "ExamplePassword123");
        given(userRepository.existsByEmail("delfin@example.com")).willReturn(true);

        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class);

        then(passwordEncoder).should(never()).encode(any());
        then(userRepository).should(never()).saveAndFlush(any(User.class));
    }

    @Test
    void register_WhenUniqueConstraintRaces_ReturnsEmailAlreadyExists() {
        UserRegistrationRequest request = new UserRegistrationRequest(
                "Delfin", "Rojas", "delfin@example.com", "ExamplePassword123");
        ConstraintViolationException constraintViolation = new ConstraintViolationException(
                "duplicate email", new SQLException("Duplicate entry for key email"), "email");
        given(userRepository.saveAndFlush(any(User.class)))
                .willThrow(new DataIntegrityViolationException("duplicate", constraintViolation));

        assertThatThrownBy(() -> userService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class);
    }

    @Test
    void findCurrentUser_NormalizesEmailAndReturnsSafeResponse() {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", 4);
        ReflectionTestUtils.setField(user, "createdAt", LocalDateTime.of(2026, 9, 12, 16, 0));
        user.setName("Delfin");
        user.setLastName("Rojas");
        user.setEmail("athlete@example.com");
        user.setPasswordHash("secret-hash");
        given(userRepository.findByEmail("athlete@example.com")).willReturn(Optional.of(user));

        UserResponse response = userService.findCurrentUser(" ATHLETE@EXAMPLE.COM ");

        assertThat(response).isEqualTo(new UserResponse(
                4,
                "Delfin",
                "Rojas",
                "athlete@example.com",
                LocalDateTime.of(2026, 9, 12, 16, 0)));
        then(userRepository).should().findByEmail("athlete@example.com");
    }

    @Test
    void findCurrentUser_WhenUserDoesNotExist_RejectsAuthentication() {
        given(userRepository.findByEmail("athlete@example.com")).willReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findCurrentUser("athlete@example.com"))
                .isInstanceOf(AuthenticatedUserNotFoundException.class);
    }
}
