package com.student.studentanalyzer.repository;

import com.student.studentanalyzer.entity.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {

    List<LearningRoadmap> findByStudentId(Long studentId);

    List<LearningRoadmap> findBySkillId(Long skillId);

    List<LearningRoadmap> findByStudentIdAndSkillId(Long studentId, Long skillId);
}