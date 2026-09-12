package com.wodexplorer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;

public interface ExerciseResultRepository extends JpaRepository<ExerciseResult, Integer> {

    List<ExerciseResult> findByUser_IdAndExercise_IdOrderByPerformedAtDescIdDesc(
            Integer userId,
            Integer exerciseId);

    Optional<ExerciseResult>
            findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueDescPerformedAtDescIdDesc(
                    Integer userId,
                    Integer exerciseId,
                    ExerciseRecordType recordType);

    Optional<ExerciseResult>
            findFirstByUser_IdAndExercise_IdAndRecordTypeOrderByValueAscPerformedAtDescIdDesc(
                    Integer userId,
                    Integer exerciseId,
                    ExerciseRecordType recordType);
}
