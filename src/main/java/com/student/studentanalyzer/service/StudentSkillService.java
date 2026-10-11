package com.student.studentanalyzer.service;

import com.student.studentanalyzer.entity.StudentSkill;
import com.student.studentanalyzer.repository.StudentSkillRepository;
import com.student.studentanalyzer.repository.StudentRepository;
import com.student.studentanalyzer.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentSkillService {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public StudentSkillService(
            StudentSkillRepository studentSkillRepository,
            StudentRepository studentRepository,
            SkillRepository skillRepository) {
        this.studentSkillRepository = studentSkillRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
    }

    public List<StudentSkill> getStudentSkills(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found");
        }

        return studentSkillRepository.findByStudentId(studentId);
    }

    public StudentSkill addStudentSkill(StudentSkill studentSkill) {
        Long studentId = studentSkill.getStudentId();
        Long skillId = studentSkill.getSkillId();

        if (!studentRepository.existsById(studentId)) {
            throw new RuntimeException("Student not found");
        }

        if (!skillRepository.existsById(skillId)) {
            throw new RuntimeException("Skill not found");
        }

        if (studentSkillRepository.existsByStudentIdAndSkillId(
                studentId, skillId)) {
            throw new RuntimeException("Student already has this skill");
        }

        return studentSkillRepository.save(studentSkill);
    }

    public StudentSkill updateStudentSkill(
            Long studentId, Long skillId, StudentSkill updatedSkill) {

        StudentSkill existingSkill = studentSkillRepository
                .findByStudentId(studentId)
                .stream()
                .filter(skill -> skill.getSkillId().equals(skillId))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Student skill not found"));

        existingSkill.setCurrentLevel(updatedSkill.getCurrentLevel());
        existingSkill.setTargetLevel(updatedSkill.getTargetLevel());

        return studentSkillRepository.save(existingSkill);
    }

    public void deleteStudentSkill(Long studentId, Long skillId) {
        StudentSkill existingSkill = studentSkillRepository
                .findByStudentId(studentId)
                .stream()
                .filter(skill -> skill.getSkillId().equals(skillId))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Student skill not found"));

        studentSkillRepository.delete(existingSkill);
    }

}