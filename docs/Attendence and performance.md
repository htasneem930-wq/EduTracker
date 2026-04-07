
# 📘 Chapter 2 — Attendance & Performance Modules

After completing the **initial EduTrack setup**, the next step is to extend the system with **Attendance tracking** and **Student performance records**.

This allows the application to store and manage:

* Student **attendance history**
* Student **performance scores**
* Data linked to the **students table**

---

# Step 1 — Create New Tables in MySQL

Open **MySQL Workbench** and run the following queries.

### Attendance Table

```sql
CREATE TABLE attendance (
id INT AUTO_INCREMENT PRIMARY KEY,
student_id INT,
date DATE,
status VARCHAR(10),
FOREIGN KEY (student_id) REFERENCES students(id)
);
```

### Performance Table

```sql
CREATE TABLE performance (
id INT AUTO_INCREMENT PRIMARY KEY,
student_id INT,
subject VARCHAR(50),
marks INT,
FOREIGN KEY (student_id) REFERENCES students(id)
);
```

Now the database contains three tables:

```
students
attendance
performance
```

---

# Step 2 — Create Performance Module

Next we create the **Spring Boot components** for the performance system.

Navigate in Eclipse:

```
src/main/java
 → com.edutrack.edutrack
     → model
     → repository
     → controller
```

---

# Step 3 — Create Performance Model

Right click:

```
model → New → Class
```

Name:

```
Performance
```

### Performance.java

```java
package com.edutrack.edutrack.model;

import jakarta.persistence.*;

@Entity
@Table(name = "performance")
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "student_id")
    private int studentId;

    private int marks;

    private String subject;

    public int getId() {
        return id;
    }

    public int getStudentId() {
        return studentId;
    }

    public int getMarks() {
        return marks;
    }

    public String getSubject() {
        return subject;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public void setMarks(int marks) {
        this.marks = marks;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}
```

---

# Step 4 — Create Performance Repository

Right click:

```
repository → New → Interface
```

Name:

```
PerformanceRepository
```

### PerformanceRepository.java

```java
package com.edutrack.edutrack.repository;

import com.edutrack.edutrack.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance, Integer> {

    List<Performance> findByStudentId(int studentId);

}
```

---

# Step 5 — Create Performance Controller

Right click:

```
controller → New → Class
```

Name:

```
PerformanceController
```

### PerformanceController.java

```java
package com.edutrack.edutrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.edutrack.edutrack.model.Performance;
import com.edutrack.edutrack.repository.PerformanceRepository;

@RestController
@CrossOrigin
public class PerformanceController {

    @Autowired
    private PerformanceRepository repo;

    @GetMapping("/performance")
    public List<Performance> getPerformance(){
        return repo.findAll();
    }

    @GetMapping("/performance/{studentId}")
    public List<Performance> getStudentPerformance(@PathVariable int studentId){
        return repo.findByStudentId(studentId);
    }

    @PostMapping("/performance")
    public Performance addPerformance(@RequestBody Performance performance){
        return repo.save(performance);
    }
}
```

---

# Step 6 — Create Attendance Module

Now we implement the **attendance tracking system**.

---

# Step 7 — Create Attendance Model

Right click:

```
model → New → Class
```

Name:

```
Attendance
```

### Attendance.java

```java
package com.edutrack.edutrack.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="student_id")
    private int studentId;

    private LocalDate date;

    private String status;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
```

---

# Step 8 — Create Attendance Repository

Right click:

```
repository → New → Interface
```

Name:

```
AttendanceRepository
```

### AttendanceRepository.java

```java
package com.edutrack.edutrack.repository;

import com.edutrack.edutrack.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance,Integer>{

    List<Attendance> findByStudentId(int studentId);

}
```

---

# Step 9 — Create Attendance Controller

Right click:

```
controller → New → Class
```

Name:

```
AttendanceController
```

### AttendanceController.java

```java
@RestController
@RequestMapping("/attendance")
@CrossOrigin
public class AttendanceController {

    @Autowired
    private AttendanceRepository repo;

    @PostMapping("/add")
    public Attendance addAttendance(@RequestBody Attendance attendance){
        return repo.save(attendance);
    }

    @GetMapping("/all")
    public List<Attendance> getAll(){
        return repo.findAll();
    }

}
```

---

# Step 10 — Update HTML Dashboard

The frontend HTML file was updated to display:

* Student List
* Performance Records
* Attendance Records
* Forms to insert new data

File location:

```
src/main/resources/static/students.html
```

The page communicates with the backend using **JavaScript Fetch API** to call:

### /students
<img width="1488" height="906" alt="Students API" src="https://github.com/user-attachments/assets/52837a60-d7d0-4b45-a1f4-f4f9978dd0be" />

### /performance
<img width="1062" height="680" alt="Performance API" src="https://github.com/user-attachments/assets/9bc1be72-3bbe-4f11-abe4-d9e21b9266cf" />

### /attendance
<img width="802" height="428" alt="Attendance API" src="https://github.com/user-attachments/assets/2d6acdd7-98fd-44a7-899e-ac189a9e59ec" />

This allows users to:

✔ Add students
✔ Add performance records
✔ Add attendance records
✔ View data tables in the browser

---

# Updated Application Flow

```
MySQL Database
   ├ students
   ├ attendance
   └ performance
        ↓
Spring Boot REST APIs
        ↓
HTML Dashboard (students.html)
        ↓
JavaScript Fetch Requests
        ↓
Data Displayed in Browser
```
