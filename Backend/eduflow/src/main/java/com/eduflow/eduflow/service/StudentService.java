package com.eduflow.eduflow.service;

import com.eduflow.eduflow.dto.StudentDTO;
import com.eduflow.eduflow.model.Student;
import com.eduflow.eduflow.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // CREATE
    public Student addStudent(StudentDTO dto) {
        Student student = new Student();
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setUserId(dto.getUserId());
        if (dto.getCourseName() != null) {
            student.setCourse(dto.getCourseName());
        }
        return studentRepository.save(student);
    }

    // GET ALL
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // GET BY ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // UPDATE ✅ (FIXED)
    public Student updateStudent(Long id, StudentDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        if (dto.getUserId() != null) {
            student.setUserId(dto.getUserId());
        }
        if (dto.getCourseName() != null) {
            student.setCourse(dto.getCourseName());
        }

        return studentRepository.save(student);
    }

    // DELETE
    public String deleteStudent(Long id) {
        studentRepository.deleteById(id);
        return "Student deleted successfully";
    }

    // SEARCH
    public List<Student> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }
}
