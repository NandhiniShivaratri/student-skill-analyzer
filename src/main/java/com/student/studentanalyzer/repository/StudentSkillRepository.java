package com.student.studentanalyzer.repository;

import com.student.studentanalyzer.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository
        extends JpaRepository<StudentSkill, Long> {

    Optional<StudentSkill> findByStudentIdAndSkillId(
            Long studentId,
            Long skillId
    );

    boolean existsByStudentIdAndSkillId(
            Long studentId,
            Long skillId
    );

    List<StudentSkill> findByStudentId(Long studentId);
}