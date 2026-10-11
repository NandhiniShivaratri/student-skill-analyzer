package com.student.studentanalyzer.controller;

import com.student.studentanalyzer.dto.LoginRequest;
import com.student.studentanalyzer.dto.LoginResponse;
import com.student.studentanalyzer.entity.Student;
import com.student.studentanalyzer.security.JwtService;
import com.student.studentanalyzer.service.StudentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;
    private final JwtService jwtService;

    public StudentController(StudentService studentService,
                             JwtService jwtService) {

        this.studentService = studentService;
        this.jwtService = jwtService;
    }

    // Register student
    @PostMapping
    public Student addStudent(@Valid @RequestBody Student student) {

        return studentService.addStudent(student);
    }

    // Get all students
    @GetMapping
    public List<Student> getAllStudents() {

        return studentService.getAllStudents();
    }

    // Get student by ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {

        return studentService.getStudentById(id);
    }

    // Delete student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {

        studentService.deleteStudent(id);

        return "Student deleted successfully";
    }

    // Login student
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginStudent(
            @RequestBody LoginRequest loginRequest) {

        Student student = studentService.loginStudent(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        // Invalid login
        if (student == null) {

            LoginResponse response = new LoginResponse(
                    "Invalid email or password",
                    null,
                    null,
                    null,
                    null
            );

            return new ResponseEntity<>(
                    response,
                    HttpStatus.UNAUTHORIZED
            );
        }

        // Generate JWT token
        String token =
                jwtService.generateToken(student.getEmail());

        LoginResponse response = new LoginResponse(
                "Login successful",
                token,
                student.getId(),
                student.getName(),
                student.getEmail()
        );

        return new ResponseEntity<>(
                response,
                HttpStatus.OK
        );
    }
}