package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

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

@ExtendWith(MockitoExtension.class)
class WodResultServiceTest {

    private static final LocalDateTime NOW = LocalDateTime.of(2026, 9, 12, 18, 30);
    private static final String EMAIL = "athlete@example.com";

    @Mock
    private UserRepository userRepository;

    @Mock
    private WodRepository wodRepository;

    @Mock
    private WodResultRepository wodResultRepository;

    @Captor
    private ArgumentCaptor<WodResult> resultCaptor;

    @InjectMocks
    private WodResultService wodResultService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(
                wodResultService,
                "clock",
                Clock.fixed(Instant.parse("2026-09-12T18:30:00Z"), ZoneOffset.UTC));
    }

    @Test
    void create_ForTime_AssociatesAuthenticatedUserAndWod() {
        User user = user(4, EMAIL);
        Wod wod = wod(18, WodType.FOR_TIME);
        WodResultRequest request = new WodResultRequest(
                342, null, null, WodLevel.RX, NOW);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod));
        given(wodResultRepository.save(any(WodResult.class)))
                .willAnswer(invocation -> {
                    WodResult result = invocation.getArgument(0);
                    ReflectionTestUtils.setField(result, "id", 42);
                    return result;
                });

        WodResultResponse response = wodResultService.create(18, request, " ATHLETE@EXAMPLE.COM ");

        then(wodResultRepository).should().save(resultCaptor.capture());
        WodResult savedResult = resultCaptor.getValue();
        assertThat(savedResult.getUser()).isSameAs(user);
        assertThat(savedResult.getWod()).isSameAs(wod);
        assertThat(savedResult.getTimeSeconds()).isEqualTo(342);
        assertThat(savedResult.getLevel()).isEqualTo(WodLevel.RX);
        assertThat(response).isEqualTo(new WodResultResponse(
                42, 18, 342, null, null, WodLevel.RX, NOW));
    }

    @Test
    void create_Amrap_AllowsZeroRoundsAndReps() {
        User user = user(4, EMAIL);
        Wod wod = wod(18, WodType.AMRAP);
        WodResultRequest request = new WodResultRequest(
                null, 0, 0, WodLevel.BEGINNER, null);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod));
        given(wodResultRepository.save(any(WodResult.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        WodResultResponse response = wodResultService.create(18, request, EMAIL);

        assertThat(response.rounds()).isZero();
        assertThat(response.reps()).isZero();
        assertThat(response.completedAt()).isEqualTo(NOW);
    }

    @Test
    void create_Emom_RequiresOnlyTotalReps() {
        User user = user(4, EMAIL);
        Wod wod = wod(18, WodType.EMOM);
        WodResultRequest request = new WodResultRequest(
                null, null, 24, WodLevel.INTERMEDIATE, NOW);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod));
        given(wodResultRepository.save(any(WodResult.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        WodResultResponse response = wodResultService.create(18, request, EMAIL);

        assertThat(response.reps()).isEqualTo(24);
    }

    @Test
    void create_WhenForTimeTimeIsMissing_RejectsWithoutSaving() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod(18, WodType.FOR_TIME)));

        assertThatThrownBy(() -> wodResultService.create(
                18,
                new WodResultRequest(null, null, null, WodLevel.RX, NOW),
                EMAIL))
                .isInstanceOf(InvalidWodResultException.class)
                .hasMessage("timeSeconds es obligatorio para un WOD FOR_TIME");
        then(wodResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenAmrapHasTime_Rejects() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod(18, WodType.AMRAP)));

        assertThatThrownBy(() -> wodResultService.create(
                18,
                new WodResultRequest(300, 5, 2, WodLevel.RX, NOW),
                EMAIL))
                .isInstanceOf(InvalidWodResultException.class)
                .hasMessage("timeSeconds debe omitirse para un WOD AMRAP");
        then(wodResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenEmomHasRounds_Rejects() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod(18, WodType.EMOM)));

        assertThatThrownBy(() -> wodResultService.create(
                18,
                new WodResultRequest(null, 5, 24, WodLevel.RX, NOW),
                EMAIL))
                .isInstanceOf(InvalidWodResultException.class)
                .hasMessage("timeSeconds y rounds deben omitirse para un WOD EMOM");
        then(wodResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenCompletedAtIsFuture_Rejects() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod(18, WodType.FOR_TIME)));

        assertThatThrownBy(() -> wodResultService.create(
                18,
                new WodResultRequest(342, null, null, WodLevel.RX, NOW.plusSeconds(1)),
                EMAIL))
                .isInstanceOf(InvalidWodResultException.class)
                .hasMessage("completedAt no puede ser una fecha futura");
        then(wodResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void create_WhenAuthenticatedUserDoesNotExist_RejectsBeforeLoadingWod() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.empty());

        assertThatThrownBy(() -> wodResultService.create(
                18,
                new WodResultRequest(342, null, null, WodLevel.RX, NOW),
                EMAIL))
                .isInstanceOf(AuthenticatedUserNotFoundException.class);
        then(wodRepository).shouldHaveNoInteractions();
        then(wodResultRepository).shouldHaveNoInteractions();
    }

    @Test
    void findOwnResults_FiltersByAuthenticatedUserAndWod() {
        User user = user(4, EMAIL);
        Wod wod = wod(18, WodType.FOR_TIME);
        WodResult result = result(42, user, wod, 342, NOW);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findById(18)).willReturn(Optional.of(wod));
        given(wodResultRepository.findByUser_IdAndWod_IdOrderByCompletedAtDescIdDesc(4, 18))
                .willReturn(List.of(result));

        List<WodResultResponse> response = wodResultService.findOwnResults(18, EMAIL);

        assertThat(response).containsExactly(new WodResultResponse(
                42, 18, 342, null, null, WodLevel.RX, NOW));
        then(wodResultRepository).should()
                .findByUser_IdAndWod_IdOrderByCompletedAtDescIdDesc(4, 18);
    }

    @Test
    void findOwnResults_WhenWodDoesNotExist_ThrowsNotFound() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user(4, EMAIL)));
        given(wodRepository.findById(999)).willReturn(Optional.empty());

        assertThatThrownBy(() -> wodResultService.findOwnResults(999, EMAIL))
                .isInstanceOf(WodNotFoundException.class)
                .hasMessage("WOD no encontrado con id: 999");
        then(wodResultRepository).shouldHaveNoInteractions();
    }

    private User user(int id, String email) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setEmail(email);
        return user;
    }

    private Wod wod(int id, WodType type) {
        Wod wod = new Wod();
        wod.setId(id);
        wod.setType(type);
        return wod;
    }

    private WodResult result(
            int id,
            User user,
            Wod wod,
            int timeSeconds,
            LocalDateTime completedAt) {
        WodResult result = new WodResult();
        ReflectionTestUtils.setField(result, "id", id);
        result.setUser(user);
        result.setWod(wod);
        result.setTimeSeconds(timeSeconds);
        result.setLevel(WodLevel.RX);
        result.setCompletedAt(completedAt);
        return result;
    }
}
