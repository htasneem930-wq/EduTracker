
# 📊 EduTrack – Student Performance & Attendance Tracker

EduTrack is a **Spring Boot + React student tracking system** that manages student records and displays them through a simple frontend.
The application demonstrates how a **database, backend API, and frontend UI work together** to deliver data to users.

This guide walks through **building the entire project from scratch.**

---

# 🛠 Project Architecture

```
MySQL Database
      ↓
Spring Boot REST API
      ↓
React / HTML Frontend
      ↓
Student Data Displayed in Browser
```

---

# 📁 Step 1 — Create Main Project Folder

1. Open **File Explorer**
2. Navigate to **Desktop** or **Documents**
3. Right-click → **New Folder**
4. Name it:

```
EduTrack
```

---

# 📁 Step 2 — Create Project Structure

Inside the **EduTrack** folder create two subfolders:

```
EduTrack
├── backend
└── frontend
```

This separates:

* **Backend → Spring Boot API**
* **Frontend → React UI**

---

# 🚀 Step 3 — Create Spring Boot Backend

Open **Spring Initializr**

👉 [https://start.spring.io/](https://start.spring.io/)

Configure the project:

| Setting     | Value         |
| ----------- | ------------- |
| Project     | Maven         |
| Language    | Java          |
| Spring Boot | Latest Stable |
| Group       | com.edutrack  |
| Artifact    | backend       |
| Packaging   | Jar           |
| Java        | 17 / 21       |

### Add Dependencies

* Spring Web
* Spring Data JPA
* MySQL Driver
* Lombok
* Spring Boot DevTools

📷 Example configuration:

<img width="1902" height="831" src="https://github.com/user-attachments/assets/284835f9-8b73-4ef5-a9d1-d9fe9dfac9cc"/>

Click **Generate** and extract the project into:

```
EduTrack/backend
```

---

# 📂 Step 4 — Verify Backend Structure

After extraction your project should look like:

```
EduTrack
├── backend
│   ├── src
│   ├── pom.xml
│   └── mvnw
└── frontend
```

---

# ▶ Step 5 — Run Spring Boot Application

Navigate to:

```
src/main/java
```

You will see:

```
com.edutrack.edutrack
```

Run the application:

Right click:

```
EdutrackApplication.java
```

Select:

```
Run As → Java Application
```

If successful, console will show:

```
Tomcat started on port 8080
```

---

# 🗄 Step 6 — Create Database

Open **MySQL Workbench** and run:

```sql
CREATE DATABASE edutrack_db;

USE edutrack_db;

CREATE TABLE students (
id INT PRIMARY KEY,
name VARCHAR(100),
course VARCHAR(100)
);

INSERT INTO students VALUES (1,'Rahul','');
INSERT INTO students VALUES (2,'Anita','');
INSERT INTO students VALUES (3,'Kiran','');
-- courses will be added later

SELECT * FROM students;
```

---

# 🔗 Step 7 — Configure Database Connection

Open:

```
src/main/resources/application.properties
```

Add:

```
spring.datasource.url=jdbc:mysql://localhost:3306/edutrack_db
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

---

# 🧪 Step 8 — Test Backend

Run the application again.

If console shows:

```
Tomcat started on port 8080
```

Your backend is ready.

---

# ⚛ Step 9 — Create React Frontend

Open terminal inside **EduTrack** folder.

Run:

```
cd frontend
npx create-react-app edutrack-ui
```

Project becomes:

```
EduTrack
├── backend
└── frontend
     └── edutrack-ui
```

---

# 📦 Step 10 — Install Required Libraries

Inside the React project run:

```
cd edutrack-ui
npm install axios
npm install react-router-dom
npm install recharts
```

---

# 🧱 Final Project Structure

```
EduTrack
│
├── backend
│     └── edutrack-backend
│          ├── controller
│          ├── model
│          └── repository
│
└── frontend
      └── edutrack-ui
           ├── src
           ├── components
           ├── pages
           └── services
```

---

# 🌐 Server Ports

| Application         | Port                                           |
| ------------------- | ---------------------------------------------- |
| Spring Boot Backend | [http://localhost:8080](http://localhost:8080) |
| React Frontend      | [http://localhost:3000](http://localhost:3000) |

React will call APIs from Spring Boot.

---

# 📄 Step 11 — Serve HTML from Static Folder

Spring Boot automatically serves HTML files from:

```
src/main/resources/static
```

Example:

```
src
 └ main
     └ resources
         └ static
             └ students.html
```

## students.html

```html
<!DOCTYPE html>
<html>
<head>
<title>Students</title>
</head>

<body>

<h2>Student List</h2>

<table border="1" id="studentTable">
<tr>
<th>ID</th>
<th>Name</th>
<th>Course</th>
</tr>
</table>

<script>

fetch("http://localhost:8080/students")
.then(response => response.json())
.then(data => {

let table = document.getElementById("studentTable");

data.forEach(student => {

let row = table.insertRow();

row.insertCell(0).innerHTML = student.id;
row.insertCell(1).innerHTML = student.name;
row.insertCell(2).innerHTML = student.course;

});

});

</script>

</body>
</html>
```

Opening:

```
http://localhost:8080/students.html
```

will load the page.

---

# 🧩 Step 12 — Create Model Class

Create package:

```
com.edutrack.edutrack.model
```

Create class:

```
Student
```

```java
@Entity
@Table(name="students")
public class Student {

    @Id
    private int id;
    private String name;
    private String course;

}
```

---

# 📚 Step 13 — Create Repository

Package:

```
com.edutrack.edutrack.repository
```

```java
public interface StudentRepository
extends JpaRepository<Student, Integer> {

}
```

---

# 🎮 Step 14 — Create Controller

### StudentController.java

```java
package com.edutrack.edutrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.edutrack.model.Student;
import com.edutrack.edutrack.repository.StudentRepository;

@RestController
public class StudentController {

    @Autowired
    StudentRepository repo;

    @GetMapping("/students")
    public List<Student> getStudents(){
        return repo.findAll();
    }
}
```

---

# 📂 Step 15 — Folder Structure

```
src/main/java
   └ com.edutrack.edutrack
        ├ EdutrackApplication.java
        ├ controller
        │     └ StudentController.java
        ├ model
        │     └ Student.java
        └ repository
              └ StudentRepository.java
```

📷 Example:

<img width="521" height="502" src="https://github.com/user-attachments/assets/416c4832-a790-4491-8bef-760424358b9f"/>

---

# ▶ Step 16 — Test API

Open browser:

```
http://localhost:8080/students
```

Expected JSON response:

```json
[
 { "id":1, "name":"Rahul","course":null},
 { "id":2, "name":"Anita", "course":null},
 { "id":3, "name":"Kiran","course":null}
]
```

📷 Example output:

<img width="1885" height="867" src="https://github.com/user-attachments/assets/61049e43-8b9c-4314-b639-16b62b2e85a6"/>

---

# 📊 Step 17 — Display Students in HTML Table

Create:

```
students.html
```

Open:

```
http://localhost:8080/students.html
```

Output:

| ID | Name         | Course |
| -- | ------------ | ------ |
| 1  | Rahul sharma |    |
| 2  | Ananya Singh |    |
| 3  | Kiran Patel  |    |

📷 Example:

<img width="541" height="337" src="https://github.com/user-attachments/assets/f3faab0e-4d5f-469c-82ed-afa3e6571ad9"/>

---

# 🔄 Final Application Flow

```
MySQL Database
      ↓
Spring Boot API (/students)
      ↓
HTML / React Frontend
      ↓
Student Data Displayed in Browser
```

---

# 🎉 Congratulations 🎉 
You have successfully built the **EduTrack Student Management System**, completing a full-stack flow from **MySQL database → Spring Boot API → frontend display**. Your project shows how backend services, JPA data access, and frontend integration work together in a real application. Great job taking this step toward building real-world software! 🚀💻
*.




