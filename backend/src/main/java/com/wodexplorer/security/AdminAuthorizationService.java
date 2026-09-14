package com.wodexplorer.security;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class AdminAuthorizationService {

    private static final GrantedAuthority ADMIN_AUTHORITY =
            new SimpleGrantedAuthority("ROLE_ADMIN");

    private final Set<String> adminEmails;

    public AdminAuthorizationService(@Value("${security.admin-emails:}") String configuredEmails) {
        this.adminEmails = Arrays.stream(configuredEmails.split(","))
                .map(this::normalizeEmail)
                .filter(email -> !email.isBlank())
                .collect(Collectors.toUnmodifiableSet());
    }

    public Collection<? extends GrantedAuthority> authoritiesFor(String email) {
        return isAdmin(email) ? List.of(ADMIN_AUTHORITY) : List.of();
    }

    private boolean isAdmin(String email) {
        return adminEmails.contains(normalizeEmail(email));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}
