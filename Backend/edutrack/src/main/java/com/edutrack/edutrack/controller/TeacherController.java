package com.edutrack.edutrack.controller;

import com.edutrack.edutrack.model.Teacher;
import com.edutrack.edutrack.model.Users;
import com.edutrack.edutrack.repository.TeacherRepository;
import com.edutrack.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TeacherController {

    @Autowired private TeacherRepository teacherRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/teachers")
    public List<Teacher> getAll() {
        return teacherRepo.findAll();
    }

    // When admin adds a teacher, this also creates their login account
    @PostMapping("/teachers/add")
    public Map<String, Object> add(@RequestBody Map<String, String> body) {
        Map<String, Object> resp = new HashMap<>();

        Teacher t = new Teacher();
        t.setName(body.get("name"));
        t.setEmail(body.get("email"));
        t.setSubject(body.get("subject"));
        teacherRepo.save(t);

        Users u = new Users();
        u.setEmail(body.get("email"));
        u.setPassword(passwordEncoder.encode("teacher123"));
        u.setName(body.get("name"));
        u.setRole(Users.Role.TEACHER);
        userRepo.save(u);

        resp.put("success", true);
        resp.put("message", "Teacher added! Login password: teacher123");
        return resp;
    }

    @DeleteMapping("/teachers/{id}")
    public Map<String, Object> delete(@PathVariable int id) {
        teacherRepo.deleteById(id);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        return resp;
    }
}