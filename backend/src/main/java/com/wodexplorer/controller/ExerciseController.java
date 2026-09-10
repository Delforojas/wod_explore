package com.wodexplorer.controller;

import com.wodexplorer.entity.Exercise;

import com.wodexplorer.service.ExerciseService;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.PutMapping;

import com.wodexplorer.dto.ExerciseRequest;
import com.wodexplorer.dto.ExerciseResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.validation.Valid;

import java.util.List;

@RestController

@RequestMapping("/api/exercises")

public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {

        this.exerciseService = exerciseService;

    }

    @GetMapping

public List<ExerciseResponse> findAll() {

    return exerciseService.findAll();

}
    @GetMapping("/{id}")

public ExerciseResponse findById(@PathVariable Integer id) {

    return exerciseService.findById(id);

}
  @PostMapping

public ResponseEntity<ExerciseResponse> create(

        @Valid @RequestBody ExerciseRequest request) {

    ExerciseResponse response = exerciseService.create(request);

    return ResponseEntity

            .status(HttpStatus.CREATED)

            .body(response);

}
@PutMapping("/{id}")


public ExerciseResponse update(

        @PathVariable Integer id,

        @Valid @RequestBody ExerciseRequest request) {

    return exerciseService.update(id, request);

}
@DeleteMapping("/{id}")

public ResponseEntity<Void> delete(@PathVariable Integer id) {

    exerciseService.delete(id);

    return ResponseEntity.noContent().build();

}
}