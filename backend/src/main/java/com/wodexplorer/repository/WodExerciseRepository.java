package com.wodexplorer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import com.wodexplorer.entity.WodExercise;

public interface WodExerciseRepository extends Repository<WodExercise, Integer> {

    @Query("""
            select distinct we from WodExercise we
            join fetch we.exercise
            left join fetch we.prescriptions
            where we.wod.id = :wodId
            order by we.position asc
            """)
    List<WodExercise> findByWodIdWithExerciseOrderByPositionAsc(@Param("wodId") Integer wodId);
}
