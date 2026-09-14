package com.wodexplorer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wodexplorer.dto.UserRegistrationRequest;
import com.wodexplorer.dto.PaginationParameters;
import com.wodexplorer.dto.UserHistoryResponse;
import com.wodexplorer.dto.UserResponse;
import com.wodexplorer.service.UserService;
import com.wodexplorer.service.UserHistoryService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.ModelAttribute;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserHistoryService userHistoryService;

    public UserController(UserService userService, UserHistoryService userHistoryService) {
        this.userService = userService;
        this.userHistoryService = userHistoryService;
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

    private String authenticatedEmail(Authentication authentication) {
        return authentication == null ? null : authentication.getName();
    }
}
