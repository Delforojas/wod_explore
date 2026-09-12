package com.wodexplorer.controller;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.wodexplorer.dto.ExerciseResponse;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.service.ExerciseService;
import com.wodexplorer.service.JwtService;

@WebMvcTest(ExerciseController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
class ExerciseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExerciseService exerciseService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void findAll_ReturnsExistingExerciseContract() throws Exception {
        given(exerciseService.findAll()).willReturn(List.of(new ExerciseResponse(
                125,
                "Burpee",
                ExerciseCategory.GYMNASTICS,
                MeasurementType.REPS)));

        mockMvc.perform(get("/api/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(125))
                .andExpect(jsonPath("$[0].name").value("Burpee"))
                .andExpect(jsonPath("$[0].category").value("GYMNASTICS"))
                .andExpect(jsonPath("$[0].measurementType").value("REPS"));
    }
}
