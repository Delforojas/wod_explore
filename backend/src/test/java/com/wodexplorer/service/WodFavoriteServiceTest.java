package com.wodexplorer.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.wodexplorer.dto.FavoriteWodResponse;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodFavorite;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodFavoriteRepository;
import com.wodexplorer.repository.WodRepository;

@ExtendWith(MockitoExtension.class)
class WodFavoriteServiceTest {

    private static final String EMAIL = "athlete@example.com";

    @Mock
    private UserRepository userRepository;

    @Mock
    private WodRepository wodRepository;

    @Mock
    private WodFavoriteRepository wodFavoriteRepository;

    @Captor
    private ArgumentCaptor<WodFavorite> favoriteCaptor;

    @InjectMocks
    private WodFavoriteService wodFavoriteService;

    @Test
    void findOwnFavorites_NormalizesEmailAndMapsPublicResponseInRepositoryOrder() {
        User user = user(4, EMAIL);
        Wod firstWod = wod(18);
        Wod secondWod = wod(12);
        WodFavorite first = favorite(user, firstWod, LocalDateTime.of(2026, 9, 13, 10, 30));
        WodFavorite second = favorite(user, secondWod, LocalDateTime.of(2026, 9, 12, 10, 30));
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodFavoriteRepository.findByUser_IdOrderByCreatedAtDescWod_IdDesc(4))
                .willReturn(List.of(first, second));

        List<FavoriteWodResponse> response = wodFavoriteService
                .findOwnFavorites(" ATHLETE@EXAMPLE.COM ");

        assertThat(response).containsExactly(
                new FavoriteWodResponse(18, LocalDateTime.of(2026, 9, 13, 10, 30)),
                new FavoriteWodResponse(12, LocalDateTime.of(2026, 9, 12, 10, 30)));
        then(wodFavoriteRepository).should()
                .findByUser_IdOrderByCreatedAtDescWod_IdDesc(4);
    }

    @Test
    void addFavorite_CreatesRelationForAccessibleWod() {
        User user = user(4, EMAIL);
        Wod wod = wod(18);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findAccessibleById(18, 4)).willReturn(Optional.of(wod));
        given(wodFavoriteRepository.existsByUser_IdAndWod_Id(4, 18)).willReturn(false);

        wodFavoriteService.addFavorite(18, EMAIL);

        then(wodFavoriteRepository).should().save(favoriteCaptor.capture());
        WodFavorite saved = favoriteCaptor.getValue();
        assertThat(saved.getUser()).isSameAs(user);
        assertThat(saved.getWod()).isSameAs(wod);
        assertThat(saved.getId().getUserId()).isEqualTo(4);
        assertThat(saved.getId().getWodId()).isEqualTo(18);
    }

    @Test
    void addFavorite_WhenAlreadyPresent_IsIdempotent() {
        User user = user(4, EMAIL);
        Wod wod = wod(18);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findAccessibleById(18, 4)).willReturn(Optional.of(wod));
        given(wodFavoriteRepository.existsByUser_IdAndWod_Id(4, 18)).willReturn(true);

        wodFavoriteService.addFavorite(18, EMAIL);

        then(wodFavoriteRepository).shouldHaveNoMoreInteractions();
    }

    @Test
    void addFavorite_WhenWodBelongsToAnotherUser_ThrowsNotFoundWithoutSaving() {
        User user = user(4, EMAIL);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findAccessibleById(18, 4)).willReturn(Optional.empty());

        assertThatThrownBy(() -> wodFavoriteService.addFavorite(18, EMAIL))
                .isInstanceOf(WodNotFoundException.class);

        then(wodFavoriteRepository).shouldHaveNoInteractions();
    }

    @Test
    void removeFavorite_DeletesOnlyAuthenticatedUsersRelation() {
        User user = user(4, EMAIL);
        Wod wod = wod(18);
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.of(user));
        given(wodRepository.findAccessibleById(18, 4)).willReturn(Optional.of(wod));

        wodFavoriteService.removeFavorite(18, EMAIL);

        then(wodFavoriteRepository).should().deleteByUser_IdAndWod_Id(4, 18);
    }

    @Test
    void findOwnFavorites_WhenUserCannotBeResolved_ThrowsUnauthorizedDomainError() {
        given(userRepository.findByEmail(EMAIL)).willReturn(Optional.empty());

        assertThatThrownBy(() -> wodFavoriteService.findOwnFavorites(EMAIL))
                .isInstanceOf(AuthenticatedUserNotFoundException.class);
        then(wodFavoriteRepository).shouldHaveNoInteractions();
    }

    private User user(int id, String email) {
        User user = new User();
        ReflectionTestUtils.setField(user, "id", id);
        user.setEmail(email);
        return user;
    }

    private Wod wod(int id) {
        Wod wod = new Wod();
        wod.setId(id);
        return wod;
    }

    private WodFavorite favorite(User user, Wod wod, LocalDateTime createdAt) {
        WodFavorite favorite = new WodFavorite(
                new com.wodexplorer.entity.WodFavoriteId(user.getId(), wod.getId()), user, wod);
        ReflectionTestUtils.setField(favorite, "createdAt", createdAt);
        return favorite;
    }
}
