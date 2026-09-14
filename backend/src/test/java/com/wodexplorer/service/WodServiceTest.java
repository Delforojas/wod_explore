package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.WodDetailResponse;
import com.wodexplorer.dto.WodSummaryResponse;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodExercise;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.repository.WodRepository;
import com.wodexplorer.repository.WodExerciseRepository;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class WodServiceTest {

    @Mock
    private WodRepository wodRepository;

    @Mock
    private WodExerciseRepository wodExerciseRepository;

    @InjectMocks
    private WodService wodService;

    @Test
    void findAll_WithoutFilters_ReturnsCatalog() {
        Wod wod = wod(1, "Abbate", WodType.FOR_TIME, null, null, WodLevel.RX);
        given(wodRepository.findByFilters(eq(null), eq(null), eq(null), any(Pageable.class)))
                .willReturn(pageOf(wod));

        PageResponse<WodSummaryResponse> result = wodService.findAll(null, null, null, 0, 20);

        assertThat(result.items()).containsExactly(new WodSummaryResponse(
                1, "Abbate", WodType.FOR_TIME, null, null, WodLevel.RX));
    }

    @Test
    void findAll_WithNameFilter_TrimsNameAndUsesPartialSearch() {
        given(wodRepository.findByFilters(eq("Fran"), eq(null), eq(null), any(Pageable.class)))
                .willReturn(Page.empty());

        wodService.findAll("  Fran  ", null, null, 0, 20);

        then(wodRepository).should().findByFilters(eq("Fran"), eq(null), eq(null), any(Pageable.class));
    }

    @Test
    void findAll_WithTypeFilter_DelegatesType() {
        given(wodRepository.findByFilters(eq(null), eq(WodType.AMRAP), eq(null), any(Pageable.class)))
                .willReturn(Page.empty());

        wodService.findAll(null, WodType.AMRAP, null, 0, 20);

        then(wodRepository).should().findByFilters(
                eq(null), eq(WodType.AMRAP), eq(null), any(Pageable.class));
    }

    @Test
    void findAll_WithLevelFilter_DelegatesLevel() {
        given(wodRepository.findByFilters(eq(null), eq(null), eq(WodLevel.BEGINNER), any(Pageable.class)))
                .willReturn(Page.empty());

        wodService.findAll(null, null, WodLevel.BEGINNER, 0, 20);

        then(wodRepository).should().findByFilters(
                eq(null), eq(null), eq(WodLevel.BEGINNER), any(Pageable.class));
    }

    @Test
    void findAll_WithCombinedFilters_DelegatesAllFilters() {
        given(wodRepository.findByFilters(
                eq("Fran"), eq(WodType.FOR_TIME), eq(WodLevel.RX), any(Pageable.class)))
                .willReturn(Page.empty());

        wodService.findAll("Fran", WodType.FOR_TIME, WodLevel.RX, 0, 20);

        then(wodRepository).should().findByFilters(
                eq("Fran"), eq(WodType.FOR_TIME), eq(WodLevel.RX), any(Pageable.class));
    }

    @Test
    void findAll_WithBlankName_TreatsNameAsAbsent() {
        given(wodRepository.findByFilters(eq(null), eq(null), eq(null), any(Pageable.class)))
                .willReturn(Page.empty());

        wodService.findAll("   ", null, null, 0, 20);

        then(wodRepository).should().findByFilters(eq(null), eq(null), eq(null), any(Pageable.class));
    }

    @Test
    void findById_WhenWodExists_ReturnsDetail() {
        Wod wod = wod(18, "Danny", WodType.AMRAP, 1200, null, WodLevel.RX);
        given(wodRepository.findGlobalById(18)).willReturn(Optional.of(wod));
        given(wodExerciseRepository.findByWodIdWithExerciseOrderByPositionAsc(18))
                .willReturn(List.of());

        WodDetailResponse result = wodService.findById(18);

        assertThat(result.id()).isEqualTo(18);
        assertThat(result.name()).isEqualTo("Danny");
        assertThat(result.type()).isEqualTo(WodType.AMRAP);
        assertThat(result.timeLimit()).isEqualTo(1200);
        assertThat(result.rounds()).isNull();
        assertThat(result.level()).isEqualTo(WodLevel.RX);
        assertThat(result.exercises()).isEmpty();
    }

    @Test
    void findById_WithExercises_ReturnsCompleteOrderedAssociationsWithoutDeduplication() {
        Wod wod = wod(20, "Filthy Fifty", WodType.FOR_TIME, null, null, WodLevel.RX);
        Exercise burpee = exercise(125, "Burpee", ExerciseCategory.GYMNASTICS, MeasurementType.REPS);
        WodExercise first = wodExercise(burpee, 25, 1);
        WodExercise second = wodExercise(burpee, 25, 9);
        given(wodRepository.findGlobalById(20)).willReturn(Optional.of(wod));
        given(wodExerciseRepository.findByWodIdWithExerciseOrderByPositionAsc(20))
                .willReturn(List.of(first, second));

        WodDetailResponse result = wodService.findById(20);

        assertThat(result.exercises()).hasSize(2);
        assertThat(result.exercises().get(0).id()).isEqualTo(125);
        assertThat(result.exercises().get(0).name()).isEqualTo("Burpee");
        assertThat(result.exercises().get(0).category()).isEqualTo(ExerciseCategory.GYMNASTICS);
        assertThat(result.exercises().get(0).measurementType()).isEqualTo(MeasurementType.REPS);
        assertThat(result.exercises().get(0).reps()).isEqualTo(25);
        assertThat(result.exercises().get(0).position()).isEqualTo(1);
        assertThat(result.exercises().get(1).position()).isEqualTo(9);
    }

    @Test
    void findById_WithNullReps_PreservesNull() {
        Wod wod = wod(13, "Carse", WodType.FOR_TIME, null, null, WodLevel.RX);
        Exercise run = exercise(113, "Run", ExerciseCategory.CARDIO, MeasurementType.DISTANCE);
        given(wodRepository.findGlobalById(13)).willReturn(Optional.of(wod));
        given(wodExerciseRepository.findByWodIdWithExerciseOrderByPositionAsc(13))
                .willReturn(List.of(wodExercise(run, null, 1)));

        WodDetailResponse result = wodService.findById(13);

        assertThat(result.exercises().get(0).reps()).isNull();
    }

    @Test
    void findById_WhenWodDoesNotExist_ThrowsNotFound() {
        given(wodRepository.findGlobalById(999)).willReturn(Optional.empty());

        assertThatThrownBy(() -> wodService.findById(999))
                .isInstanceOf(WodNotFoundException.class)
                .hasMessage("WOD no encontrado con id: 999");
        then(wodExerciseRepository).shouldHaveNoInteractions();
    }

    private Exercise exercise(
            int id,
            String name,
            ExerciseCategory category,
            MeasurementType measurementType) {
        Exercise exercise = new Exercise();
        ReflectionTestUtils.setField(exercise, "id", id);
        exercise.setName(name);
        exercise.setCategory(category);
        exercise.setMeasurementType(measurementType);
        return exercise;
    }

    private WodExercise wodExercise(Exercise exercise, Integer reps, int position) {
        WodExercise wodExercise = new WodExercise();
        wodExercise.setExercise(exercise);
        wodExercise.setReps(reps);
        wodExercise.setPosition(position);
        return wodExercise;
    }

    private Wod wod(
            int id,
            String name,
            WodType type,
            Integer timeLimit,
            Integer rounds,
            WodLevel level) {
        Wod wod = new Wod();
        wod.setId(id);
        wod.setName(name);
        wod.setType(type);
        wod.setTimeLimit(timeLimit);
        wod.setRounds(rounds);
        wod.setLevel(level);
        return wod;
    }

    private Page<Wod> pageOf(Wod... wods) {
        return new PageImpl<>(List.of(wods));
    }
}
