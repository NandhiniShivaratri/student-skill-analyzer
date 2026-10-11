package com.student.studentanalyzer.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "skill_certificates",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_student_skill_certificate",
                        columnNames = {"student_id", "skill_id"}
                ),
                @UniqueConstraint(
                        name = "uk_certificate_number",
                        columnNames = {"certificate_number"}
                )
        }
)
public class SkillCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;

    @Column(name = "certificate_number", nullable = false, unique = true)
    private String certificateNumber;

    @Column(name = "verified_level", nullable = false)
    private Integer verifiedLevel;

    @Column(name = "required_level", nullable = false)
    private Integer requiredLevel;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    public SkillCertificate() {
    }

    @PrePersist
    public void beforeSave() {
        if (certificateNumber == null || certificateNumber.isBlank()) {
            certificateNumber = "SSA-" +
                    UUID.randomUUID().toString()
                            .replace("-", "")
                            .substring(0, 12)
                            .toUpperCase();
        }

        if (issueDate == null) {
            issueDate = LocalDate.now();
        }
    }

    public Long getId() {
        return id;
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

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public Integer getVerifiedLevel() {
        return verifiedLevel;
    }

    public void setVerifiedLevel(Integer verifiedLevel) {
        this.verifiedLevel = verifiedLevel;
    }

    public Integer getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(Integer requiredLevel) {
        this.requiredLevel = requiredLevel;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }
}