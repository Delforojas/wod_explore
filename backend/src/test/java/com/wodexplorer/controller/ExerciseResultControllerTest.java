package com.wodexplorer.controller;

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
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.wodexplorer.dto.ExerciseResultRequest;
import com.wodexplorer.dto.ExerciseResultResponse;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.exception.ExerciseNotFoundException;
import com.wodexplorer.exception.InvalidExerciseResultException;
import com.wodexplorer.service.ExerciseResultService;
import com.wodexplorer.service.JwtService;

@WebMvcTest(ExerciseResultController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
class ExerciseResultControllerTest {

    private static final String EMAIL = "athlete@example.com";
    private static final LocalDateTime PERFORMED_AT = LocalDateTime.of(2026, 9, 12, 18, 30);

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExerciseResultService exerciseResultService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void create_ReturnsCreatedWithoutUserId() throws Exception {
        ExerciseResultRequest request = new ExerciseResultRequest(
                new BigDecimal("100.00"), ExerciseResultUnit.KG,
                ExerciseRecordType.ONE_RM, PERFORMED_AT);
        given(exerciseResultService.create(eq(18), eq(request), eq(EMAIL)))
                .willReturn(new ExerciseResultResponse(
                        42, 18, new BigDecimal("100.00"), ExerciseResultUnit.KG,
                        ExerciseRecordType.ONE_RM, PERFORMED_AT));

        mockMvc.perform(post("/api/exercises/18/results")
                        .principal(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "value": 100.00,
                                  "unit": "KG",
                                  "recordType": "1RM",
                                  "performedAt": "2026-09-12T18:30:00"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.exerciseId").value(18))
                .andExpect(jsonPath("$.value").value(100.00))
                .andExpect(jsonPath("$.recordType").value("1RM"))
                .andExpect(jsonPath("$.userId").doesNotExist());
    }

    @Test
    void create_WithUserIdInPayload_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/exercises/18/results")
                        .principal(authenticatedUser())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "value": 100.00,
                                  "unit": "KG",
                                  "recordType": "1RM",
                                  "userId": 999
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));

        then(exerciseResultService).shouldHaveNoInteractions();
    }

    @Test
    void findOwnResults_ReturnsResultsWithoutUserId() throws Exception {
        given(exerciseResultService.findOwnResults(18, EMAIL)).willReturn(List.of(
                new ExerciseResultResponse(
                        42, 18, new BigDecimal("100.00"), ExerciseResultUnit.KG,
                        ExerciseRecordType.ONE_RM, PERFORMED_AT)));

        mockMvc.perform(get("/api/exercises/18/results")
                        .principal(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(42))
                .andExpect(jsonPath("$[0].exerciseId").value(18))
                .andExpect(jsonPath("$[0].recordType").value("1RM"))
                .andExpect(jsonPath("$[0].userId").doesNotExist());
    }

    @Test
    void findBest_UsesRecordTypeQueryParameter() throws Exception {
        given(exerciseResultService.findBest(18, "1RM", EMAIL)).willReturn(
                new ExerciseResultResponse(
                        42, 18, new BigDecimal("120.00"), ExerciseResultUnit.KG,
                        ExerciseRecordType.ONE_RM, PERFORMED_AT));

        mockMvc.perform(get("/api/exercises/18/results/best")
                        .queryParam("recordType", "1RM")
                        .principal(authenticatedUser()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value(120.00))
                .andExpect(jsonPath("$.recordType").value("1RM"));
    }

    @Test
    void findBest_WithoutRecordType_ReturnsBadRequest() throws Exception {
        given(exerciseResultService.findBest(18, null, EMAIL))
                .willThrow(new InvalidExerciseResultException(
                        "recordType no tiene un valor válido"));

        mockMvc.perform(get("/api/exercises/18/results/best")
                        .principal(authenticatedUser()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));

        then(exerciseResultService).should().findBest(18, null, EMAIL);
    }

    @Test
    void findOwnResults_WhenExerciseDoesNotExist_ReturnsNotFound() throws Exception {
        given(exerciseResultService.findOwnResults(999, EMAIL))
                .willThrow(new ExerciseNotFoundException(999));

        mockMvc.perform(get("/api/exercises/999/results")
                        .principal(authenticatedUser()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message")
                        .value("Ejercicio no encontrado con id: 999"));
    }

    private UsernamePasswordAuthenticationToken authenticatedUser() {
        return UsernamePasswordAuthenticationToken.authenticated(EMAIL, null, List.of());
    }
}
