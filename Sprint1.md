
# EduTracker – Student Performance and Attendance Analytics

## Project Instruction Sheet

**Project:** EduTracker – Student Performance and Attendance Analytics  
**Sprint Duration:** March 9 – March 13  
**Sprint Goal:** Create the database structure and implement backend functionality for **User Signup, User Login, and Student Data Management**.

Since the project is developed **individually**, all tasks including database design, backend development, and documentation are handled by a single developer.

---

# Sprint Responsibility

**Database Design and Backend Authentication Development**

The focus of this sprint is to build the **core database and authentication system** required for the EduTracker application.

---

# Sprint Tasks

1. Create the **MySQL database** for the EduTracker system  
2. Design the **database schema for user authentication and student records**  
3. Create tables required for **User Signup and Login functionality**  
4. Create a **Student table** to store student information  
5. Write **DDL statements** for creating the tables  
6. Define **Primary Keys and constraints** for each table  
7. Implement **Spring Boot backend APIs** for Signup and Login  
8. Connect the **Spring Boot backend with MySQL database**  
9. Test the APIs using **Postman**  
10. Prepare **technical documentation** explaining the database structure  

---

# Work Breakdown Structure (WBS)

| Task ID | Task Description |
|-------|----------------|
| 1 | Analyze system requirements |
| 2 | Design database schema |
| 3 | Create MySQL database |
| 4 | Create Users table |
| 5 | Create Students table |
| 6 | Define primary keys and constraints |
| 7 | Develop Signup API |
| 8 | Develop Login API |
| 9 | Connect backend with database |
| 10 | Test APIs using Postman |
| 11 | Prepare documentation |

---

# Activity Network Diagram (AND)

Requirement Analysis  
↓  
Database Design  
↓  
Create MySQL Database  
↓  
Create Users Table  
↓  
Create Students Table  
↓  
Develop Signup and Login APIs  
↓  
Connect Backend with Database  
↓  
API Testing using Postman  
↓  
Documentation

---

# Database Design

The EduTracker system requires tables to store **user authentication data** and **student information**.

### Tables Used

- Users  
- Students  

---

# Database Creation

The system uses **MySQL** as the database.

```sql
CREATE DATABASE edutracker_db;
````

---

# DDL Statements

## Users Table

This table stores login details for the system.

```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

---

## Students Table

This table stores student details.

```sql
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    semester INT,
    email VARCHAR(100)
);
```

---

# Table Relationships

In this sprint, the **Users and Students tables are independent**.

### Primary Keys

* Users → user_id
* Students → student_id

These primary keys uniquely identify each record in the tables.

---

# Backend API Implementation

The backend was implemented using **Spring Boot**.

### APIs Developed

## User Signup API

**Purpose:** Register new users in the system.

Endpoint:

```
POST /api/signup
```

Functionality:

* Accept user registration details
* Validate input data
* Save user information in MySQL database

---

## User Login API

**Purpose:** Authenticate users.

Endpoint:

```
POST /api/login
```

Functionality:

* Verify username and password
* Allow user to access the system after successful authentication

---

# API Testing

All APIs were tested using **Postman**.

Testing included:

* Sending signup requests
* Checking data insertion in the database
* Testing login requests
* Verifying authentication responses

---

# Sprint Deliverables

At the end of the sprint, the following components were completed:

* MySQL database created
* Users table implemented
* Students table implemented
* DDL scripts documented
* Signup API developed
* Login API developed
* APIs tested using Postman
* Technical documentation prepared

---

# Conclusion

This sprint successfully established the **core database and authentication functionality** for the EduTracker system. The implemented database and APIs provide the foundation for further development of student management and analytics features in future development phases.

