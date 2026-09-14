package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.util.ReflectionTestUtils;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.UserHistoryResponse;
import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodResult;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.repository.ExerciseResultRepository;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodResultRepository;

@ExtendWith(MockitoExtension.class)
class UserHistoryServiceTest {

    private static final String EMAIL = "athlete@example.com";
    private static final LocalDateTime NOW = LocalDateTime.of(2026, 9, 12, 18, 30);

    @Mock
    private UserRepository userRepository;

    @Mock
    private WodResultRepository wodResultRepository;

    @Mock
    private ExerciseResultRepository exerciseResultRepository;

    @Test
    void findOwnHistory_ResolvesUserAndMapsBothResultCollections() {
        User user = user(4);
        Wod wod = wod(20);
        Exercise exercise = exercise(125);
        WodResult wodResult = wodResult(42, user, wod);
        ExerciseResult exerciseResult = exerciseResult(7, user, exercise);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodResultRepository.findByUser_Id(4, PageRequest.of(0, 20,
                Sort.by(Sort.Order.desc("completedAt"), Sort.Order.desc("id")))))
                .willReturn(new PageImpl<>(List.of(wodResult)));
        given(exerciseResultRepository.findByUser_Id(4, PageRequest.of(0, 20,
                Sort.by(Sort.Order.desc("performedAt"), Sort.Order.desc("id")))))
                .willReturn(new PageImpl<>(List.of(exerciseResult)));
        UserHistoryService service = new UserHistoryService(
                userRepository, wodResultRepository, exerciseResultRepository);

        UserHistoryResponse response = service.findOwnHistory(" ATHLETE@EXAMPLE.COM ", 0, 20);

        assertThat(response.wodResults().items()).hasSize(1);
        assertThat(response.wodResults().items().getFirst().wodId()).isEqualTo(20);
        assertThat(response.exerciseResults().items()).hasSize(1);
        assertThat(response.exerciseResults().items().getFirst().exerciseId()).isEqualTo(125);
        then(wodResultRepository).should().findByUser_Id(4, PageRequest.of(0, 20,
                Sort.by(Sort.Order.desc("completedAt"), Sort.Order.desc("id"))));
        then(exerciseResultRepository).should().findByUser_Id(4, PageRequest.of(0, 20,
                Sort.by(Sort.Order.desc("performedAt"), Sort.Order.desc("id"))));
    }

    @Test
    void findOwnHistory_WhenUserDoesNotExist_DoesNotQueryResults() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.empty());
        UserHistoryService service = new UserHistoryService(
                userRepository, wodResultRepository, exerciseResultRepository);

        assertThatThrownBy(() -> service.findOwnHistory(EMAIL, 0, 20))
                .isInstanceOf(AuthenticatedUserNotFoundException.class);
        then(wodResultRepository).shouldHaveNoInteractions();
        then(exerciseResultRepository).shouldHaveNoInteractions();
    }

    private User user(int id) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setEmail(EMAIL);
        return user;
    }

    private Wod wod(int id) {
        Wod wod = new Wod();
        wod.setId(id);
        wod.setType(WodType.FOR_TIME);
        return wod;
    }

    private Exercise exercise(int id) {
        Exercise exercise = new Exercise();
        ReflectionTestUtils.setField(exercise, "id", id);
        exercise.setMeasurementType(MeasurementType.WEIGHT);
        return exercise;
    }

    private WodResult wodResult(int id, User user, Wod wod) {
        WodResult result = new WodResult();
        ReflectionTestUtils.setField(result, "id", id);
        result.setUser(user);
        result.setWod(wod);
        result.setTimeSeconds(342);
        result.setLevel(WodLevel.RX);
        result.setCompletedAt(NOW);
        return result;
    }

    private ExerciseResult exerciseResult(int id, User user, Exercise exercise) {
        ExerciseResult result = new ExerciseResult();
        ReflectionTestUtils.setField(result, "id", id);
        result.setUser(user);
        result.setExercise(exercise);
        result.setValue(new BigDecimal("100.00"));
        result.setUnit(ExerciseResultUnit.KG);
        result.setRecordType(ExerciseRecordType.ONE_RM);
        result.setPerformedAt(NOW);
        return result;
    }
}
