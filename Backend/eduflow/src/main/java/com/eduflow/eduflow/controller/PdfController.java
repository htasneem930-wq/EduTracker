package com.eduflow.eduflow.controller;


import com.eduflow.eduflow.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @Autowired private PdfService pdfService;

    @GetMapping("/marksheet/{studentId}")
    public ResponseEntity<byte[]> getMarksheet(@PathVariable Long studentId) throws Exception {
        byte[] pdf = pdfService.generateMarksheet(studentId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
            .attachment().filename("marksheet_" + studentId + ".pdf").build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @GetMapping("/attendance/{studentId}")
    public ResponseEntity<byte[]> getAttendance(@PathVariable Long studentId) throws Exception {
        byte[] pdf = pdfService.generateAttendancePdf(studentId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
            .attachment().filename("attendance_" + studentId + ".pdf").build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @GetMapping("/marksheet/all")
    public ResponseEntity<byte[]> getAllMarksReport() throws Exception {
        byte[] pdf = pdfService.generateAllMarksReport();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
            .attachment().filename("all_students_marks.pdf").build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @GetMapping("/attendance/all")
    public ResponseEntity<byte[]> getAllAttendanceReport() throws Exception {
        byte[] pdf = pdfService.generateAllAttendanceReport();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
            .attachment().filename("all_students_attendance.pdf").build());
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}
