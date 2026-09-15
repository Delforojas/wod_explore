package com.wodexplorer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wodexplorer.dto.UserRegistrationRequest;
import com.wodexplorer.dto.PaginationParameters;
import com.wodexplorer.dto.UserHistoryResponse;
import com.wodexplorer.dto.UserResponse;
import com.wodexplorer.dto.FavoriteWodResponse;
import com.wodexplorer.service.UserService;
import com.wodexplorer.service.UserHistoryService;
import com.wodexplorer.service.WodFavoriteService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.ModelAttribute;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserHistoryService userHistoryService;
    private final WodFavoriteService wodFavoriteService;

    public UserController(
            UserService userService,
            UserHistoryService userHistoryService,
            WodFavoriteService wodFavoriteService) {
        this.userService = userService;
        this.userHistoryService = userHistoryService;
        this.wodFavoriteService = wodFavoriteService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody UserRegistrationRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.register(request));
    }

    @GetMapping("/me")
    public UserResponse currentUser(Authentication authentication) {
        return userService.findCurrentUser(authenticatedEmail(authentication));
    }

    @GetMapping("/me/history")
    public UserHistoryResponse currentUserHistory(
            Authentication authentication,
            @Valid @ModelAttribute PaginationParameters pagination) {
        return userHistoryService.findOwnHistory(
                authenticatedEmail(authentication), pagination.getPage(), pagination.getSize());
    }

    @GetMapping("/me/favorites")
    public List<FavoriteWodResponse> currentUserFavorites(Authentication authentication) {
        return wodFavoriteService.findOwnFavorites(authenticatedEmail(authentication));
    }

    @PutMapping("/me/favorites/{wodId}")
    public ResponseEntity<Void> addFavorite(
            Authentication authentication,
            @PathVariable Integer wodId) {
        wodFavoriteService.addFavorite(wodId, authenticatedEmail(authentication));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me/favorites/{wodId}")
    public ResponseEntity<Void> removeFavorite(
            Authentication authentication,
            @PathVariable Integer wodId) {
        wodFavoriteService.removeFavorite(wodId, authenticatedEmail(authentication));
        return ResponseEntity.noContent().build();
    }

    private String authenticatedEmail(Authentication authentication) {
        return authentication == null ? null : authentication.getName();
    }
}
