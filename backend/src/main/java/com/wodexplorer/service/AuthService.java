package com.wodexplorer.service;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.LoginRequest;
import com.wodexplorer.dto.LoginResponse;
import com.wodexplorer.entity.User;
import com.wodexplorer.exception.InvalidCredentialsException;
import com.wodexplorer.repository.UserRepository;

@Service
public class AuthService {

    private static final String DUMMY_PASSWORD_HASH =
            "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        String passwordHash = user == null ? DUMMY_PASSWORD_HASH : user.getPasswordHash();

        if (!passwordEncoder.matches(request.password(), passwordHash) || user == null) {
            throw new InvalidCredentialsException();
        }

        return new LoginResponse(jwtService.generateToken(normalizedEmail));
    }
}
