package com.eduflow.eduflow.repository;

import com.eduflow.eduflow.model.Otp;
import com.eduflow.eduflow.model.OtpEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmail(String email);

	void save(OtpEntity entity);
}