package com.wodexplorer.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import jakarta.persistence.PersistenceException;

import com.wodexplorer.entity.Exercise;
import com.wodexplorer.entity.ExerciseCategory;
import com.wodexplorer.entity.MeasurementType;
import com.wodexplorer.entity.User;
import com.wodexplorer.entity.Wod;
import com.wodexplorer.entity.WodCategory;
import com.wodexplorer.entity.WodExercise;
import com.wodexplorer.entity.WodExercisePrescription;
import com.wodexplorer.entity.WodExercisePrescriptionUnit;
import com.wodexplorer.entity.WodLevel;
import com.wodexplorer.entity.WodType;
import com.wodexplorer.support.MySqlIntegrationTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class CustomWodRepositoryTest extends MySqlIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private WodRepository wodRepository;

    @Autowired
    private WodExerciseRepository wodExerciseRepository;

    @Test
    void findByOwner_ReturnsOnlyOwnedWodsWithStableOrdering() {
        User owner = persistUser("owner");
        User otherOwner = persistUser("other");
        Wod first = persistWod(owner, "First");
        Wod second = persistWod(owner, "Second");
        persistWod(otherOwner, "Other");
        persistWod(null, "Global");
        entityManager.flush();
        entityManager.clear();

        Page<Wod> result = wodRepository.findByOwner_Id(
                owner.getId(),
                PageRequest.of(0, 20, Sort.by(
                        Sort.Order.desc("createdAt"), Sort.Order.desc("id"))));

        assertThat(result.getContent()).extracting(Wod::getId)
                .containsExactly(second.getId(), first.getId());
        assertThat(result.getTotalElements()).isEqualTo(2);
    }

    @Test
    void findByIdAndOwner_DoesNotReturnGlobalOrForeignWods() {
        User owner = persistUser("owner");
        User otherOwner = persistUser("other");
        Wod owned = persistWod(owner, "Owned");
        Wod foreign = persistWod(otherOwner, "Foreign");
        Wod global = persistWod(null, "Global");
        entityManager.flush();
        entityManager.clear();

        assertThat(wodRepository.findByIdAndOwner_Id(owned.getId(), owner.getId())).isPresent();
        assertThat(wodRepository.findByIdAndOwner_Id(foreign.getId(), owner.getId())).isEmpty();
        assertThat(wodRepository.findByIdAndOwner_Id(global.getId(), owner.getId())).isEmpty();
    }

    @Test
    void globalCatalogQuery_ExcludesPersonalWods() {
        User owner = persistUser("owner");
        persistWod(owner, "Personal");
        Wod global = persistWod(null, "Global");
        entityManager.flush();
        entityManager.clear();

        Page<Wod> result = wodRepository.findByFilters(
                null,
                null,
                null,
                PageRequest.of(0, 20, Sort.by(Sort.Order.asc("id"))));

        assertThat(result.getContent()).extracting(Wod::getId).containsExactly(global.getId());
    }

    @Test
    void findByWod_LoadsExerciseAndPrescriptionsInOrder() {
        User owner = persistUser("owner");
        Exercise exercise = persistExercise();
        Wod wod = persistWod(owner, "With prescriptions");
        WodExercise first = persistWodExercise(wod, exercise, 1);
        WodExercise second = persistWodExercise(wod, exercise, 2);
        persistPrescription(first, "21", WodExercisePrescriptionUnit.REPS, null);
        persistPrescription(second, "20", WodExercisePrescriptionUnit.KG, null);
        persistPrescription(second, "100", WodExercisePrescriptionUnit.METERS, null);
        entityManager.flush();
        entityManager.clear();

        var result = wodExerciseRepository.findByWodIdWithExerciseOrderByPositionAsc(wod.getId());

        assertThat(result).extracting(WodExercise::getPosition).containsExactly(1, 2);
        assertThat(result.get(0).getPrescriptions()).hasSize(1);
        assertThat(result.get(1).getPrescriptions()).extracting(WodExercisePrescription::getUnit)
                .containsExactly(WodExercisePrescriptionUnit.KG, WodExercisePrescriptionUnit.METERS);
        assertThat(Hibernate.isInitialized(result.get(0).getExercise())).isTrue();
        assertThat(Hibernate.isInitialized(result.get(0).getPrescriptions())).isTrue();
    }

    @Test
    void duplicatePosition_IsRejected() {
        User owner = persistUser("owner");
        Exercise exercise = persistExercise();
        Wod wod = persistWod(owner, "Duplicate position");
        persistWodExercise(wod, exercise, 1);

        assertThatThrownBy(() -> persistWodExercise(wod, exercise, 1))
                .isInstanceOf(ConstraintViolationException.class);
    }

    @Test
    void otherUnitRequiresNonBlankLabel() {
        User owner = persistUser("owner");
        Exercise exercise = persistExercise();
        Wod wod = persistWod(owner, "Other unit");
        WodExercise wodExercise = persistWodExercise(wod, exercise, 1);
        WodExercisePrescription prescription = new WodExercisePrescription();
        prescription.setWodExercise(wodExercise);
        prescription.setValue(new BigDecimal("1.00"));
        prescription.setUnit(WodExercisePrescriptionUnit.OTHER);
        prescription.setUnitLabel("   ");

        assertThatThrownBy(() -> entityManager.persistFlushFind(prescription))
                .isInstanceOf(PersistenceException.class);
    }

    @Test
    void removingWod_RemovesChildrenButKeepsCatalogExercise() {
        User owner = persistUser("owner");
        Exercise exercise = persistExercise();
        Wod wod = persistWod(owner, "Cascade");
        WodExercise wodExercise = persistWodExercise(wod, exercise, 1);
        WodExercisePrescription prescription = persistPrescription(
                wodExercise, "10", WodExercisePrescriptionUnit.REPS, null);
        entityManager.flush();

        entityManager.remove(wod);
        entityManager.flush();
        entityManager.clear();

        assertThat(entityManager.find(Wod.class, wod.getId())).isNull();
        assertThat(entityManager.find(WodExercise.class, wodExercise.getId())).isNull();
        assertThat(entityManager.find(WodExercisePrescription.class, prescription.getId())).isNull();
        assertThat(entityManager.find(Exercise.class, exercise.getId())).isNotNull();
    }

    private User persistUser(String prefix) {
        User user = new User();
        user.setName("Test");
        user.setLastName("Athlete");
        user.setEmail(prefix + "-" + UUID.randomUUID() + "@example.com");
        user.setPasswordHash("not-a-real-password-hash");
        return entityManager.persistFlushFind(user);
    }

    private Exercise persistExercise() {
        Exercise exercise = new Exercise();
        exercise.setName("Deadlift " + UUID.randomUUID());
        exercise.setCategory(ExerciseCategory.WEIGHTLIFTING);
        exercise.setMeasurementType(MeasurementType.WEIGHT_DISTANCE);
        return entityManager.persistFlushFind(exercise);
    }

    private Wod persistWod(User owner, String name) {
        Wod wod = new Wod();
        wod.setOwner(owner);
        wod.setName(name + " " + UUID.randomUUID());
        wod.setType(WodType.FOR_TIME);
        wod.setLevel(WodLevel.RX);
        wod.setCategory(WodCategory.METCON);
        return entityManager.persistFlushFind(wod);
    }

    private WodExercise persistWodExercise(Wod wod, Exercise exercise, int position) {
        WodExercise wodExercise = new WodExercise();
        wodExercise.setWod(wod);
        wodExercise.setExercise(exercise);
        wodExercise.setPosition(position);
        return entityManager.persistFlushFind(wodExercise);
    }

    private WodExercisePrescription persistPrescription(
            WodExercise wodExercise,
            String value,
            WodExercisePrescriptionUnit unit,
            String unitLabel) {
        WodExercisePrescription prescription = new WodExercisePrescription();
        prescription.setWodExercise(wodExercise);
        prescription.setValue(new BigDecimal(value));
        prescription.setUnit(unit);
        prescription.setUnitLabel(unitLabel);
        return entityManager.persist(prescription);
    }
}
