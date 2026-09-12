package com.wodexplorer.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.nullValue;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.wodexplorer.dto.WodDetailResponse;
import com.wodexplorer.dto.WodSummaryResponse;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.GlobalExceptionHandler;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.service.JwtService;
import com.wodexplorer.service.WodService;

@WebMvcTest(WodController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import(GlobalExceptionHandler.class)
class WodControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private WodService wodService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void findAll_WithoutFilters_ReturnsCatalogDto() throws Exception {
        given(wodService.findAll(null, null, null)).willReturn(List.of(
                new WodSummaryResponse(1, "Abbate", WodType.FOR_TIME, null, null, WodLevel.RX)));

        mockMvc.perform(get("/api/wods"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Abbate"))
                .andExpect(jsonPath("$[0].type").value("FOR_TIME"))
                .andExpect(jsonPath("$[0].level").value("RX"))
                .andExpect(jsonPath("$[0].timeLimit").value(nullValue()))
                .andExpect(jsonPath("$[0].rounds").value(nullValue()));
    }

    @Test
    void findAll_WithCombinedFilters_DelegatesTypedParameters() throws Exception {
        given(wodService.findAll("  Fran  ", WodType.FOR_TIME, WodLevel.RX))
                .willReturn(List.of());

        mockMvc.perform(get("/api/wods")
                        .param("name", "  Fran  ")
                        .param("type", "FOR_TIME")
                        .param("level", "RX"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        then(wodService).should().findAll(eq("  Fran  "), eq(WodType.FOR_TIME), eq(WodLevel.RX));
    }

    @Test
    void findById_WhenWodExists_ReturnsDetailDto() throws Exception {
        given(wodService.findById(18)).willReturn(new WodDetailResponse(
                18,
                "Danny",
                WodType.AMRAP,
                1200,
                null,
                WodLevel.RX,
                LocalDateTime.of(2026, 9, 7, 22, 7, 31)));

        mockMvc.perform(get("/api/wods/18"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(18))
                .andExpect(jsonPath("$.name").value("Danny"))
                .andExpect(jsonPath("$.type").value("AMRAP"))
                .andExpect(jsonPath("$.timeLimit").value(1200))
                .andExpect(jsonPath("$.rounds").value(nullValue()))
                .andExpect(jsonPath("$.level").value("RX"))
                .andExpect(jsonPath("$.createdAt").value("2026-09-07T22:07:31"));
    }

    @Test
    void findById_WhenWodDoesNotExist_ReturnsNotFound() throws Exception {
        given(wodService.findById(999)).willThrow(new WodNotFoundException(999));

        mockMvc.perform(get("/api/wods/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("WOD no encontrado con id: 999"));
    }

    @Test
    void findAll_WithInvalidType_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/wods").param("type", "UNKNOWN"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.type").exists());
    }

    @Test
    void findAll_WithInvalidLevel_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/wods").param("level", "UNKNOWN"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.level").exists());
    }

    @Test
    void findById_WithInvalidId_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/wods/not-a-number"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.details.id").exists());
    }
}
