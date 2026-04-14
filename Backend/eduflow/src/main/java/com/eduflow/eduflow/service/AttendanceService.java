package com.eduflow.eduflow.service;

import com.eduflow.eduflow.dto.AttendanceDTO;
import com.eduflow.eduflow.dto.AttendanceStatsDTO;
import com.eduflow.eduflow.model.Attendance;
import com.eduflow.eduflow.model.Student;
import com.eduflow.eduflow.repository.AttendanceRepository;
import com.eduflow.eduflow.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ ADD ATTENDANCE
    public Attendance markAttendance(AttendanceDTO dto) {

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Attendance a = new Attendance();
        a.setStudent(student);
        a.setDate(dto.getDate());
        a.setStatus(dto.getStatus());
        a.setSubject(dto.getSubject());

        return attendanceRepository.save(a);
    }

    // ✅ GET ALL
    public List<AttendanceDTO> getAllAttendance() {
        List<Attendance> list = attendanceRepository.findAll();
        List<AttendanceDTO> result = new ArrayList<>();

        for (Attendance a : list) {
            result.add(mapToDto(a));
        }

        return result;
    }

    // ✅ GET BY STUDENT
    public List<Attendance> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    // ✅ DELETE
    public String deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
        return "Deleted Successfully";
    }

    private AttendanceDTO mapToDto(Attendance a) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setStudentId(a.getStudent().getId());
        dto.setStudentName(a.getStudent().getName());
        dto.setDate(a.getDate());
        dto.setStatus(a.getStatus());
        dto.setSubject(a.getSubject());
        return dto;
    }

    public List<AttendanceDTO> getAttendanceWithFilters(LocalDate date, Integer month, Integer year, String courseName) {
        List<Attendance> all = attendanceRepository.findAll();
        List<AttendanceDTO> filtered = new ArrayList<>();

        for (Attendance a : all) {
            if (!matchesDateFilter(a, date, month, year)) continue;
            if (!matchesCourseFilter(a, courseName)) continue;
            filtered.add(mapToDto(a));
        }
        return filtered;
    }

    public AttendanceStatsDTO getAttendanceStats(LocalDate date, Integer month, Integer year, String courseName) {
        List<AttendanceDTO> filtered = getAttendanceWithFilters(date, month, year, courseName);

        long present = filtered.stream().filter(d -> "PRESENT".equalsIgnoreCase(d.getStatus())).count();
        long absent = filtered.stream().filter(d -> "ABSENT".equalsIgnoreCase(d.getStatus())).count();
        long total = present + absent;

        AttendanceStatsDTO stats = new AttendanceStatsDTO();
        stats.setPresentCount(present);
        stats.setAbsentCount(absent);
        stats.setTotalStudents(total);
        stats.setAttendancePercentage(total == 0 ? 0.0 : (present * 100.0) / total);
        return stats;
    }

    private boolean matchesDateFilter(Attendance a, LocalDate date, Integer month, Integer year) {
        LocalDate d = a.getDate();
        if (d == null) return false;

        if (date != null) {
            return d.equals(date);
        }

        if (month != null) {
            int y = (year != null) ? year : d.getYear();
            return d.getYear() == y && d.getMonthValue() == month;
        }

        if (year != null) {
            return d.getYear() == year;
        }

        return true;
    }

    private boolean matchesCourseFilter(Attendance a, String courseName) {
        if (courseName == null || courseName.isBlank()) return true;
        Student s = a.getStudent();
        if (s == null || s.getCourse() == null) return false;
        return s.getCourse().equalsIgnoreCase(courseName.trim());
    }
}
