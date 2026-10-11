package com.student.studentanalyzer.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
        name = "student_skills",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"studentId", "skillId"}
        )
)
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Current level is required")
    @Min(0)
    @Max(10)
    private Integer currentLevel;

    @NotNull(message = "Target level is required")
    @Min(0)
    @Max(10)
    private Integer targetLevel;

    public StudentSkill() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public Integer getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(Integer currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Integer getTargetLevel() {
        return targetLevel;
    }

    public void setTargetLevel(Integer targetLevel) {
        this.targetLevel = targetLevel;
    }
}