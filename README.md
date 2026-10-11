# Student Skill Gap Analyzer

A full-stack application that helps students evaluate their technical
skills, identify skill gaps, and organize personalized learning roadmaps.

## Technology Stack

### Frontend
- React

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- BCrypt Password Encryption

### Database
- MySQL

## Features

- Student registration and login
- JWT-based authentication
- Secure password storage
- Technical skills management
- Student skill-level tracking
- Skill assessments
- Assessment result calculation
- Learning roadmap management
- REST API integration

## Backend Setup

1. Install Java and MySQL.
2. Open the project in IntelliJ IDEA.
3. Configure the MySQL connection.
4. Create the database named `student_skill_analyzer`.
5. Configure the database environment variables.
6. Load the Maven dependencies.
7. Run StudentSkillAnalyzerBackendApplication.

## API Base URL

http://localhost:8080/api

## Main Endpoints

- POST /students
- POST /students/login
- GET /students
- GET /skills
- POST /skills
- GET /assessments
- POST /assessments
- POST /assessments/results
- GET /roadmaps
- POST /roadmaps

Protected endpoints require a valid JWT token.

## Important

Configure database credentials and a strong JWT secret through
environment variables before deploying the application.