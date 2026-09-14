package com.wodexplorer.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.support.MySqlIntegrationTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class WodRepositoryPaginationTest extends MySqlIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private WodRepository wodRepository;

    @Test
    void findByFilters_ReturnsFilteredPageWithStableMetadata() {
        Wod matching = persistWod("Fran " + UUID.randomUUID(), WodType.FOR_TIME, WodLevel.RX);
        persistWod("Annie " + UUID.randomUUID(), WodType.FOR_TIME, WodLevel.RX);
        entityManager.flush();
        entityManager.clear();

        Page<Wod> result = wodRepository.findByFilters(
                "fran",
                WodType.FOR_TIME,
                WodLevel.RX,
                PageRequest.of(0, 1, Sort.by(Sort.Order.asc("id"))));

        assertThat(result.getContent()).extracting(Wod::getId).containsExactly(matching.getId());
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getTotalPages()).isEqualTo(1);
        assertThat(result.hasNext()).isFalse();
    }

    private Wod persistWod(String name, WodType type, WodLevel level) {
        Wod wod = new Wod();
        wod.setName(name);
        wod.setType(type);
        wod.setLevel(level);
        return entityManager.persistFlushFind(wod);
    }
}
