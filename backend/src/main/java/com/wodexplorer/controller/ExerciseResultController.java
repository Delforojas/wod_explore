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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wodexplorer.dto.ExerciseResultRequest;
import com.wodexplorer.dto.ExerciseResultResponse;
import com.wodexplorer.service.ExerciseResultService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/exercises/{exerciseId}/results")
public class ExerciseResultController {

    private final ExerciseResultService exerciseResultService;

    public ExerciseResultController(ExerciseResultService exerciseResultService) {
        this.exerciseResultService = exerciseResultService;
    }

    @PostMapping
    public ResponseEntity<ExerciseResultResponse> create(
            @PathVariable Integer exerciseId,
            @Valid @RequestBody ExerciseResultRequest request,
            Authentication authentication) {
        ExerciseResultResponse response = exerciseResultService.create(
                exerciseId,
                request,
                authenticatedEmail(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<ExerciseResultResponse> findOwnResults(
            @PathVariable Integer exerciseId,
            Authentication authentication) {
        return exerciseResultService.findOwnResults(
                exerciseId,
                authenticatedEmail(authentication));
    }

    @GetMapping("/best")
    public ExerciseResultResponse findBest(
            @PathVariable Integer exerciseId,
            @RequestParam(required = false) String recordType,
            Authentication authentication) {
        return exerciseResultService.findBest(
                exerciseId,
                recordType,
                authenticatedEmail(authentication));
    }

    private String authenticatedEmail(Authentication authentication) {
        return authentication == null ? null : authentication.getName();
    }
}
