package com.wodexplorer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.validation.Valid;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.PaginationParameters;
import com.wodexplorer.dto.WodDetailResponse;
import com.wodexplorer.dto.WodSummaryResponse;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.service.WodService;

@RestController
@RequestMapping("/api/wods")
public class WodController {

    private final WodService wodService;

    public WodController(WodService wodService) {
        this.wodService = wodService;
    }

    @GetMapping
    public PageResponse<WodSummaryResponse> findAll(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "type", required = false) WodType type,
            @RequestParam(name = "level", required = false) WodLevel level,
            @Valid @ModelAttribute PaginationParameters pagination) {
        return wodService.findAll(
                name, type, level, pagination.getPage(), pagination.getSize());
    }

    @GetMapping("/{id}")
    public WodDetailResponse findById(@PathVariable Integer id) {
        return wodService.findById(id);
    }
}
