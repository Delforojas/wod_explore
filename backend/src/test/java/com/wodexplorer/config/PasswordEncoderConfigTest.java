package com.wodexplorer.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

class PasswordEncoderConfigTest {

    @Test
    void passwordEncoder_UsesBcryptWithStrengthTwelve() {
        PasswordEncoder passwordEncoder = new PasswordEncoderConfig().passwordEncoder();

        String password = "ExamplePassword123";
        String hash = passwordEncoder.encode(password);
        assertThat(hash).startsWith("$2a$12$");
        assertThat(hash).isNotEqualTo(password);
        assertThat(passwordEncoder.matches(password, hash)).isTrue();
    }
}
