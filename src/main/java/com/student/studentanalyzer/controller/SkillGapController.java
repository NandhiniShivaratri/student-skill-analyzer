package com.student.studentanalyzer.controller;

import com.student.studentanalyzer.service.SkillGapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skill-gaps")
@CrossOrigin(origins = "*")
public class SkillGapController {

    private final SkillGapService skillGapService;

    public SkillGapController(SkillGapService skillGapService) {
        this.skillGapService = skillGapService;
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> analyzeSkillGaps(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                skillGapService.analyzeSkillGaps(studentId));
    }

}