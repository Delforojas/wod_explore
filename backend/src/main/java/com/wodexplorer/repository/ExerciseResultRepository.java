package com.wodexplorer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;

public interface ExerciseResultRepository extends JpaRepository<ExerciseResult, Integer> {

    List<ExerciseResult> findByUser_IdAndExercise_IdOrderByPerformedAtDescIdDesc(
            Integer userId,
            Integer exerciseId);

    List<ExerciseResult> findByUser_IdOrderByPerformedAtDescIdDesc(Integer userId);

    @EntityGraph(attributePaths = "exercise")
    Page<ExerciseResult> findByUser_Id(Integer userId, Pageable pageable);

    @EntityGraph(attributePaths = "exercise")
    List<ExerciseResult> findByUser_IdOrderByPerformedAtAscIdAsc(Integer userId);

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
