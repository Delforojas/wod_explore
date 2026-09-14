package com.wodexplorer.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.WodDetailResponse;
import com.wodexplorer.dto.WodExerciseResponse;
import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.WodSummaryResponse;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodExercise;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.repository.WodRepository;
import com.wodexplorer.repository.WodExerciseRepository;

@Service
public class WodService {

    private final WodRepository wodRepository;
    private final WodExerciseRepository wodExerciseRepository;

    public WodService(
            WodRepository wodRepository,
            WodExerciseRepository wodExerciseRepository) {
        this.wodRepository = wodRepository;
        this.wodExerciseRepository = wodExerciseRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<WodSummaryResponse> findAll(
            String name, WodType type, WodLevel level, int page, int size) {
        String normalizedName = normalizeName(name);

        return PageResponse.from(wodRepository.findByFilters(
                normalizedName,
                type,
                level,
                PageRequest.of(page, size, Sort.by(Sort.Order.asc("id"))))
                .map(this::toSummaryResponse));
    }

    @Transactional(readOnly = true)
    public WodDetailResponse findById(Integer id) {
        Wod wod = wodRepository.findGlobalById(id)
                .orElseThrow(() -> new WodNotFoundException(id));

        List<WodExerciseResponse> exercises = wodExerciseRepository
                .findByWodIdWithExerciseOrderByPositionAsc(id)
                .stream()
                .map(this::toExerciseResponse)
                .toList();

        return toDetailResponse(wod, exercises);
    }

    private String normalizeName(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        return name.trim();
    }

    private WodSummaryResponse toSummaryResponse(Wod wod) {
        return new WodSummaryResponse(
                wod.getId(),
                wod.getName(),
                wod.getType(),
                wod.getTimeLimit(),
                wod.getRounds(),
                wod.getLevel()
        );
    }

    private WodDetailResponse toDetailResponse(
            Wod wod,
            List<WodExerciseResponse> exercises) {
        return new WodDetailResponse(
                wod.getId(),
                wod.getName(),
                wod.getType(),
                wod.getTimeLimit(),
                wod.getRounds(),
                wod.getLevel(),
                wod.getCreatedAt(),
                exercises
        );
    }

    private WodExerciseResponse toExerciseResponse(WodExercise wodExercise) {
        return new WodExerciseResponse(
                wodExercise.getExercise().getId(),
                wodExercise.getExercise().getName(),
                wodExercise.getExercise().getCategory(),
                wodExercise.getExercise().getMeasurementType(),
                wodExercise.getReps(),
                wodExercise.getPosition()
        );
    }
}
