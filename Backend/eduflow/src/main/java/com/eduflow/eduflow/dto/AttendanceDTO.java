package com.eduflow.eduflow.dto;

import java.time.LocalDate;

public class AttendanceDTO {

    private Long studentId;
    private String studentName;
    private LocalDate date;   // ✅ MUST be LocalDate
    private String status;
    private String subject;

    // getters & setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}