package com.wodexplorer.controller;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.BDDMockito.then;
import static org.mockito.ArgumentMatchers.eq;

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
import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.security.AdminAuthorizationService;
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

    @MockitoBean
    private AdminAuthorizationService adminAuthorizationService;

    @Test
    void findAll_ReturnsExistingExerciseContract() throws Exception {
        given(exerciseService.findAll(null, 0, 20)).willReturn(new PageResponse<>(List.of(new ExerciseResponse(
                125,
                "Burpee",
                ExerciseCategory.GYMNASTICS,
                MeasurementType.REPS)), 0, 20, 1, 1, false));

        mockMvc.perform(get("/api/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].id").value(125))
                .andExpect(jsonPath("$.items[0].name").value("Burpee"))
                .andExpect(jsonPath("$.items[0].category").value("GYMNASTICS"))
                .andExpect(jsonPath("$.items[0].measurementType").value("REPS"));
    }

    @Test
    void findAll_WithNameAndPage_DelegatesPaginationAndSearch() throws Exception {
        given(exerciseService.findAll("snatch", 1, 2)).willReturn(
                new PageResponse<>(List.of(), 1, 2, 2, 1, false));

        mockMvc.perform(get("/api/exercises")
                        .param("name", "snatch")
                        .param("page", "1")
                        .param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isEmpty())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.size").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));

        then(exerciseService).should().findAll(eq("snatch"), eq(1), eq(2));
    }

    @Test
    void findAll_WithPageSizeAboveMaximum_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/exercises").param("size", "101"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.size").exists());
    }
}
