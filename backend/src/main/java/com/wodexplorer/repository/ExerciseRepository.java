package com.wodexplorer.repository;

import com.wodexplorer.entity.Exercise;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {

    @Query("""
            select e from Exercise e
            where (:name is null or lower(e.name) like lower(concat('%', :name, '%')))
            """)
    Page<Exercise> findByNameFilter(@Param("name") String name, Pageable pageable);
}
