package com.student.studentanalyzer.service;

import com.student.studentanalyzer.entity.LearningRoadmap;
import com.student.studentanalyzer.repository.LearningRoadmapRepository;
import com.student.studentanalyzer.repository.StudentRepository;
import com.student.studentanalyzer.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoadmapService {

    private final LearningRoadmapRepository roadmapRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public RoadmapService(
            LearningRoadmapRepository roadmapRepository,
            StudentRepository studentRepository,
            SkillRepository skillRepository) {
        this.roadmapRepository = roadmapRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
    }

    public List<LearningRoadmap> getAllRoadmaps() {
        return roadmapRepository.findAll();
    }

    public LearningRoadmap getRoadmapById(Long id) {
        return roadmapRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Roadmap not found"));
    }

    public List<LearningRoadmap> getRoadmapsByStudent(Long studentId) {
        return roadmapRepository.findByStudentId(studentId);
    }

    public LearningRoadmap createRoadmap(LearningRoadmap roadmap) {
        if (!studentRepository.existsById(roadmap.getStudentId())) {
            throw new RuntimeException("Student not found");
        }

        if (!skillRepository.existsById(roadmap.getSkillId())) {
            throw new RuntimeException("Skill not found");
        }

        return roadmapRepository.save(roadmap);
    }

    public LearningRoadmap updateRoadmap(
            Long id, LearningRoadmap updatedRoadmap) {

        LearningRoadmap existing = getRoadmapById(id);

        existing.setTitle(updatedRoadmap.getTitle());
        existing.setDescription(updatedRoadmap.getDescription());
        existing.setResourceUrl(updatedRoadmap.getResourceUrl());
        existing.setPriority(updatedRoadmap.getPriority());
        existing.setStatus(updatedRoadmap.getStatus());
        existing.setTargetDate(updatedRoadmap.getTargetDate());

        return roadmapRepository.save(existing);
    }

    public void deleteRoadmap(Long id) {
        if (!roadmapRepository.existsById(id)) {
            throw new RuntimeException("Roadmap not found");
        }

        roadmapRepository.deleteById(id);
    }
}