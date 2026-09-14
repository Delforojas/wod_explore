package com.wodexplorer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;

public interface WodRepository extends JpaRepository<Wod, Integer> {

    @Query("""
            select w from Wod w
            where (:name is null or lower(w.name) like lower(concat('%', :name, '%')))
              and (:type is null or w.type = :type)
              and (:level is null or w.level = :level)
            """)
    Page<Wod> findByFilters(
            @Param("name") String name,
            @Param("type") WodType type,
            @Param("level") WodLevel level,
            Pageable pageable);
}
