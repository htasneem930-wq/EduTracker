package com.edutrack.edutrack.controller;

import com.edutrack.edutrack.dto.OtpRequest;
import com.edutrack.edutrack.dto.ResetPasswordRequest;
import com.edutrack.edutrack.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    @Autowired private AuthService authService;

    @PostMapping("/forgot-password")
    public Map<String, String> requestOtp(@RequestBody OtpRequest request) {
        authService.generateAndSendOtp(request.email());
        return Map.of("message", "OTP sent to your email!");
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean success = authService.resetPassword(request.email(), request.otp(), request.password());
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", success);
        if (!success) resp.put("message", "Invalid OTP or User not found");
        return resp;
    }
}