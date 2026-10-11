package com.student.studentanalyzer.service;

import com.student.studentanalyzer.entity.Skill;
import com.student.studentanalyzer.repository.SkillRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public Skill addSkill(Skill skill) {

        if (skillRepository.existsByNameIgnoreCase(skill.getName())) {
            throw new RuntimeException("Skill already exists");
        }

        if (skill.getRequiredLevel() == null
                || skill.getRequiredLevel() < 0
                || skill.getRequiredLevel() > 10) {

            throw new RuntimeException(
                    "Required level must be between 0 and 10"
            );
        }

        return skillRepository.save(skill);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {

        return skillRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Skill not found")
                );
    }

    public Skill updateSkill(Long id, Skill updatedSkill) {

        Skill skill = getSkillById(id);

        if (!skill.getName().equalsIgnoreCase(updatedSkill.getName())
                && skillRepository.existsByNameIgnoreCase(
                updatedSkill.getName())) {

            throw new RuntimeException("Skill already exists");
        }

        if (updatedSkill.getRequiredLevel() == null
                || updatedSkill.getRequiredLevel() < 0
                || updatedSkill.getRequiredLevel() > 10) {

            throw new RuntimeException(
                    "Required level must be between 0 and 10"
            );
        }

        skill.setName(updatedSkill.getName());
        skill.setCategory(updatedSkill.getCategory());
        skill.setDescription(updatedSkill.getDescription());
        skill.setRequiredLevel(updatedSkill.getRequiredLevel());

        return skillRepository.save(skill);
    }

    public void deleteSkill(Long id) {

        if (!skillRepository.existsById(id)) {
            throw new RuntimeException("Skill not found");
        }

        skillRepository.deleteById(id);
    }
}