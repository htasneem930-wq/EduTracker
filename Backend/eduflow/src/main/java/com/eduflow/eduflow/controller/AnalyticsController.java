package com.eduflow.eduflow.controller;

import com.eduflow.eduflow.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/students")
    public ResponseEntity<?> totalStudents() {
        return ResponseEntity.ok(analyticsService.totalStudents());
    }

    @GetMapping("/attendance")
    public ResponseEntity<?> totalAttendance() {
        return ResponseEntity.ok(analyticsService.totalAttendance());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentAnalytics(@PathVariable Long studentId) {
        return ResponseEntity.ok(analyticsService.getStudentAnalytics(studentId));
    }
}
