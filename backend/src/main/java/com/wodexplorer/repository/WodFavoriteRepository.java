package com.wodexplorer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wodexplorer.entity.WodFavorite;
import com.wodexplorer.entity.WodFavoriteId;

public interface WodFavoriteRepository extends JpaRepository<WodFavorite, WodFavoriteId> {

    List<WodFavorite> findByUser_IdOrderByCreatedAtDescWod_IdDesc(Integer userId);

    boolean existsByUser_IdAndWod_Id(Integer userId, Integer wodId);

    long deleteByUser_IdAndWod_Id(Integer userId, Integer wodId);
}
