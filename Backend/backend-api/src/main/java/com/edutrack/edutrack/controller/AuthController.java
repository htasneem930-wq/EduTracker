package com.edutrack.edutrack.controller;

import com.edutrack.edutrack.model.Users;
import com.edutrack.edutrack.model.Student;
import com.edutrack.edutrack.repository.UserRepository;
import com.edutrack.edutrack.repository.StudentRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ✅ SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Users req) {

        Optional<Users> existingUser = userRepository.findByEmail(req.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User already exists"));
        }

        // Encode password
        req.setPassword(passwordEncoder.encode(req.getPassword()));

        // 🔥 MAIN LOGIC (VERY IMPORTANT)
        if (req.getRole().equals(Users.Role.STUDENT)) {

            Optional<Student> existingStudent = studentRepository.findByEmail(req.getEmail());

            if (existingStudent.isPresent()) {
                req.setStudentId(existingStudent.get().getId());
            } else {
                Student s = new Student();
                s.setName(req.getName());
                s.setEmail(req.getEmail());

                Student saved = studentRepository.save(s);
                req.setStudentId(saved.getId());
            }
        }

        Users savedUser = userRepository.save(req);
        
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("status", "success");
        res.put("id", savedUser.getId());
        res.put("email", savedUser.getEmail());
        res.put("name", savedUser.getName());
        res.put("role", savedUser.getRole());
        res.put("studentId", savedUser.getStudentId());
        
        return ResponseEntity.ok(res);
    }

    // ✅ SIGNIN (Using Spring Security Authentication)
    @PostMapping("/signin")
    public ResponseEntity<?> signin(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid credentials"));
        }

        Optional<Users> userOpt = userRepository.findByEmail(principal.getName());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "User not found"));
        }

        Users user = userOpt.get();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("status", "success");
        res.put("role", user.getRole());
        res.put("name", user.getName());
        res.put("email", user.getEmail());
        res.put("studentId", user.getStudentId());
        res.put("id", user.getId());

        return ResponseEntity.ok(res);
    }

    // ✅ GET ALL USERS
    @GetMapping("/users")
    public List<Users> getUsers() {
        return userRepository.findAll();
    }

    // ✅ DELETE USER
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Integer id) {
        userRepository.deleteById(id);
        return "User deleted";
    }
}