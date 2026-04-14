package com.eduflow.eduflow.controller;

import com.eduflow.eduflow.dto.TeacherDTO;
import com.eduflow.eduflow.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping
    public ResponseEntity<?> add(@RequestBody TeacherDTO dto) {
        return ResponseEntity.ok(teacherService.addTeacher(dto));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }
}