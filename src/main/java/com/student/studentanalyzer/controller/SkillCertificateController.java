package com.student.studentanalyzer.controller;

import com.student.studentanalyzer.entity.SkillCertificate;
import com.student.studentanalyzer.service.SkillCertificateService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
public class SkillCertificateController {

    private final SkillCertificateService certificateService;

    public SkillCertificateController(
            SkillCertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // Issue a certificate when the student reaches the required level
    @PostMapping("/issue")
    public ResponseEntity<?> issueCertificate(
            @RequestBody CertificateRequest request) {

        try {
            SkillCertificate certificate =
                    certificateService.issueCertificate(
                            request.getStudentId(),
                            request.getSkillId()
                    );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(certificate);

        } catch (IllegalArgumentException exception) {

            Map<String, String> error = new HashMap<>();
            error.put("message", exception.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get all certificates belonging to a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SkillCertificate>> getStudentCertificates(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                certificateService.getCertificatesByStudent(studentId)
        );
    }

    // Get one certificate by its ID
    @GetMapping("/{certificateId}")
    public ResponseEntity<?> getCertificate(
            @PathVariable Long certificateId) {

        try {
            return ResponseEntity.ok(
                    certificateService.getCertificateById(certificateId)
            );

        } catch (IllegalArgumentException exception) {

            Map<String, String> error = new HashMap<>();
            error.put("message", exception.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(error);
        }
    }

    // Request body for certificate issuance
    public static class CertificateRequest {

        private Long studentId;
        private Long skillId;

        public CertificateRequest() {
        }

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public Long getSkillId() {
            return skillId;
        }

        public void setSkillId(Long skillId) {
            this.skillId = skillId;
        }
    }
}