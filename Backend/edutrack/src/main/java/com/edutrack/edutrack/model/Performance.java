package com.edutrack.edutrack.model;

import jakarta.persistence.*;

@Entity
@Table(name = "performance")
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer studentId;
    
    @Column(nullable = false)
    private String subject;
    
    @Column(nullable = false)
    private Integer marks;

    public Performance() {}

    public Performance(Integer studentId, String subject, Integer marks) {
        this.studentId = studentId;
        this.subject = subject;
        this.marks = marks;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getStudentId() { return studentId; }
    public void setStudentId(Integer studentId) { this.studentId = studentId; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }
}