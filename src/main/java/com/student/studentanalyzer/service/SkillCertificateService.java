package com.student.studentanalyzer.service;

import com.student.studentanalyzer.entity.Skill;
import com.student.studentanalyzer.entity.SkillCertificate;
import com.student.studentanalyzer.entity.StudentSkill;
import com.student.studentanalyzer.repository.SkillCertificateRepository;
import com.student.studentanalyzer.repository.SkillRepository;
import com.student.studentanalyzer.repository.StudentSkillRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillCertificateService {

    private final SkillCertificateRepository certificateRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;

    public SkillCertificateService(
            SkillCertificateRepository certificateRepository,
            SkillRepository skillRepository,
            StudentSkillRepository studentSkillRepository) {

        this.certificateRepository = certificateRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
    }

    @Transactional
    public SkillCertificate issueCertificate(Long studentId, Long skillId) {

        if (studentId == null || skillId == null) {
            throw new IllegalArgumentException(
                    "Student ID and Skill ID are required"
            );
        }

        // Check whether the skill exists
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Skill not found")
                );

        // Check whether the student has a record for this skill
        StudentSkill studentSkill =
                studentSkillRepository
                        .findByStudentIdAndSkillId(studentId, skillId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Student skill record not found"
                                )
                        );

        // Do not issue another certificate for the same student and skill
        var existingCertificate =
                certificateRepository.findByStudentIdAndSkillId(
                        studentId, skillId
                );

        if (existingCertificate.isPresent()) {
            return existingCertificate.get();
        }

        // Current level is treated as the verified level
        int verifiedLevel = studentSkill.getCurrentLevel() == null
                ? 0
                : studentSkill.getCurrentLevel();

        int requiredLevel = skill.getRequiredLevel() == null
                ? 5
                : skill.getRequiredLevel();

        // Check eligibility
        if (verifiedLevel < requiredLevel) {
            throw new IllegalArgumentException(
                    "Certificate not available. Verified level: "
                            + verifiedLevel
                            + ", required level: "
                            + requiredLevel
            );
        }

        // Create certificate
        SkillCertificate certificate = new SkillCertificate();
        certificate.setStudentId(studentId);
        certificate.setSkillId(skillId);
        certificate.setVerifiedLevel(verifiedLevel);
        certificate.setRequiredLevel(requiredLevel);

        return certificateRepository.save(certificate);
    }

    public List<SkillCertificate> getCertificatesByStudent(
            Long studentId) {

        return certificateRepository.findByStudentId(studentId);
    }

    public SkillCertificate getCertificateById(Long certificateId) {

        return certificateRepository.findById(certificateId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Certificate not found"
                        )
                );
    }
}