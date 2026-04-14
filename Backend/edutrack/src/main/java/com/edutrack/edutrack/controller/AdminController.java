package com.edutrack.edutrack.controller;

import com.edutrack.edutrack.dto.AdminStatsDTO;
import com.edutrack.edutrack.dto.UserResponseDTO;
import com.edutrack.edutrack.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsDTO getOverallStats() {
        return adminService.getOverallStats();
    }

    @GetMapping("/users/all")
    public List<UserResponseDTO> getAllUsers() {
        return adminService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public Map<String, Boolean> deleteUser(@PathVariable int id) {
        adminService.deleteUser(id);
        return Map.of("success", true);
    }
}