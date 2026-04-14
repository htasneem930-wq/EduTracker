package com.eduflow.eduflow.controller;

import com.eduflow.eduflow.dto.MarksDTO;
import com.eduflow.eduflow.service.MarksService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @PostMapping
    public MarksDTO add(@RequestBody MarksDTO dto) {
        return marksService.addMarks(dto);
    }

    @GetMapping("/student/{studentId}")
    public List<MarksDTO> getByStudent(@PathVariable Long studentId) {
        return marksService.getMarksByStudent(studentId);
    }

    @GetMapping
    public List<MarksDTO> getAll() {
        return marksService.getAllMarks();
    }
}
