package com.wodexplorer.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.ExerciseEvolutionPoint;
import com.wodexplorer.dto.ExercisePersonalRecordResponse;
import com.wodexplorer.dto.UserEvolutionResponse;
import com.wodexplorer.dto.UserStatisticsResponse;
import com.wodexplorer.dto.WodEvolutionPoint;
import com.wodexplorer.dto.WodPersonalRecordResponse;
import com.wodexplorer.entity.ExerciseRecordType;
import com.wodexplorer.entity.ExerciseResult;
import com.wodexplorer.entity.ExerciseResultUnit;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.WodResult;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.repository.ExerciseResultRepository;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodResultRepository;

@Service
public class UserStatisticsService {

    private final UserRepository userRepository;
    private final WodResultRepository wodResultRepository;
    private final ExerciseResultRepository exerciseResultRepository;

    public UserStatisticsService(
            UserRepository userRepository,
            WodResultRepository wodResultRepository,
            ExerciseResultRepository exerciseResultRepository) {
        this.userRepository = userRepository;
        this.wodResultRepository = wodResultRepository;
        this.exerciseResultRepository = exerciseResultRepository;
    }

    @Transactional(readOnly = true)
    public UserStatisticsResponse findStatistics(String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        List<WodResult> wodResults = findWodResults(user);
        List<ExerciseResult> exerciseResults = findExerciseResults(user);

        return new UserStatisticsResponse(
                wodResults.size(),
                exerciseResults.size(),
                calculateWodRecords(wodResults),
                calculateExerciseRecords(exerciseResults));
    }

    @Transactional(readOnly = true)
    public UserEvolutionResponse findEvolution(String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        List<WodEvolutionPoint> wodResults = findWodResults(user).stream()
                .map(this::toWodEvolutionPoint)
                .toList();
        List<ExerciseEvolutionPoint> exerciseResults = findExerciseResults(user).stream()
                .map(this::toExerciseEvolutionPoint)
                .toList();

        return new UserEvolutionResponse(wodResults, exerciseResults);
    }

    private List<WodResult> findWodResults(User user) {
        return wodResultRepository.findByUser_IdOrderByCompletedAtAscIdAsc(user.getId());
    }

    private List<ExerciseResult> findExerciseResults(User user) {
        return exerciseResultRepository.findByUser_IdOrderByPerformedAtAscIdAsc(user.getId());
    }

    private List<WodPersonalRecordResponse> calculateWodRecords(List<WodResult> results) {
        Map<WodRecordKey, WodResult> bestByWodAndLevel = new HashMap<>();
        for (WodResult result : results) {
            WodRecordKey key = new WodRecordKey(result.getWod().getId(), result.getLevel());
            bestByWodAndLevel.merge(key, result, this::selectBetterWodResult);
        }

        return bestByWodAndLevel.values().stream()
                .map(this::toWodPersonalRecord)
                .sorted(Comparator
                        .comparing(WodPersonalRecordResponse::wodId)
                        .thenComparing(record -> record.level().ordinal()))
                .toList();
    }

    private List<ExercisePersonalRecordResponse> calculateExerciseRecords(
            List<ExerciseResult> results) {
        Map<ExerciseRecordKey, ExerciseResult> bestByExerciseAndType = new HashMap<>();
        for (ExerciseResult result : results) {
            ExerciseRecordKey key = new ExerciseRecordKey(
                    result.getExercise().getId(), result.getRecordType());
            bestByExerciseAndType.merge(key, result, this::selectBetterExerciseResult);
        }

        return bestByExerciseAndType.values().stream()
                .map(this::toExercisePersonalRecord)
                .sorted(Comparator
                        .comparing(ExercisePersonalRecordResponse::exerciseId)
                        .thenComparing(record -> record.recordType().value()))
                .toList();
    }

    private WodResult selectBetterWodResult(WodResult current, WodResult candidate) {
        int metricComparison = switch (current.getWod().getType()) {
            case FOR_TIME -> compareMinimum(candidate.getTimeSeconds(), current.getTimeSeconds());
            case AMRAP -> compareAmrap(candidate, current);
            case EMOM -> compareMaximum(candidate.getReps(), current.getReps());
        };

        if (metricComparison == 0) {
            return isMoreRecent(candidate.getCompletedAt(), candidate.getId(),
                    current.getCompletedAt(), current.getId()) ? candidate : current;
        }

        return current.getWod().getType() == WodType.FOR_TIME
                ? metricComparison < 0 ? candidate : current
                : metricComparison > 0 ? candidate : current;
    }

    private int compareAmrap(WodResult candidate, WodResult current) {
        int roundsComparison = compareMaximum(candidate.getRounds(), current.getRounds());
        return roundsComparison == 0
                ? compareMaximum(candidate.getReps(), current.getReps())
                : roundsComparison;
    }

    private ExerciseResult selectBetterExerciseResult(
            ExerciseResult current,
            ExerciseResult candidate) {
        int valueComparison = candidate.getUnit() == ExerciseResultUnit.SECONDS
                ? compareMinimum(candidate.getValue(), current.getValue())
                : compareMaximum(candidate.getValue(), current.getValue());

        if (valueComparison == 0 && isMoreRecent(
                candidate.getPerformedAt(), candidate.getId(),
                current.getPerformedAt(), current.getId())) {
            return candidate;
        }
        boolean candidateIsBetter = candidate.getUnit() == ExerciseResultUnit.SECONDS
                ? valueComparison < 0
                : valueComparison > 0;
        return candidateIsBetter ? candidate : current;
    }

    private WodPersonalRecordResponse toWodPersonalRecord(WodResult result) {
        return new WodPersonalRecordResponse(
                result.getId(),
                result.getWod().getId(),
                result.getWod().getName(),
                result.getWod().getType(),
                result.getLevel(),
                result.getTimeSeconds(),
                result.getRounds(),
                result.getReps(),
                result.getCompletedAt());
    }

    private ExercisePersonalRecordResponse toExercisePersonalRecord(ExerciseResult result) {
        return new ExercisePersonalRecordResponse(
                result.getId(),
                result.getExercise().getId(),
                result.getExercise().getName(),
                result.getExercise().getMeasurementType(),
                result.getRecordType(),
                result.getValue(),
                result.getUnit(),
                result.getPerformedAt());
    }

    private WodEvolutionPoint toWodEvolutionPoint(WodResult result) {
        return new WodEvolutionPoint(
                result.getId(),
                result.getWod().getId(),
                result.getWod().getName(),
                result.getWod().getType(),
                result.getLevel(),
                result.getTimeSeconds(),
                result.getRounds(),
                result.getReps(),
                result.getCompletedAt());
    }

    private ExerciseEvolutionPoint toExerciseEvolutionPoint(ExerciseResult result) {
        return new ExerciseEvolutionPoint(
                result.getId(),
                result.getExercise().getId(),
                result.getExercise().getName(),
                result.getExercise().getMeasurementType(),
                result.getRecordType(),
                result.getValue(),
                result.getUnit(),
                result.getPerformedAt());
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

    private <T extends Comparable<? super T>> int compareMinimum(T left, T right) {
        if (left == null) {
            return right == null ? 0 : 1;
        }
        return right == null ? -1 : left.compareTo(right);
    }

    private <T extends Comparable<? super T>> int compareMaximum(T left, T right) {
        if (left == null) {
            return right == null ? 0 : -1;
        }
        return right == null ? 1 : left.compareTo(right);
    }

    private <T extends Comparable<? super T>> boolean isMoreRecent(
            T candidateDate,
            Integer candidateId,
            T currentDate,
            Integer currentId) {
        int dateComparison = compareMaximum(candidateDate, currentDate);
        if (dateComparison != 0) {
            return dateComparison > 0;
        }
        return compareMaximum(candidateId, currentId) > 0;
    }

    private record WodRecordKey(Integer wodId, com.wodexplorer.entity.WodLevel level) {
    }

    private record ExerciseRecordKey(Integer exerciseId, ExerciseRecordType recordType) {
    }
}
