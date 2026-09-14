package com.wodexplorer.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

@Entity
@Table(name = "wod_exercises")
public class WodExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wod_id", nullable = false)
    private Wod wod;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(insertable = false, updatable = false)
    private Integer reps;

    @Column(nullable = false)
    private Integer position;

    @OneToMany(mappedBy = "wodExercise", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<WodExercisePrescription> prescriptions = new ArrayList<>();

    public WodExercise() {
    }

    public Integer getId() {
        return id;
    }

    public Wod getWod() {
        return wod;
    }

    public void setWod(Wod wod) {
        this.wod = wod;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public List<WodExercisePrescription> getPrescriptions() {
        return prescriptions;
    }

    public void addPrescription(WodExercisePrescription prescription) {
        prescriptions.add(prescription);
        prescription.setWodExercise(this);
    }
}
