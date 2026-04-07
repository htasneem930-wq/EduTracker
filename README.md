
# 🎓 EDUTRACK-Student Performance & Analytics System

A full-stack web application designed to manage, track, and analyze student academic performance efficiently. The system provides role-based access for Admin, Teacher, and Student, along with powerful analytics and dashboards.

---

## 🚀 Features

### 🔐 Authentication & Security
- Secure login and signup system
- Password hashing using bcrypt
- OTP-based verification

### 👥 Role-Based Access Control
- Admin, Teacher, Student roles
- Protected APIs based on user roles

### 📊 Student Management
- Add, update, and manage student data
- Assign students to classes and subjects

### 📝 Marks Management
- Add and update marks
- Subject-wise and exam-wise records
- Grade calculation

### 📅 Attendance System
- Daily attendance tracking
- Attendance percentage calculation
- Monthly reports

### 📈 Analytics Engine (Core Feature)
- Average marks calculation
- Rank calculation
- Weak subject detection
- Performance trend analysis

### 📊 Dashboard System
- Admin Dashboard (overview of system)
- Teacher Dashboard (class performance)
- Student Dashboard (personal analytics)

---

## 🛠️ Tech Stack

| Layer       | Technology        |
|------------|------------------|
| Frontend   | React.js         |
| Backend    | Spring Boot      |
| Database   | MySQL            |
| Security   | bcrypt + OTP     |
| Tools      | Postman, GitHub  |

---

## 🏗️ System Architecture

The system follows a client-server architecture:

Frontend (React) → Backend (Spring Boot APIs) → Database (MySQL)

👉 Add architecture diagram here (screenshot)

---

## 🔄 System Workflow

1. User registers and logs in
2. Password is hashed using bcrypt
3. Role is identified (Admin/Teacher/Student)
4. User performs actions based on role
5. Data is stored in database
6. Analytics are generated
7. Results displayed on dashboard

👉 Add workflow diagram here

---

## 📂 Project Structure

EduTrack/ │ ├── backend/        # Spring Boot backend ├── frontend/       # React frontend │ ├── docs/           # Project documentation (optional) │ ├── README.md └── .gitignore

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup (Spring Boot)

```bash
cd backend

Configure database in application.properties


spring.datasource.url=jdbc:mysql://localhost:3306/your_db
spring.datasource.username=root
spring.datasource.password=your_password

mvn clean install
mvn spring-boot:run


---

💻 Frontend Setup (React)

cd frontend
npm install
npm run dev


---

🔌 API Testing

Use Postman to test APIs

Example endpoints:

/login

/students

/marks

/attendance




---

📸 Screenshots

👉 Add:

Login Page

Dashboard

Analytics Graphs



---

📈 Future Enhancements

AI-based performance prediction

Mobile application

Advanced reporting system



---

📚 Learning Outcomes

Full-stack development (React + Spring Boot)

REST API design

Secure authentication using bcrypt

Database design and management

Data analytics implementation



---

👩‍💻 Author

Hadiah Tasneem


---

⭐ Conclusion

This project provides a complete solution for managing student performance with secure authentication, structured data management, and powerful analytics.

