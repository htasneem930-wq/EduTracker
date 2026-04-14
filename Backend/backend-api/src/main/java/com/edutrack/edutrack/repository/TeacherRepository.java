package com.edutrack.edutrack.repository;

import com.edutrack.edutrack.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
}