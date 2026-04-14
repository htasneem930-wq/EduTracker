package com.eduflow.eduflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("EduFlow - Your OTP Verification Code");
        message.setText(
            "Hello,\n\n" +
            "Your OTP for EduFlow is: " + otp + "\n\n" +
            "This OTP is valid for 5 minutes.\n" +
            "Do not share this OTP with anyone.\n\n" +
            "- EduFlow Team"
        );
        mailSender.send(message);
    }
}