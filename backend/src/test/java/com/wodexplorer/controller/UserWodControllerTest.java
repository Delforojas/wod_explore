package com.wodexplorer.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.UserWodDetailResponse;
import com.wodexplorer.dto.UserWodExerciseResponse;
import com.wodexplorer.dto.UserWodPrescriptionResponse;
import com.wodexplorer.dto.UserWodSummaryResponse;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.WodCategory;
import com.wodexplorer.entity.WodExercisePrescriptionUnit;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.exception.UserWodNotFoundException;
import com.wodexplorer.security.AdminAuthorizationService;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.UserWodService;

@WebMvcTest(UserWodController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class UserWodControllerTest {

    private static final String EMAIL = "owner@example.com";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserWodService userWodService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private AdminAuthorizationService adminAuthorizationService;

    @Test
    void create_WithValidPayload_ReturnsCreatedDetailAndAuthenticationSubject() throws Exception {
        given(userWodService.create(any(), eq(EMAIL)))
                .willReturn(detailResponse());

        mockMvc.perform(post("/api/user-wods")
                        .principal(authentication())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(21))
                .andExpect(jsonPath("$.name").value("Fran"))
                .andExpect(jsonPath("$.category").value("METCON"))
                .andExpect(jsonPath("$.exercises[0].exerciseId").value(12))
                .andExpect(jsonPath("$.exercises[0].position").value(1))
                .andExpect(jsonPath("$.exercises[0].prescriptions[0].unit").value("REPS"));

        then(userWodService).should().create(any(), eq(EMAIL));
    }

    @Test
    void findAll_ReturnsPaginatedOwnWods() throws Exception {
        given(userWodService.findAll(EMAIL, 0, 20)).willReturn(new PageResponse<>(
                List.of(new UserWodSummaryResponse(
                        21, "Fran", WodType.FOR_TIME, WodCategory.METCON,
                        null, 3, WodLevel.RX, LocalDateTime.of(2026, 9, 14, 10, 0))),
                0, 20, 1, 1, false));

        mockMvc.perform(get("/api/user-wods")
                        .principal(authentication()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].id").value(21))
                .andExpect(jsonPath("$.items[0].category").value("METCON"))
                .andExpect(jsonPath("$.hasNext").value(false));
    }

    @Test
    void findById_WhenUnavailable_ReturnsGenericNotFound() throws Exception {
        given(userWodService.findById(999, EMAIL)).willThrow(new UserWodNotFoundException());

        mockMvc.perform(get("/api/user-wods/999")
                        .principal(authentication()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("USER_WOD_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("WOD personalizado no disponible"))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void create_WithUnknownOwnerField_ReturnsBadRequestWithoutCallingService() throws Exception {
        mockMvc.perform(post("/api/user-wods")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson().replace("\"category\": \"METCON\"", "\"ownerId\": 99,")))
                .andExpect(status().isBadRequest());

        then(userWodService).shouldHaveNoInteractions();
    }

    @Test
    void create_WithInvalidNestedValue_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/user-wods")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validJson().replace("\"value\": 10", "\"value\": 0")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));

        then(userWodService).shouldHaveNoInteractions();
    }

    private UsernamePasswordAuthenticationToken authentication() {
        return UsernamePasswordAuthenticationToken.authenticated(EMAIL, null, List.of());
    }

    private String validJson() {
        return """
                {
                  "name": "Fran",
                  "type": "FOR_TIME",
                  "category": "METCON",
                  "level": "RX",
                  "rounds": 3,
                  "exercises": [
                    {
                      "exerciseId": 12,
                      "position": 1,
                      "prescriptions": [
                        {"value": 10, "unit": "REPS"}
                      ]
                    }
                  ]
                }
                """;
    }

    private UserWodDetailResponse detailResponse() {
        return new UserWodDetailResponse(
                21,
                "Fran",
                WodType.FOR_TIME,
                WodCategory.METCON,
                null,
                3,
                WodLevel.RX,
                LocalDateTime.of(2026, 9, 14, 10, 0),
                List.of(new UserWodExerciseResponse(
                        12,
                        "Burpee",
                        ExerciseCategory.GYMNASTICS,
                        MeasurementType.REPS,
                        1,
                        List.of(new UserWodPrescriptionResponse(
                                BigDecimal.TEN,
                                WodExercisePrescriptionUnit.REPS,
                                null)))));
    }
}
