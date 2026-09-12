package com.wodexplorer.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public List<WodSummaryResponse> findAll(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "type", required = false) WodType type,
            @RequestParam(name = "level", required = false) WodLevel level) {
        return wodService.findAll(name, type, level);
    }

    @GetMapping("/{id}")
    public WodDetailResponse findById(@PathVariable Integer id) {
        return wodService.findById(id);
    }
}
