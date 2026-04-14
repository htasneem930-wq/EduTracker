package com.edutrack.edutrack.service;

import com.edutrack.edutrack.model.OtpVerification;
import com.edutrack.edutrack.model.Users;
import com.edutrack.edutrack.repository.OtpRepository;
import com.edutrack.edutrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    @Autowired private UserRepository userRepo;
    @Autowired private OtpRepository otpRepo;
    @Autowired private EmailService emailService;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        OtpVerification otpEntity = new OtpVerification();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepo.save(otpEntity);
        emailService.sendOtpEmail(email, otp);
    }

    public boolean resetPassword(String email, String otp, String newPassword) {
        Optional<OtpVerification> otpCheck = otpRepo.findByEmailAndOtp(email, otp);
        if (otpCheck.isPresent() && otpCheck.get().getExpiryTime().isAfter(LocalDateTime.now())) {
            return userRepo.findByEmail(email).map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepo.save(user);
                otpRepo.delete(otpCheck.get());
                return true;
            }).orElse(false);
        }
        return false;
    }
}