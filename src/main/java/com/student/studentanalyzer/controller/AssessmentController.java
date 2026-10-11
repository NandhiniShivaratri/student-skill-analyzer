package com.student.studentanalyzer.controller;

import com.student.studentanalyzer.AssessmentSubmissionRequest;
import com.student.studentanalyzer.dto.AssessmentQuestionResponse;
import com.student.studentanalyzer.entity.Assessment;
import com.student.studentanalyzer.entity.AssessmentResult;
import com.student.studentanalyzer.service.AssessmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "http://localhost:5173")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    // Get all assessments
    @GetMapping
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        return ResponseEntity.ok(
                assessmentService.getAllAssessments());
    }

    // Get assessment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Assessment> getAssessmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assessmentService.getAssessmentById(id));
    }

    // Get assessments by skill ID
    @GetMapping("/skill/{skillId}")
    public ResponseEntity<List<Assessment>> getAssessmentsBySkill(
            @PathVariable Long skillId) {

        return ResponseEntity.ok(
                assessmentService.getAssessmentsBySkill(skillId));
    }

    // Get questions without correct answers
    @GetMapping("/{assessmentId}/questions")
    public ResponseEntity<List<AssessmentQuestionResponse>> getQuestions(
            @PathVariable Long assessmentId) {

        return ResponseEntity.ok(
                assessmentService.getQuestions(assessmentId));
    }

    // Create assessment
    @PostMapping
    public ResponseEntity<Assessment> createAssessment(
            @RequestBody Assessment assessment) {

        Assessment created =
                assessmentService.createAssessment(assessment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(created);
    }

    // Update assessment
    @PutMapping("/{id}")
    public ResponseEntity<Assessment> updateAssessment(
            @PathVariable Long id,
            @RequestBody Assessment assessment) {

        return ResponseEntity.ok(
                assessmentService.updateAssessment(id, assessment));
    }

    // Submit assessment and save the result
    @PostMapping("/submit")
    public ResponseEntity<AssessmentResult> submitAssessment(
            @RequestBody AssessmentSubmissionRequest request) {

        AssessmentResult result =
                assessmentService.submitAssessment(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(result);
    }

    // Get a student's assessment history
    @GetMapping("/results/student/{studentId}")
    public ResponseEntity<List<AssessmentResult>> getResultsByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                assessmentService.getResultsByStudent(studentId));
    }

    // Delete assessment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(
            @PathVariable Long id) {

        assessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }

}