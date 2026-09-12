package com.wodexplorer.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.WodDetailResponse;
import com.wodexplorer.dto.WodSummaryResponse;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.repository.WodRepository;

@Service
public class WodService {

    private final WodRepository wodRepository;

    public WodService(WodRepository wodRepository) {
        this.wodRepository = wodRepository;
    }

    @Transactional(readOnly = true)
    public List<WodSummaryResponse> findAll(String name, WodType type, WodLevel level) {
        String normalizedName = normalizeName(name);

        return wodRepository.findByFilters(normalizedName, type, level)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public WodDetailResponse findById(Integer id) {
        Wod wod = wodRepository.findById(id)
                .orElseThrow(() -> new WodNotFoundException(id));

        return toDetailResponse(wod);
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

    private WodDetailResponse toDetailResponse(Wod wod) {
        return new WodDetailResponse(
                wod.getId(),
                wod.getName(),
                wod.getType(),
                wod.getTimeLimit(),
                wod.getRounds(),
                wod.getLevel(),
                wod.getCreatedAt()
        );
    }
}
