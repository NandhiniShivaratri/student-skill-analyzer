package com.student.studentanalyzer.controller;

import com.student.studentanalyzer.entity.LearningRoadmap;
import com.student.studentanalyzer.service.RoadmapService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
@CrossOrigin(origins = "*")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @GetMapping
    public ResponseEntity<List<LearningRoadmap>> getAllRoadmaps() {
        return ResponseEntity.ok(roadmapService.getAllRoadmaps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningRoadmap> getRoadmapById(
            @PathVariable Long id) {
        return ResponseEntity.ok(roadmapService.getRoadmapById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<LearningRoadmap>> getRoadmapsByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(
                roadmapService.getRoadmapsByStudent(studentId));
    }

    @PostMapping
    public ResponseEntity<LearningRoadmap> createRoadmap(
            @RequestBody LearningRoadmap roadmap) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roadmapService.createRoadmap(roadmap));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningRoadmap> updateRoadmap(
            @PathVariable Long id,
            @RequestBody LearningRoadmap roadmap) {
        return ResponseEntity.ok(
                roadmapService.updateRoadmap(id, roadmap));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadmap(
            @PathVariable Long id) {
        roadmapService.deleteRoadmap(id);
        return ResponseEntity.noContent().build();
    }
}