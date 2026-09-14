package com.wodexplorer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wodexplorer.dto.WodResultRequest;
import com.wodexplorer.dto.WodResultResponse;
import com.wodexplorer.service.WodResultService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/wods/{wodId}/results")
public class WodResultController {

    private final WodResultService wodResultService;

    public WodResultController(WodResultService wodResultService) {
        this.wodResultService = wodResultService;
    }

    @PostMapping
    public ResponseEntity<WodResultResponse> create(
            @PathVariable Integer wodId,
            @Valid @RequestBody WodResultRequest request,
            Authentication authentication) {
        WodResultResponse response = wodResultService.create(
                wodId,
                request,
                authenticatedEmail(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<WodResultResponse> findOwnResults(
            @PathVariable Integer wodId,
            Authentication authentication) {
        return wodResultService.findOwnResults(wodId, authenticatedEmail(authentication));
    }

    private String authenticatedEmail(Authentication authentication) {
        return authentication == null ? null : authentication.getName();
    }
}
