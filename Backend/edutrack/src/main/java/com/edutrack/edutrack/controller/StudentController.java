package com.edutrack.edutrack.controller;

import com.edutrack.edutrack.model.Student;
import com.edutrack.edutrack.model.Users;
import com.edutrack.edutrack.repository.StudentRepository;
import com.edutrack.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class StudentController {

    @Autowired private StudentRepository studentRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/students")
    public List<Student> getAll() {
        return studentRepo.findAll();
    }

    @GetMapping("/students/{id}")
    public Student getOne(@PathVariable int id) {
        return studentRepo.findById(id).orElse(null);
    }

    // When teacher adds a student, this also creates their login account automatically
    @PostMapping("/students/add")
    public Map<String, Object> addStudent(@RequestBody Map<String, String> body) {
        Map<String, Object> resp = new HashMap<>();

        // 1. Save student record
        Student s = new Student();
        s.setName(body.get("name"));
        s.setCourse(body.get("course"));
        s.setEmail(body.get("email"));
        s.setPhone(body.get("phone"));
        Student saved = studentRepo.save(s);

        // 2. Create login account for this student
        // Default password = student123 (not customized yet)
        Users u = new Users();
        u.setEmail(body.get("email"));
        u.setPassword(passwordEncoder.encode("student123"));
        u.setName(body.get("name"));
        u.setRole(Users.Role.STUDENT);
        u.setStudentId(saved.getId());
        u.setPasswordCustomized(false); // Student should set their own password on first login
        userRepo.save(u);

        resp.put("success", true);
        resp.put("message", "Student added! They can login with their email and password: student123");
        resp.put("student", saved);
        return resp;
    }

    @DeleteMapping("/students/{id}")
    public Map<String, Object> delete(@PathVariable int id) {
        studentRepo.deleteById(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Student deleted");
        return resp;
    }
}