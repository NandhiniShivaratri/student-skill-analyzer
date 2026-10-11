package com.student.studentanalyzer.service;

import com.student.studentanalyzer.entity.StudentSkill;
import com.student.studentanalyzer.repository.StudentSkillRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SkillGapService {

    private final StudentSkillRepository studentSkillRepository;

    public SkillGapService(StudentSkillRepository studentSkillRepository) {
        this.studentSkillRepository = studentSkillRepository;
    }

    public List<Map<String, Object>> analyzeSkillGaps(Long studentId) {

        List<StudentSkill> studentSkills =
                studentSkillRepository.findByStudentId(studentId);

        List<Map<String, Object>> results = new ArrayList<>();

        for (StudentSkill studentSkill : studentSkills) {

            int currentLevel = studentSkill.getCurrentLevel();
            int targetLevel = studentSkill.getTargetLevel();

            int skillGap = Math.max(0, targetLevel - currentLevel);

            Map<String, Object> skillData = new HashMap<>();

            skillData.put("skillId", studentSkill.getSkillId());
            skillData.put("currentLevel", currentLevel);
            skillData.put("targetLevel", targetLevel);
            skillData.put("skillGap", skillGap);

            if (skillGap == 0) {
                skillData.put("status", "Target Achieved");
            } else {
                skillData.put("status", "Skill Improvement Needed");
            }

            results.add(skillData);
        }

        return results;
    }

}