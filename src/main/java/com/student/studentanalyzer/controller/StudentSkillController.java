package com.student.studentanalyzer.controller;

import com.student.studentanalyzer.entity.StudentSkill;
import com.student.studentanalyzer.service.StudentSkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-skills")
@CrossOrigin(origins = "*")
public class StudentSkillController {

    private final StudentSkillService studentSkillService;

    public StudentSkillController(StudentSkillService studentSkillService) {
        this.studentSkillService = studentSkillService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<List<StudentSkill>> getStudentSkills(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(
                studentSkillService.getStudentSkills(studentId));
    }

    @PostMapping
    public ResponseEntity<StudentSkill> addStudentSkill(
            @RequestBody StudentSkill studentSkill) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentSkillService.addStudentSkill(studentSkill));
    }

    @PutMapping("/{studentId}/{skillId}")
    public ResponseEntity<StudentSkill> updateStudentSkill(
            @PathVariable Long studentId,
            @PathVariable Long skillId,
            @RequestBody StudentSkill studentSkill) {
        return ResponseEntity.ok(
                studentSkillService.updateStudentSkill(
                        studentId, skillId, studentSkill));
    }

    @DeleteMapping("/{studentId}/{skillId}")
    public ResponseEntity<Void> deleteStudentSkill(
            @PathVariable Long studentId,
            @PathVariable Long skillId) {
        studentSkillService.deleteStudentSkill(studentId, skillId);
        return ResponseEntity.noContent().build();
    }

}