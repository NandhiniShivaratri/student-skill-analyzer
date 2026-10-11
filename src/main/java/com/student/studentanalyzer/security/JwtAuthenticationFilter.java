package com.student.studentanalyzer.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Allow registration and login without JWT
        String path = request.getServletPath();

        if (path.equals("/api/students") &&
                request.getMethod().equalsIgnoreCase("POST")) {

            filterChain.doFilter(request, response);
            return;
        }

        if (path.equals("/api/students/login") &&
                request.getMethod().equalsIgnoreCase("POST")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Get Authorization header
        String authorizationHeader =
                request.getHeader("Authorization");

        // No JWT token
        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token =
                authorizationHeader.substring(7);

        try {

            // Extract email from token
            String email =
                    jwtService.extractEmail(token);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.emptyList()
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (Exception e) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType("application/json");

            response.getWriter().write(
                    "{\"message\":\"Invalid or expired JWT token\"}"
            );

            return;
        }

        filterChain.doFilter(request, response);
    }
}