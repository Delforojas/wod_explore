package com.wodexplorer.service;

import java.util.Locale;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.PageResponse;
import com.wodexplorer.dto.HistoryExerciseResultResponse;
import com.wodexplorer.dto.HistoryWodResultResponse;
import com.wodexplorer.dto.UserHistoryResponse;
import com.wodexplorer.entity.ExerciseResult;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.WodResult;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.repository.ExerciseResultRepository;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodResultRepository;

@Service
public class UserHistoryService {

    private final UserRepository userRepository;
    private final WodResultRepository wodResultRepository;
    private final ExerciseResultRepository exerciseResultRepository;

    public UserHistoryService(
            UserRepository userRepository,
            WodResultRepository wodResultRepository,
            ExerciseResultRepository exerciseResultRepository) {
        this.userRepository = userRepository;
        this.wodResultRepository = wodResultRepository;
        this.exerciseResultRepository = exerciseResultRepository;
    }

    @Transactional(readOnly = true)
    public UserHistoryResponse findOwnHistory(String authenticatedEmail, int page, int size) {
        User user = findAuthenticatedUser(authenticatedEmail);

        PageResponse<HistoryWodResultResponse> wodResults = PageResponse.from(wodResultRepository.findByUser_Id(
                user.getId(),
                PageRequest.of(page, size, Sort.by(
                        Sort.Order.desc("completedAt"), Sort.Order.desc("id"))))
                .map(this::toWodResponse));
        PageResponse<HistoryExerciseResultResponse> exerciseResults = PageResponse.from(
                exerciseResultRepository.findByUser_Id(
                        user.getId(),
                        PageRequest.of(page, size, Sort.by(
                                Sort.Order.desc("performedAt"), Sort.Order.desc("id"))))
                .map(this::toExerciseResponse));

        return new UserHistoryResponse(wodResults, exerciseResults);
    }

    private User findAuthenticatedUser(String authenticatedEmail) {
        String normalizedEmail = authenticatedEmail == null
                ? ""
                : authenticatedEmail.trim().toLowerCase(Locale.ROOT);

        if (normalizedEmail.isBlank()) {
            throw new AuthenticatedUserNotFoundException();
        }

        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(AuthenticatedUserNotFoundException::new);
    }

    private HistoryWodResultResponse toWodResponse(WodResult result) {
        return new HistoryWodResultResponse(
                result.getId(),
                result.getWod().getId(),
                result.getWod().getName(),
                result.getTimeSeconds(),
                result.getRounds(),
                result.getReps(),
                result.getLevel(),
                result.getCompletedAt());
    }

    private HistoryExerciseResultResponse toExerciseResponse(ExerciseResult result) {
        return new HistoryExerciseResultResponse(
                result.getId(),
                result.getExercise().getId(),
                result.getExercise().getName(),
                result.getValue(),
                result.getUnit(),
                result.getRecordType(),
                result.getPerformedAt());
    }
}
