package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.wodexplorer.config.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

class JwtServiceTest {

    private static final String TEST_SECRET = "01234567890123456789012345678901";
    private static final String TEST_EMAIL = "delfin@example.com";

    private JwtService jwtService;
    private SecretKey signingKey;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(new JwtProperties(TEST_SECRET, 3_600_000));
        signingKey = new SecretKeySpec(
                TEST_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Test
    void generateToken_ReturnsSignedJwtWithRequiredClaimsOnly() {
        String token = jwtService.generateToken(" DELFIN@EXAMPLE.COM ");
        Claims claims = parseClaims(token);

        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3);
        assertThat(claims.getSubject()).isEqualTo(TEST_EMAIL);
        assertThat(claims.getIssuedAt()).isNotNull();
        assertThat(claims.getExpiration()).isAfter(claims.getIssuedAt());
        assertThat(claims.get("password")).isNull();
        assertThat(claims.get("passwordHash")).isNull();
        assertThat(claims.get("password_hash")).isNull();
    }

    @Test
    void extractSubject_ReturnsEmailFromSubject() {
        String token = jwtService.generateToken(TEST_EMAIL);

        assertThat(jwtService.extractSubject(token)).isEqualTo(TEST_EMAIL);
    }

    @Test
    void isTokenValid_ForSignedUnexpiredToken_ReturnsTrue() {
        String token = jwtService.generateToken(TEST_EMAIL);

        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    void isTokenValid_ForExpiredToken_ReturnsFalse() {
        Instant now = Instant.now();
        String token = Jwts.builder()
                .subject(TEST_EMAIL)
                .issuedAt(Date.from(now.minusSeconds(10)))
                .expiration(Date.from(now.minusSeconds(1)))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();

        assertThat(jwtService.isTokenValid(token)).isFalse();
    }

    @Test
    void isTokenValid_ForManipulatedToken_ReturnsFalse() {
        String token = jwtService.generateToken(TEST_EMAIL);
        char lastCharacter = token.charAt(token.length() - 1);
        char replacement = lastCharacter == 'a' ? 'b' : 'a';
        String manipulatedToken = token.substring(0, token.length() - 1) + replacement;

        assertThat(jwtService.isTokenValid(manipulatedToken)).isFalse();
    }

    @Test
    void isTokenValid_ForMalformedToken_ReturnsFalse() {
        assertThat(jwtService.isTokenValid("not-a-jwt")).isFalse();
        assertThat(jwtService.isTokenValid(null)).isFalse();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
