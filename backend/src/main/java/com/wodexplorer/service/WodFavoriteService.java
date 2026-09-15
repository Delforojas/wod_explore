package com.wodexplorer.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wodexplorer.dto.FavoriteWodResponse;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodFavorite;
import com.wodexplorer.entity.WodFavoriteId;
import com.wodexplorer.exception.AuthenticatedUserNotFoundException;
import com.wodexplorer.exception.WodNotFoundException;
import com.wodexplorer.repository.UserRepository;
import com.wodexplorer.repository.WodFavoriteRepository;
import com.wodexplorer.repository.WodRepository;

@Service
public class WodFavoriteService {

    private final UserRepository userRepository;
    private final WodRepository wodRepository;
    private final WodFavoriteRepository wodFavoriteRepository;

    public WodFavoriteService(
            UserRepository userRepository,
            WodRepository wodRepository,
            WodFavoriteRepository wodFavoriteRepository) {
        this.userRepository = userRepository;
        this.wodRepository = wodRepository;
        this.wodFavoriteRepository = wodFavoriteRepository;
    }

    @Transactional(readOnly = true)
    public List<FavoriteWodResponse> findOwnFavorites(String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);

        return wodFavoriteRepository.findByUser_IdOrderByCreatedAtDescWod_IdDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void addFavorite(Integer wodId, String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        Wod wod = findAccessibleWod(wodId, user);

        if (!wodFavoriteRepository.existsByUser_IdAndWod_Id(user.getId(), wod.getId())) {
            wodFavoriteRepository.save(new WodFavorite(
                    new WodFavoriteId(user.getId(), wod.getId()), user, wod));
        }
    }

    @Transactional
    public void removeFavorite(Integer wodId, String authenticatedEmail) {
        User user = findAuthenticatedUser(authenticatedEmail);
        Wod wod = findAccessibleWod(wodId, user);
        wodFavoriteRepository.deleteByUser_IdAndWod_Id(user.getId(), wod.getId());
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

    private Wod findAccessibleWod(Integer wodId, User user) {
        return wodRepository.findAccessibleById(wodId, user.getId())
                .orElseThrow(() -> new WodNotFoundException(wodId));
    }

    private FavoriteWodResponse toResponse(WodFavorite favorite) {
        return new FavoriteWodResponse(
                favorite.getWod().getId(),
                favorite.getCreatedAt());
    }
}
