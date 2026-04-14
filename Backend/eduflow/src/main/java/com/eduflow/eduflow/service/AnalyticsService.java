package com.eduflow.eduflow.service;

import com.eduflow.eduflow.dto.AnalyticsDTO;
import com.eduflow.eduflow.model.Attendance;
import com.eduflow.eduflow.model.Marks;
import com.eduflow.eduflow.model.Student;
import com.eduflow.eduflow.repository.AttendanceRepository;
import com.eduflow.eduflow.repository.MarksRepository;
import com.eduflow.eduflow.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    public long totalStudents() {
        return studentRepository.count();
    }

    public long totalAttendance() {
        return attendanceRepository.count();
    }

    public AnalyticsDTO getStudentAnalytics(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);

        if (student == null) {
            AnalyticsDTO emptyDto = new AnalyticsDTO();
            emptyDto.setStudentId(studentId);
            emptyDto.setStudentName("Unknown");
            emptyDto.setAttendancePercentage(0.0);
            emptyDto.setAverageMarks(0.0);
            emptyDto.setPerformanceStatus("No Data");
            emptyDto.setSubjectMarks(new HashMap<>());
            emptyDto.setTotalPresent(0);
            emptyDto.setTotalAbsent(0);
            emptyDto.setTotalClasses(0);
            return emptyDto;
        }

        List<Attendance> attendanceList = attendanceRepository.findByStudentId(studentId);
        long present = attendanceList.stream()
                .filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()))
                .count();
        long absent = attendanceList.stream()
                .filter(a -> "ABSENT".equalsIgnoreCase(a.getStatus()))
                .count();
        long totalClasses = present + absent;
        double attendancePercentage = totalClasses == 0 ? 0.0 : (present * 100.0) / totalClasses;

        List<Marks> marksList = marksRepository.findByStudentId(studentId);
        Map<String, Integer> subjectMarks = new HashMap<>();
        double totalPercentage = 0.0;
        int count = 0;

        for (Marks m : marksList) {
            if (m.getTotalMarks() > 0) {
                int score = (int) Math.round((m.getMarksObtained() * 100.0) / m.getTotalMarks());
                subjectMarks.put(m.getSubject(), score);
                totalPercentage += score;
                count++;
            }
        }

        double averageMarks = count == 0 ? 0.0 : totalPercentage / count;
        String performanceStatus;
        if (averageMarks >= 80 && attendancePercentage >= 80) {
            performanceStatus = "Excellent";
        } else if (averageMarks >= 60) {
            performanceStatus = "Good";
        } else if (averageMarks > 0) {
            performanceStatus = "Needs Improvement";
        } else {
            performanceStatus = "No Data";
        }

        AnalyticsDTO dto = new AnalyticsDTO();
        dto.setStudentId(student.getId());
        dto.setStudentName(student.getName());
        dto.setAttendancePercentage(attendancePercentage);
        dto.setAverageMarks(averageMarks);
        dto.setPerformanceStatus(performanceStatus);
        dto.setSubjectMarks(subjectMarks);
        dto.setTotalPresent((int) present);
        dto.setTotalAbsent((int) absent);
        dto.setTotalClasses((int) totalClasses);

        return dto;
    }
}
