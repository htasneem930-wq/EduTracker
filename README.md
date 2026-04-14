
# 🎓 EduTrack – Student Performance & Analytics System

EduTrack is a full-stack web application designed to efficiently manage, track, and analyze student academic performance. It provides **role-based access**, **secure authentication**, and **powerful analytics dashboards** for Admins, Teachers, and Students.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- Secure login & registration system  
- Password encryption using **bcrypt**  
- OTP-based email verification  
- Role-based authorization (Admin / Teacher / Student)

---

### 👥 Role-Based Access Control
- **Admin**: Full system access  
- **Teacher**: Manage students, marks, attendance  
- **Student**: View personal performance & analytics  
- Protected REST APIs for each role  

---

### 📊 Student Management
- Add, update, and delete student records  
- Assign students to classes and subjects  
- Maintain structured academic data  

---

### 📝 Marks Management
- Add and update student marks  
- Subject-wise & exam-wise performance tracking  
- Automatic grade calculation  

---

### 📅 Attendance System
- Daily attendance tracking  
- Attendance percentage calculation  
- Monthly attendance reports  

---

### 📈 Analytics Engine (Core Feature)
- Average marks calculation  
- Student rank generation  
- Weak subject detection  
- Performance trend analysis  

---

### 📊 Dashboard System
- **Admin Dashboard** → System overview & analytics  
- **Teacher Dashboard** → Class performance insights  
- **Student Dashboard** → Personal academic analysis  

---

## 🛠️ Tech Stack

| Layer       | Technology          |
|------------|--------------------|
| Frontend   | React.js           |
| Backend    | Spring Boot        |
| Database   | MySQL              |
| Security   | bcrypt + OTP       |
| Tools      | Postman, GitHub    |

---

## 🏗️ System Architecture

```

Frontend (React)
↓
Backend (Spring Boot APIs)
↓
Database (MySQL)

```

---

## 🔄 System Workflow

1. User registers and logs in  
2. Password is securely hashed using bcrypt  
3. User role is identified (Admin / Teacher / Student)  
4. Role-based actions are performed  
5. Data is stored in the database  
6. Analytics engine processes performance data  
7. Results are displayed on dashboards  

---

## 📂 Project Structure

```

EduTrack/Backend
│
├── backend-api/        # Spring Boot backend
├── frontend-ui/       # React frontend
├── docs/           # Documentation (optional)
├── README.md
└── .gitignore

````

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup (Spring Boot)

```bash
cd Backend
cd backend-api
````

Configure your `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_db
spring.datasource.username=root
spring.datasource.password=your_password
```

Run the backend:

```bash
mvn clean install
mvn spring-boot:run
```

Or using wrapper:

```bash
./mvnw spring-boot:run
```

---

### 💻 Frontend Setup (React)

```bash
cd Frontend
cd frontend-ui
npm install
npm run dev
```

---

## 🎯 Conclusion 

EduTrack provides a **complete, secure, and scalable solution** for managing student performance with structured data handling and powerful analytics. It simplifies academic tracking while offering meaningful insights for better decision-making.
