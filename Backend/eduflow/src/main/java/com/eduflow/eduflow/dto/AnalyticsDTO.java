package com.eduflow.eduflow.dto;

import java.util.Map;

public class AnalyticsDTO {

    private Long studentId;
    private String studentName;
    private double attendancePercentage;
    private double averageMarks;
    private String performanceStatus;
    private Map<String, Integer> subjectMarks;
    private int totalPresent;
    private int totalAbsent;
    private int totalClasses;

    // GETTERS + SETTERS

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public double getAverageMarks() { return averageMarks; }
    public void setAverageMarks(double averageMarks) { this.averageMarks = averageMarks; }

    public String getPerformanceStatus() { return performanceStatus; }
    public void setPerformanceStatus(String performanceStatus) { this.performanceStatus = performanceStatus; }

    public Map<String, Integer> getSubjectMarks() { return subjectMarks; }
    public void setSubjectMarks(Map<String, Integer> subjectMarks) { this.subjectMarks = subjectMarks; }

    public int getTotalPresent() { return totalPresent; }
    public void setTotalPresent(int totalPresent) { this.totalPresent = totalPresent; }

    public int getTotalAbsent() { return totalAbsent; }
    public void setTotalAbsent(int totalAbsent) { this.totalAbsent = totalAbsent; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }
}
