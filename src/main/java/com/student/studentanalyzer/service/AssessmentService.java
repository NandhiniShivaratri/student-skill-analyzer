package com.student.studentanalyzer.service;

import com.student.studentanalyzer.AssessmentSubmissionRequest;
import com.student.studentanalyzer.dto.AssessmentQuestionResponse;
import com.student.studentanalyzer.entity.Assessment;
import com.student.studentanalyzer.entity.AssessmentQuestion;
import com.student.studentanalyzer.entity.AssessmentResult;
import com.student.studentanalyzer.repository.AssessmentQuestionRepository;
import com.student.studentanalyzer.repository.AssessmentRepository;
import com.student.studentanalyzer.repository.AssessmentResultRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentResultRepository assessmentResultRepository;
    private final AssessmentQuestionRepository assessmentQuestionRepository;
    private final CertificateIssuanceService certificateIssuanceService;

    public AssessmentService(
            AssessmentRepository assessmentRepository,
            AssessmentResultRepository assessmentResultRepository,
            AssessmentQuestionRepository assessmentQuestionRepository,
            CertificateIssuanceService certificateIssuanceService) {

        this.assessmentRepository = assessmentRepository;
        this.assessmentResultRepository = assessmentResultRepository;
        this.assessmentQuestionRepository = assessmentQuestionRepository;
        this.certificateIssuanceService = certificateIssuanceService;
    }

    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Assessment not found: " + id));
    }

    public List<Assessment> getAssessmentsBySkill(Long skillId) {
        return assessmentRepository.findBySkillId(skillId);
    }

    public Assessment createAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    public Assessment updateAssessment(Long id, Assessment updatedAssessment) {
        Assessment existing = getAssessmentById(id);

        existing.setTitle(updatedAssessment.getTitle());
        existing.setDescription(updatedAssessment.getDescription());
        existing.setSkillId(updatedAssessment.getSkillId());
        existing.setTotalQuestions(updatedAssessment.getTotalQuestions());
        existing.setPassingScore(updatedAssessment.getPassingScore());

        return assessmentRepository.save(existing);
    }

    public List<AssessmentQuestionResponse> getQuestions(Long assessmentId) {
        getAssessmentById(assessmentId);

        return assessmentQuestionRepository
                .findByAssessmentId(assessmentId)
                .stream()
                .map(AssessmentQuestionResponse::new)
                .toList();
    }

    @Transactional
    public AssessmentResult submitAssessment(
            AssessmentSubmissionRequest request) {

        if (request == null
                || request.getStudentId() == null
                || request.getAssessmentId() == null
                || request.getAnswers() == null) {

            throw new IllegalArgumentException(
                    "Student ID, assessment ID and answers are required");
        }

        Assessment assessment =
                getAssessmentById(request.getAssessmentId());

        List<AssessmentQuestion> questions =
                assessmentQuestionRepository.findByAssessmentId(
                        request.getAssessmentId());

        if (questions.isEmpty()) {
            throw new IllegalArgumentException(
                    "This assessment has no questions");
        }

        Map<Long, String> answers = request.getAnswers();
        int correctAnswers = 0;

        for (AssessmentQuestion question : questions) {
            String selectedAnswer = answers.get(question.getId());

            if (selectedAnswer != null
                    && question.getCorrectOption() != null
                    && selectedAnswer.trim().equalsIgnoreCase(
                    question.getCorrectOption().trim())) {
                correctAnswers++;
            }
        }

        double percentage =
                (correctAnswers * 100.0) / questions.size();

        AssessmentResult result = new AssessmentResult();
        result.setStudentId(request.getStudentId());
        result.setAssessmentId(request.getAssessmentId());
        result.setScore(correctAnswers);
        result.setTotalQuestions(questions.size());
        result.setPercentage(
                Math.round(percentage * 100.0) / 100.0);

        int passingScore = assessment.getPassingScore() == null
                ? 50
                : assessment.getPassingScore();

        result.setResultStatus(
                percentage >= passingScore ? "PASS" : "FAIL");

        AssessmentResult savedResult =
                assessmentResultRepository.save(result);


        return savedResult;
    }

    public List<AssessmentResult> getResultsByStudent(Long studentId) {
        return assessmentResultRepository.findByStudentId(studentId);
    }

    @Transactional
    public void deleteAssessment(Long id) {
        Assessment assessment = getAssessmentById(id);
        assessmentRepository.delete(assessment);
    }
}