package com.wodexplorer.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "wod_exercise_prescriptions")
public class WodExercisePrescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wod_exercise_id", nullable = false)
    private WodExercise wodExercise;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WodExercisePrescriptionUnit unit;

    @Column(name = "unit_label", length = 100)
    private String unitLabel;

    public Integer getId() {
        return id;
    }

    public WodExercise getWodExercise() {
        return wodExercise;
    }

    public void setWodExercise(WodExercise wodExercise) {
        this.wodExercise = wodExercise;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public WodExercisePrescriptionUnit getUnit() {
        return unit;
    }

    public void setUnit(WodExercisePrescriptionUnit unit) {
        this.unit = unit;
    }

    public String getUnitLabel() {
        return unitLabel;
    }

    public void setUnitLabel(String unitLabel) {
        this.unitLabel = unitLabel;
    }
}
