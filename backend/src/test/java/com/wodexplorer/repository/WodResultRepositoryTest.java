package com.wodexplorer.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodResult;
import com.wodexplorer.entity.WodType;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class WodResultRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private WodResultRepository wodResultRepository;

    @Test
    void findByUserAndWod_ReturnsOnlyMatchingResultsInStableOrder() {
        User firstUser = persistUser();
        User secondUser = persistUser();
        Wod wod = persistWod();
        Wod otherWod = persistWod();
        LocalDateTime older = LocalDateTime.of(2026, 9, 10, 10, 0);
        LocalDateTime newer = LocalDateTime.of(2026, 9, 12, 10, 0);

        WodResult olderResult = persistResult(firstUser, wod, older, 400);
        WodResult newerResult = persistResult(firstUser, wod, newer, 300);
        persistResult(secondUser, wod, newer, 200);
        WodResult otherWodResult = persistResult(firstUser, otherWod, newer, 100);
        entityManager.flush();
        entityManager.clear();

        List<WodResult> results = wodResultRepository
                .findByUser_IdAndWod_IdOrderByCompletedAtDescIdDesc(
                        firstUser.getId(), wod.getId());

        assertThat(results).extracting(WodResult::getId)
                .containsExactly(newerResult.getId(), olderResult.getId());

        List<WodResult> userResults = wodResultRepository
                .findByUser_IdOrderByCompletedAtDescIdDesc(firstUser.getId());
        assertThat(userResults).extracting(WodResult::getId)
                .containsExactly(otherWodResult.getId(), newerResult.getId(), olderResult.getId());
    }

    private User persistUser() {
        User user = new User();
        user.setName("Test");
        user.setLastName("Athlete");
        user.setEmail("wod-result-test-" + UUID.randomUUID() + "@example.com");
        user.setPasswordHash("not-a-real-password-hash");
        return entityManager.persistFlushFind(user);
    }

    private Wod persistWod() {
        Wod wod = new Wod();
        wod.setName("Repository test WOD " + UUID.randomUUID());
        wod.setType(WodType.FOR_TIME);
        wod.setLevel(WodLevel.RX);
        return entityManager.persistFlushFind(wod);
    }

    private WodResult persistResult(
            User user,
            Wod wod,
            LocalDateTime completedAt,
            int timeSeconds) {
        WodResult result = new WodResult();
        result.setUser(user);
        result.setWod(wod);
        result.setTimeSeconds(timeSeconds);
        result.setLevel(WodLevel.RX);
        result.setCompletedAt(completedAt);
        return entityManager.persist(result);
    }
}
