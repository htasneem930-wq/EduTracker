package com.eduflow.eduflow.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduflow.eduflow.model.Otp;
import com.eduflow.eduflow.model.OtpEntity;
import com.eduflow.eduflow.repository.OtpRepository;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    public String generateOtp(String email) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        OtpEntity entity = new OtpEntity();
        entity.setEmail(email);
        entity.setOtp(otp);

        otpRepository.save(entity);

        System.out.println("Generated OTP: " + otp);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {

        Otp entity = otpRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        return entity.getOtp().equals(otp);
    }
}