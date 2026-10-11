package com.student.studentanalyzer.controller;

import com.student.studentanalyzer.entity.Skill;
import com.student.studentanalyzer.service.SkillService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    public ResponseEntity<Skill> addSkill(
            @Valid @RequestBody Skill skill) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(skillService.addSkill(skill));
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Long id) {
        return skillService.getSkillById(id);
    }

    @PutMapping("/{id}")
    public Skill updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody Skill skill) {

        return skillService.updateSkill(id, skill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSkill(
            @PathVariable Long id) {

        skillService.deleteSkill(id);

        return ResponseEntity.ok("Skill deleted successfully");
    }
}