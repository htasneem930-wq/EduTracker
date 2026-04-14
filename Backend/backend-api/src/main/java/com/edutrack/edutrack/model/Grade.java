package com.edutrack.edutrack.model;

import jakarta.persistence.*;

@Entity
public class Grade {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int studentId;
    private String subject;
    private int marksObtained;
    private int totalMarks;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public int getMarksObtained() { return marksObtained; }
    public void setMarksObtained(int marksObtained) { this.marksObtained = marksObtained; }
    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }
}