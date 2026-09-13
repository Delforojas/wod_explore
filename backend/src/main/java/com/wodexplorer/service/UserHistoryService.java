package com.wodexplorer.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.ExerciseResultResponse;
import com.wodexplorer.dto.UserHistoryResponse;
import com.wodexplorer.dto.WodResultResponse;
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
    public UserHistoryResponse findOwnHistory(String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);

        List<WodResultResponse> wodResults = wodResultRepository
                .findByUser_IdOrderByCompletedAtDescIdDesc(user.getId())
                .stream()
                .map(this::toWodResponse)
                .toList();
        List<ExerciseResultResponse> exerciseResults = exerciseResultRepository
                .findByUser_IdOrderByPerformedAtDescIdDesc(user.getId())
                .stream()
                .map(this::toExerciseResponse)
                .toList();

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

    private WodResultResponse toWodResponse(WodResult result) {
        return new WodResultResponse(
                result.getId(),
                result.getWod().getId(),
                result.getTimeSeconds(),
                result.getRounds(),
                result.getReps(),
                result.getLevel(),
                result.getCompletedAt());
    }

    private ExerciseResultResponse toExerciseResponse(ExerciseResult result) {
        return new ExerciseResultResponse(
                result.getId(),
                result.getExercise().getId(),
                result.getValue(),
                result.getUnit(),
                result.getRecordType(),
                result.getPerformedAt());
    }
}
