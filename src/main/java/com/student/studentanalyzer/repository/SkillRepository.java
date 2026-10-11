package com.student.studentanalyzer.repository;

import com.student.studentanalyzer.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    boolean existsByNameIgnoreCase(String name);
}