package com.edutrack.edutrack.controller;

import com.edutrack.edutrack.model.Attendance;
import com.edutrack.edutrack.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AttendanceController {

    @Autowired
    private AttendanceRepository repo;

    @GetMapping("/attendance/{studentId}")
    public List<Attendance> get(@PathVariable int studentId) {
        return repo.findByStudentId(studentId);
    }

    @GetMapping("/attendance")
    public List<Attendance> getAll() {
        return repo.findAll();
    }

    @PostMapping("/attendance/add")
    public Attendance add(@RequestBody @NonNull Attendance a) {
        return repo.save(a);
    }

    @DeleteMapping("/attendance/{id}")
    public void delete(@PathVariable int id) {
        repo.deleteById(id);
    }
}