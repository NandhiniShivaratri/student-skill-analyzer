package com.student.studentanalyzer.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CertificateIssuanceService {

    private final SkillCertificateService skillCertificateService;

    public CertificateIssuanceService(
            SkillCertificateService skillCertificateService) {
        this.skillCertificateService = skillCertificateService;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void issueIfEligible(Long studentId, Long skillId) {
        if (skillId == null) {
            return;
        }

        try {
            skillCertificateService.issueCertificate(studentId, skillId);
        } catch (IllegalArgumentException exception) {
            // Assessment remains valid if certificate requirements are not met.
            System.out.println(
                    "Certificate not issued: " + exception.getMessage());
        }
    }
}