package com.student.studentanalyzer.service;

import com.student.studentanalyzer.entity.Student;
import com.student.studentanalyzer.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register student
    public Student addStudent(Student student) {

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        student.setPassword(
                passwordEncoder.encode(student.getPassword())
        );

        return studentRepository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    // Delete student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // Login student
    public Student loginStudent(String email, String password) {

        Student student =
                studentRepository.findByEmail(email).orElse(null);

        if (student != null &&
                passwordEncoder.matches(
                        password,
                        student.getPassword())) {

            return student;
        }

        return null;
    }
}