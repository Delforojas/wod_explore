package com.wodexplorer.config;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class JwtPropertiesTest {

    @Test
    void constructor_WhenSecretIsMissing_FailsFast() {
        assertThatThrownBy(() -> new JwtProperties(null, 3_600_000))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void constructor_WhenSecretIsTooShort_FailsFast() {
        assertThatThrownBy(() -> new JwtProperties("short-secret", 3_600_000))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void constructor_WhenExpirationIsNotPositive_FailsFast() {
        assertThatThrownBy(() -> new JwtProperties(
                "01234567890123456789012345678901", 0))
                .isInstanceOf(IllegalStateException.class);
    }
}
