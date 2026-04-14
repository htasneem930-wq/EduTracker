package com.edutrack.edutrack.repository;

import com.edutrack.edutrack.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Integer> {
    List<Performance> findByStudentId(int studentId);
}