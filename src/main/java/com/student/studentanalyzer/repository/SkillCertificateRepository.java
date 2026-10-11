package com.student.studentanalyzer.repository;

import com.student.studentanalyzer.entity.SkillCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillCertificateRepository
        extends JpaRepository<SkillCertificate, Long> {

    List<SkillCertificate> findByStudentId(Long studentId);

    Optional<SkillCertificate> findByStudentIdAndSkillId(
            Long studentId,
            Long skillId
    );

    Optional<SkillCertificate> findByCertificateNumber(
            String certificateNumber
    );
}