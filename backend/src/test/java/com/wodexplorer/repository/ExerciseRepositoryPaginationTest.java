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

import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.support.MySqlIntegrationTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class ExerciseRepositoryPaginationTest extends MySqlIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Test
    void findByNameFilter_ReturnsMatchingPageAndCount() {
        Exercise matching = persistExercise("Power Snatch " + UUID.randomUUID());
        persistExercise("Back Squat " + UUID.randomUUID());
        entityManager.flush();
        entityManager.clear();

        Page<Exercise> result = exerciseRepository.findByNameFilter(
                "snatch",
                PageRequest.of(0, 1, Sort.by(Sort.Order.asc("id"))));

        assertThat(result.getContent()).extracting(Exercise::getId).containsExactly(matching.getId());
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.hasNext()).isFalse();
    }

    private Exercise persistExercise(String name) {
        Exercise exercise = new Exercise();
        exercise.setName(name);
        exercise.setCategory(ExerciseCategory.WEIGHTLIFTING);
        exercise.setMeasurementType(MeasurementType.WEIGHT);
        return entityManager.persistFlushFind(exercise);
    }
}
