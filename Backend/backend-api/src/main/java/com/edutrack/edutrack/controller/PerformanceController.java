package com.edutrack.edutrack.controller;

import com.edutrack.edutrack.dto.SubjectAverageDTO;
import com.edutrack.edutrack.model.Performance;
import com.edutrack.edutrack.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @GetMapping("/performance/{studentId}")
    public List<Performance> get(@PathVariable int studentId) {
        return performanceService.getByStudentId(studentId);
    }

    @GetMapping("/performance")
    public List<Performance> getAll() {
        return performanceService.getAll();
    }

    @GetMapping("/performance/stats/averages")
    public List<SubjectAverageDTO> getSubjectAverages() {
        return performanceService.getSubjectAverages();
    }

    @PostMapping("/performance/add")
    public Performance add(@RequestBody @NonNull Performance p) {
        return performanceService.add(p);
    }

    @DeleteMapping("/performance/{id}")
    public void delete(@PathVariable int id) {
        performanceService.delete(id);
    }
}