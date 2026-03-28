# 🎨 EduTrack Frontend (index.html)

This is the frontend UI for the EduTrack system built using:

* HTML
* CSS
* JavaScript (Fetch API)

It connects with the Spring Boot backend to manage:

* Authentication
* Students
* Attendance
* Performance

---

# 🚀 Step-by-Step Implementation

## 🧩 Step 1: Create Basic HTML Structure

Set up the main HTML layout:

```html
<!DOCTYPE html>
<html>
<head>
    <title>EduTrack System</title>
</head>
<body>

<!-- Login + Dashboard will go here -->

</body>
</html>
```

---

## 🧩 Step 2: Design Login UI

Create a login/signup form.

### Features:

* Email & Password input
* Signup & Login buttons
* Message display

```html
<div class="auth-container" id="authBox">
    <h2>EduTrack Login</h2>

    <input type="email" id="email" placeholder="Email"><br>
    <input type="password" id="password" placeholder="Password"><br>

    <button onclick="signup()">Sign Up</button>
    <button onclick="login()">Login</button>

    <p id="msg"></p>
</div>
```

---

## 🧩 Step 3: Create Dashboard Layout

Split UI into:

* Sidebar (Navigation)
* Main Content Area

```html
<div class="dashboard" id="dashboard">

    <div class="sidebar">
        <button onclick="showSection('students')">Students</button>
        <button onclick="showSection('attendance')">Attendance</button>
        <button onclick="showSection('performance')">Performance</button>
    </div>

    <div class="main">
        <!-- Sections will load here -->
    </div>

</div>
```

---

## 🧩 Step 4: Add Sections (Students, Attendance, Performance)

Each section contains:

* Table (to display data)
* Input fields
* Action button

### Example: Attendance Section

```html
<div id="attendance" class="section">

<h3>Attendance</h3>

<table id="attendanceTable">
<tr>
<th>ID</th>
<th>Student ID</th>
<th>Date</th>
<th>Status</th>
</tr>
</table>

<input id="attStudentId" placeholder="Student ID">
<input id="attDate" type="date">
<input id="attStatus" placeholder="Present/Absent">

<button onclick="addAttendance()">Add Attendance</button>

</div>
```

---

## 🧩 Step 5: Add Styling (CSS)

Key UI improvements:

* Gradient background
* Card-style login
* Sidebar navigation
* Tables styling

```css
body{
    background: linear-gradient(135deg,#1a0033,#5a0dad,#ffffff);
}

.auth-container{
    background:white;
    padding:40px;
    border-radius:15px;
}

.sidebar{
    background:#1e0036;
    color:white;
}

table{
    border-collapse:collapse;
}
```

---

## 🧩 Step 6: Implement Authentication (JavaScript)

### Signup

```javascript
function signup(){
    fetch("http://localhost:8080/auth/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email:email.value,
            password:password.value
        })
    })
}
```

### Login

```javascript
function login(){
    fetch("http://localhost:8080/auth/signin",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email:email.value,
            password:password.value
        })
    })
}
```

---

## 🧩 Step 7: Load Data from Backend

Use Fetch API to call backend endpoints.

### Load Attendance

```javascript
function loadAttendance(){

fetch("http://localhost:8080/attendance/all")
.then(res=>res.json())
.then(data=>{

let table=document.getElementById("attendanceTable")

table.innerHTML="..."

data.forEach(a=>{
let row=table.insertRow()
row.insertCell(0).innerText=a.id
})

})
}
```

---

## 🧩 Step 8: Add Data (POST APIs)

### Add Attendance

```javascript
function addAttendance(){

fetch("http://localhost:8080/attendance/add",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
studentId:attStudentId.value,
date:attDate.value,
status:attStatus.value
})
})

}
```

---

## 🧩 Step 9: Navigation Between Sections

```javascript
function showSection(sectionId){

document.querySelectorAll(".section").forEach(sec=>{
sec.classList.remove("active")
})

document.getElementById(sectionId).classList.add("active")

}
```

---

# 📡 API Integration

| Feature     | Endpoint          |
| ----------- | ----------------- |
| Signup      | `/auth/signup`    |
| Login       | `/auth/signin`    |
| Students    | `/students`       |
| Attendance  | `/attendance/all` |
| Performance | `/performance`    |

---

# 🧪 Workflow

1. User signs up / logs in
2. Dashboard opens
3. Data loads automatically:

   * Students
   * Attendance
   * Performance
4. User can:

   * Add records
   * View tables

---

# 🎯 Features

* Clean UI with sidebar navigation
* Real-time data updates
* Full CRUD integration
* Single-page dashboard experience

---

# 🔧 Future Improvements

* Add validation (empty fields check)
* Show success/error alerts
* Add delete & update buttons
* Use React / Angular for better UI
* Add JWT token handling

---

# 👨‍💻 Notes

* Backend must run on: `http://localhost:8080`
* Enable CORS in Spring Boot
* Make sure APIs are working before frontend

---

# 📌 Conclusion

This frontend connects seamlessly with your Spring Boot backend and provides a complete student management dashboard.

