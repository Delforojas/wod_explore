package com.wodexplorer.service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.WodResultRequest;
import com.wodexplorer.dto.WodResultResponse;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodResult;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.InvalidWodResultException;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodRepository;
import com.wodexplorer.repository.WodResultRepository;

@Service
public class WodResultService {

    private final UserRepository userRepository;
    private final WodRepository wodRepository;
    private final WodResultRepository wodResultRepository;
    private final Clock clock;

    public WodResultService(
            UserRepository userRepository,
            WodRepository wodRepository,
            WodResultRepository wodResultRepository,
            Clock clock) {
        this.userRepository = userRepository;
        this.wodRepository = wodRepository;
        this.wodResultRepository = wodResultRepository;
        this.clock = clock;
    }

    @Transactional
    public WodResultResponse create(
            Integer wodId,
            WodResultRequest request,
            String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        Wod wod = findAccessibleWod(wodId, user);
        validateMetrics(wod.getType(), request);
        LocalDateTime completedAt = resolveCompletedAt(request.completedAt());

        WodResult result = new WodResult();
        result.setUser(user);
        result.setWod(wod);
        result.setTimeSeconds(request.timeSeconds());
        result.setRounds(request.rounds());
        result.setReps(request.reps());
        result.setLevel(request.level());
        result.setCompletedAt(completedAt);

        return toResponse(wodResultRepository.save(result));
    }

    @Transactional(readOnly = true)
    public List<WodResultResponse> findOwnResults(
            Integer wodId,
            String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        Wod wod = findAccessibleWod(wodId, user);

        return wodResultRepository
                .findByUser_IdAndWod_IdOrderByCompletedAtDescIdDesc(user.getId(), wod.getId())
                .stream()
                .map(this::toResponse)
                .toList();
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

    private Wod findAccessibleWod(Integer wodId, User authenticatedUser) {
        Wod wod = wodRepository.findById(wodId)
                .orElseThrow(() -> new WodNotFoundException(wodId));

        User owner = wod.getOwner();
        if (owner != null && !Objects.equals(owner.getId(), authenticatedUser.getId())) {
            throw new WodNotFoundException(wodId);
        }

        return wod;
    }

    private void validateMetrics(WodType type, WodResultRequest request) {
        switch (type) {
            case FOR_TIME -> validateForTime(request);
            case AMRAP -> validateAmrap(request);
            case EMOM -> validateEmom(request);
        }
    }

    private void validateForTime(WodResultRequest request) {
        if (request.timeSeconds() == null) {
            throw invalid("timeSeconds es obligatorio para un WOD FOR_TIME");
        }
        if (request.rounds() != null || request.reps() != null) {
            throw invalid("rounds y reps deben omitirse para un WOD FOR_TIME");
        }
    }

    private void validateAmrap(WodResultRequest request) {
        if (request.rounds() == null || request.reps() == null) {
            throw invalid("rounds y reps son obligatorios para un WOD AMRAP");
        }
        if (request.timeSeconds() != null) {
            throw invalid("timeSeconds debe omitirse para un WOD AMRAP");
        }
    }

    private void validateEmom(WodResultRequest request) {
        if (request.reps() == null) {
            throw invalid("reps es obligatorio para un WOD EMOM");
        }
        if (request.timeSeconds() != null || request.rounds() != null) {
            throw invalid("timeSeconds y rounds deben omitirse para un WOD EMOM");
        }
    }

    private InvalidWodResultException invalid(String message) {
        return new InvalidWodResultException(message);
    }

    private LocalDateTime resolveCompletedAt(LocalDateTime requestedCompletedAt) {
        LocalDateTime now = LocalDateTime.now(clock).truncatedTo(ChronoUnit.SECONDS);
        LocalDateTime completedAt = requestedCompletedAt == null ? now : requestedCompletedAt;

        if (completedAt.isAfter(now)) {
            throw invalid("completedAt no puede ser una fecha futura");
        }
        return completedAt;
    }

    private WodResultResponse toResponse(WodResult result) {
        return new WodResultResponse(
                result.getId(),
                result.getWod().getId(),
                result.getTimeSeconds(),
                result.getRounds(),
                result.getReps(),
                result.getLevel(),
                result.getCompletedAt()
        );
    }
}
