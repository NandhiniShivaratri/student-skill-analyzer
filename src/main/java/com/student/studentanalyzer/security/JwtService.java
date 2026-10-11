package com.student.studentanalyzer.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final String secretKey =
            "studentSkillAnalyzerSecretKeyForJwtAuthentication2026";

    private final SecretKey key =
            Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

    // Generate JWT token
    public String generateToken(String email) {

        Date currentDate = new Date();

        Date expirationDate =
                new Date(currentDate.getTime() + 1000 * 60 * 60);

        return Jwts.builder()
                .subject(email)
                .issuedAt(currentDate)
                .expiration(expirationDate)
                .signWith(key)
                .compact();
    }

    // Get email from JWT token
    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}