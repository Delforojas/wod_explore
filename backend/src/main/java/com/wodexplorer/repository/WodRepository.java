package com.wodexplorer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;

import java.util.Optional;

public interface WodRepository extends JpaRepository<Wod, Integer> {

    Page<Wod> findByOwner_Id(Integer ownerId, Pageable pageable);

    java.util.Optional<Wod> findByIdAndOwner_Id(Integer id, Integer ownerId);

    @Query("select w from Wod w where w.id = :id and w.owner is null")
    Optional<Wod> findGlobalById(@Param("id") Integer id);

    @Query("""
            select w from Wod w
            where w.id = :id
              and (w.owner is null or w.owner.id = :userId)
            """)
    Optional<Wod> findAccessibleById(@Param("id") Integer id, @Param("userId") Integer userId);

    @Query("""
            select w from Wod w
            where w.owner is null
              and (:name is null or lower(w.name) like lower(concat('%', :name, '%')))
              and (:type is null or w.type = :type)
              and (:level is null or w.level = :level)
            """)
    Page<Wod> findByFilters(
            @Param("name") String name,
            @Param("type") WodType type,
            @Param("level") WodLevel level,
            Pageable pageable);
}
