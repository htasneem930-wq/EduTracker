package com.edutrack.edutrack.repository;

import com.edutrack.edutrack.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByEmailAndOtp(String email, String otp);
}