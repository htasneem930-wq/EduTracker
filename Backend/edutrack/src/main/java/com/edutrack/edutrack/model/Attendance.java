package com.edutrack.edutrack.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int studentId;
    private LocalDate date;
    private boolean present;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }
}