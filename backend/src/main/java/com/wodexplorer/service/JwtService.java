package com.wodexplorer.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Locale;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import com.wodexplorer.config.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;

@Service
public class JwtService {

    private static final String HMAC_SHA_256 = "HmacSHA256";

    private final SecretKey signingKey;
    private final long expirationMillis;

    public JwtService(JwtProperties properties) {
        this.signingKey = new SecretKeySpec(
                properties.secret().getBytes(StandardCharsets.UTF_8), HMAC_SHA_256);
        this.expirationMillis = properties.expiration();
    }

    public String generateToken(String email) {
        String normalizedEmail = normalizeEmail(email);
        Instant issuedAt = Instant.now();
        Instant expiration = issuedAt.plusMillis(expirationMillis);

        return Jwts.builder()
                .subject(normalizedEmail)
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(expiration))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public String extractSubject(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token).getPayload();
            return claims.getSubject() != null && !claims.getSubject().isBlank();
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
