package com.wodexplorer.entity;

import jakarta.persistence.Column;

import jakarta.persistence.Entity;

import jakarta.persistence.EnumType;

import jakarta.persistence.Enumerated;

import jakarta.persistence.GeneratedValue;

import jakarta.persistence.GenerationType;

import jakarta.persistence.Id;

import jakarta.persistence.Table;

@Entity

@Table(name = "exercises")

public class Exercise {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    @Column(nullable = false, unique = true, length = 100)

    private String name;

    @Enumerated(EnumType.STRING)

    private ExerciseCategory category;

    @Enumerated(EnumType.STRING)

    @Column(name = "measurement_type", nullable = false)

    private MeasurementType measurementType;

    public Integer getId() {

        return id;

    }

    public String getName() {

        return name;

    }
    public void setName(String name) {

    this.name = name;

}

public void setCategory(ExerciseCategory category) {

    this.category = category;

}

public void setMeasurementType(MeasurementType measurementType) {

    this.measurementType = measurementType;

}

    public ExerciseCategory getCategory() {

        return category;

    }

    public MeasurementType getMeasurementType() {

        return measurementType;

    }
    

}