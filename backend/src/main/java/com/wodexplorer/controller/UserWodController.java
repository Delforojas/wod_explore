package com.wodexplorer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.PaginationParameters;
import com.wodexplorer.dto.UserWodCreateRequest;
import com.wodexplorer.dto.UserWodDetailResponse;
import com.wodexplorer.dto.UserWodSummaryResponse;
import com.wodexplorer.service.UserWodService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user-wods")
public class UserWodController {

    private final UserWodService userWodService;

    public UserWodController(UserWodService userWodService) {
        this.userWodService = userWodService;
    }

    @PostMapping
    public ResponseEntity<UserWodDetailResponse> create(
            @Valid @RequestBody UserWodCreateRequest request,
            Authentication authentication) {
        UserWodDetailResponse response = userWodService.create(
                request,
                authenticatedEmail(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public PageResponse<UserWodSummaryResponse> findAll(
            @Valid @ModelAttribute PaginationParameters pagination,
            Authentication authentication) {
        return userWodService.findAll(
                authenticatedEmail(authentication),
                pagination.getPage(),
                pagination.getSize());
    }

    @GetMapping("/{id}")
    public UserWodDetailResponse findById(
            @PathVariable Integer id,
            Authentication authentication) {
        return userWodService.findById(id, authenticatedEmail(authentication));
    }

    private String authenticatedEmail(Authentication authentication) {
        return authentication == null ? null : authentication.getName();
    }
}
