package com.eduflow.eduflow.service;

import com.eduflow.eduflow.model.*;
import com.eduflow.eduflow.repository.*;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private MarksRepository marksRepository;

    // ===================== MARKSHEET PDF =====================
    public byte[] generateMarksheet(Long studentId) throws Exception {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Marks> marksList = marksRepository.findByStudentId(studentId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();

        PdfWriter.getInstance(document, baos);
        document.open();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("EduFlow - Student Marksheet", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        // Student Details
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        document.add(new Paragraph("Name: " + student.getName(), boldFont));
        document.add(new Paragraph("Email: " + student.getEmail(), normalFont));
        if (student.getCourse() != null) {
            document.add(new Paragraph("Course: " + student.getCourse(), normalFont));
        }

        document.add(new Paragraph(" "));

        // Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        String[] headers = {"Subject", "Marks", "Total", "Percentage"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
            cell.setBackgroundColor(new java.awt.Color(107, 33, 168));
            cell.getPhrase().getFont().setColor(new java.awt.Color(255, 255, 255));
            table.addCell(cell);
        }

        double totalPercentage = 0;

        for (Marks m : marksList) {

            double percentage = (m.getMarksObtained() * 100.0) / m.getTotalMarks();
            totalPercentage += percentage;

            table.addCell(new Phrase(m.getSubject(), normalFont));
            table.addCell(new Phrase(String.valueOf(m.getMarksObtained()), normalFont));
            table.addCell(new Phrase(String.valueOf(m.getTotalMarks()), normalFont));
            table.addCell(new Phrase(String.format("%.1f%%", percentage), normalFont));
        }

        document.add(table);
        document.add(new Paragraph(" "));

        double avg = marksList.isEmpty() ? 0 : totalPercentage / marksList.size();

        document.add(new Paragraph("Average: " + String.format("%.1f%%", avg), boldFont));

        String performance;
        if (avg >= 75) performance = "Good";
        else if (avg >= 50) performance = "Average";
        else performance = "Poor";

        document.add(new Paragraph("Performance: " + performance, boldFont));

        document.close();

        return baos.toByteArray();
    }

    // ===================== ATTENDANCE PDF =====================
    public byte[] generateAttendancePdf(Long studentId) throws Exception {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Attendance> attendanceList = attendanceRepository.findByStudentId(studentId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();

        PdfWriter.getInstance(document, baos);
        document.open();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("EduFlow - Attendance Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        // Student Info
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        document.add(new Paragraph("Name: " + student.getName(), boldFont));
        document.add(new Paragraph("Email: " + student.getEmail(), normalFont));

        document.add(new Paragraph(" "));

        // Table
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);

        String[] headers = {"Date", "Subject", "Status"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
            cell.setBackgroundColor(new java.awt.Color(107, 33, 168));
            cell.getPhrase().getFont().setColor(new java.awt.Color(255, 255, 255));
            table.addCell(cell);
        }

        long presentCount = 0;

        for (Attendance a : attendanceList) {

            if ("PRESENT".equalsIgnoreCase(a.getStatus())) {
                presentCount++;
            }

            table.addCell(new Phrase(a.getDate().toString(), normalFont));
            table.addCell(new Phrase(a.getSubject(), normalFont));
            table.addCell(new Phrase(a.getStatus(), normalFont));
        }

        document.add(table);
        document.add(new Paragraph(" "));

        double percentage = attendanceList.isEmpty() ? 0 :
                (presentCount * 100.0) / attendanceList.size();

        document.add(new Paragraph("Attendance: " + String.format("%.1f%%", percentage), boldFont));

        document.close();

        return baos.toByteArray();
    }

    // ===================== ALL STUDENTS MARKS REPORT =====================
    public byte[] generateAllMarksReport() throws Exception {

        List<Marks> marksList = marksRepository.findAll();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();

        PdfWriter.getInstance(document, baos);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("EduFlow - All Students Marks Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);

        String[] headers = {"Student", "Email", "Subject", "Marks", "Total", "Percentage"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
            cell.setBackgroundColor(new java.awt.Color(37, 99, 235));
            cell.getPhrase().getFont().setColor(new java.awt.Color(255, 255, 255));
            table.addCell(cell);
        }

        for (Marks m : marksList) {
            Student s = m.getStudent();
            double percentage = (m.getMarksObtained() * 100.0) / m.getTotalMarks();

            table.addCell(new Phrase(s != null ? s.getName() : "-", normalFont));
            table.addCell(new Phrase(s != null ? s.getEmail() : "-", normalFont));
            table.addCell(new Phrase(m.getSubject(), normalFont));
            table.addCell(new Phrase(String.valueOf(m.getMarksObtained()), normalFont));
            table.addCell(new Phrase(String.valueOf(m.getTotalMarks()), normalFont));
            table.addCell(new Phrase(String.format("%.1f%%", percentage), normalFont));
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }

    // ===================== ALL STUDENTS ATTENDANCE REPORT =====================
    public byte[] generateAllAttendanceReport() throws Exception {

        List<Attendance> attendanceList = attendanceRepository.findAll();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();

        PdfWriter.getInstance(document, baos);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("EduFlow - All Students Attendance Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));

        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        String[] headers = {"Student", "Date", "Subject", "Status"};

        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, boldFont));
            cell.setBackgroundColor(new java.awt.Color(37, 99, 235));
            cell.getPhrase().getFont().setColor(new java.awt.Color(255, 255, 255));
            table.addCell(cell);
        }

        for (Attendance a : attendanceList) {
            Student s = a.getStudent();

            table.addCell(new Phrase(s != null ? s.getName() : "-", normalFont));
            table.addCell(new Phrase(a.getDate() != null ? a.getDate().toString() : "-", normalFont));
            table.addCell(new Phrase(a.getSubject(), normalFont));
            table.addCell(new Phrase(a.getStatus(), normalFont));
        }

        document.add(table);
        document.close();

        return baos.toByteArray();
    }
}
