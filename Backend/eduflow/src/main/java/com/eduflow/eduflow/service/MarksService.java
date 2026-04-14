package com.eduflow.eduflow.service;

import com.eduflow.eduflow.dto.MarksDTO;
import com.eduflow.eduflow.model.Marks;
import com.eduflow.eduflow.model.Student;
import com.eduflow.eduflow.repository.MarksRepository;
import com.eduflow.eduflow.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    public MarksDTO addMarks(MarksDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Marks m = new Marks();
        m.setStudent(student);
        m.setSubject(dto.getSubject());
        m.setMarksObtained(dto.getMarksObtained());
        m.setTotalMarks(dto.getTotalMarks());
        m.setExamType(dto.getExamType());
        m.setSemester(dto.getSemester());

        marksRepository.save(m);

        return convertToDTO(m);
    }

    public List<MarksDTO> getAllMarks() {
        return marksRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MarksDTO> getMarksByStudent(Long studentId) {
        return marksRepository.findByStudentId(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MarksDTO convertToDTO(Marks m) {
        MarksDTO dto = new MarksDTO();
        dto.setId(m.getId());
        dto.setStudentId(m.getStudent().getId());
        dto.setStudentName(m.getStudent().getName());
        dto.setSubject(m.getSubject());
        dto.setMarksObtained(m.getMarksObtained());
        dto.setTotalMarks(m.getTotalMarks());
        dto.setExamType(m.getExamType());
        dto.setSemester(m.getSemester());
        return dto;
    }
}
