package com.wodexplorer.service;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.repository.ExerciseRepository;

import org.springframework.stereotype.Service;
import java.util.List;

import com.wodexplorer.exception.ExerciseNotFoundException;

import com.wodexplorer.dto.ExerciseRequest;
import com.wodexplorer.dto.ExerciseResponse;

@Service

public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public List<ExerciseResponse> findAll() {

    return exerciseRepository.findAll()

            .stream()

            .map(this::toResponse)

            .toList();

}

    public ExerciseResponse findById(Integer id) {

    Exercise exercise = exerciseRepository.findById(id)

            .orElseThrow(() -> new ExerciseNotFoundException(id));

    return toResponse(exercise);

}
    public ExerciseResponse create(ExerciseRequest request) {

    Exercise exercise = new Exercise();

    exercise.setName(request.name());

    exercise.setCategory(request.category());

    exercise.setMeasurementType(request.measurementType());

    Exercise savedExercise = exerciseRepository.save(exercise);

    return toResponse(savedExercise);

}
public ExerciseResponse update(Integer id, ExerciseRequest request) {

    Exercise exercise = exerciseRepository.findById(id)

            .orElseThrow(() -> new ExerciseNotFoundException(id));

    exercise.setName(request.name());

    exercise.setCategory(request.category());

    exercise.setMeasurementType(request.measurementType());

    Exercise updatedExercise = exerciseRepository.save(exercise);

    return toResponse(updatedExercise);

}
public void delete(Integer id) {

    Exercise exercise = exerciseRepository.findById(id)

            .orElseThrow(() ->  new ExerciseNotFoundException(id));

    exerciseRepository.delete(exercise);

}
private ExerciseResponse toResponse(Exercise exercise) {

    return new ExerciseResponse(

            exercise.getId(),

            exercise.getName(),

            exercise.getCategory(),

            exercise.getMeasurementType()

    );

}
}