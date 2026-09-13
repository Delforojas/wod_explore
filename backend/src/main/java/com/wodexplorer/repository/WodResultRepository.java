package com.wodexplorer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wodexplorer.entity.WodResult;

public interface WodResultRepository extends JpaRepository<WodResult, Integer> {

    List<WodResult> findByUser_IdAndWod_IdOrderByCompletedAtDescIdDesc(
            Integer userId,
            Integer wodId);

    List<WodResult> findByUser_IdOrderByCompletedAtDescIdDesc(Integer userId);
}
