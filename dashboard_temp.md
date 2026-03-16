#Updated index.html

<!DOCTYPE html>
<html>
<head>
<title>EduTrack System</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;
}

/* BODY */

body{
height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:linear-gradient(135deg,#1a0033,#5a0dad,#ffffff);
}

/* LOGIN */

.auth-container{
background:white;
padding:40px;
border-radius:15px;
width:320px;
box-shadow:0 10px 25px rgba(0,0,0,0.2);
text-align:center;
}

.auth-container h2{
color:#6a0dad;
margin-bottom:20px;
}

input{
width:85%;
padding:10px;
margin:8px;
border-radius:8px;
border:1px solid #ccc;
}

.auth-btn{
width:120px;
padding:10px;
margin:10px 5px;
border:none;
border-radius:8px;
color:white;
cursor:pointer;
}

.signup{
background:linear-gradient(135deg,#ff9bd6,#b388ff);
}

.login{
background:linear-gradient(135deg,#6a0dad,#b388ff);
}

/* DASHBOARD */

.dashboard{
display:none;
height:100vh;
width:100%;
}

/* SIDEBAR */

.sidebar{
width:230px;
background:#1e0036;
color:white;
height:100vh;
padding-top:30px;
position:fixed;
}

.sidebar h2{
text-align:center;
margin-bottom:30px;
color:#d6b3ff;
}

.sidebar button{
display:block;
width:100%;
background:none;
border:none;
color:white;
padding:15px;
text-align:left;
cursor:pointer;
font-size:15px;
}

.sidebar button:hover{
background:#6a0dad;
}

/* MAIN */

.main{
margin-left:230px;
padding:30px;
background:white;
height:100vh;
overflow:auto;
}

/* SECTIONS */

.section{
display:none;
}

.section.active{
display:block;
}

h3{
color:#6a0dad;
margin-bottom:15px;
}

/* TABLE */

table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

th{
background:#6a0dad;
color:white;
padding:10px;
}

td{
padding:8px;
border:1px solid #eee;
}

/* BUTTON */

.action{
padding:8px 15px;
border:none;
border-radius:6px;
background:linear-gradient(135deg,#6a0dad,#b388ff);
color:white;
cursor:pointer;
margin-top:8px;
}

</style>
</head>


<body>

<!-- LOGIN -->

<div class="auth-container" id="authBox">

<h2>EduTrack Login</h2>

<input type="email" id="email" placeholder="Email"><br>
<input type="password" id="password" placeholder="Password"><br>

<button class="auth-btn signup" onclick="signup()">Sign Up</button>
<button class="auth-btn login" onclick="login()">Login</button>

<p id="msg"></p>

</div>


<!-- DASHBOARD -->

<div class="dashboard" id="dashboard">

<div class="sidebar">

<h2>EduTrack</h2>

<button onclick="showSection('students')">Manage Students</button>
<button onclick="showSection('attendance')">Attendance</button>
<button onclick="showSection('performance')">Performance</button>

</div>


<div class="main">

<!-- STUDENTS -->

<div id="students" class="section active">

<h3>Manage Students</h3>

<table id="studentTable">
<tr>
<th>ID</th>
<th>Name</th>
<th>Course</th>
</tr>
</table>

<input id="studentName" placeholder="Student Name">
<input id="studentCourse" placeholder="Course">

<button class="action" onclick="addStudent()">Add Student</button>

</div>


<!-- ATTENDANCE -->

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

<button class="action" onclick="addAttendance()">Add Attendance</button>

</div>


<!-- PERFORMANCE -->

<div id="performance" class="section">

<h3>Performance</h3>

<table id="performanceTable">
<tr>
<th>ID</th>
<th>Student ID</th>
<th>Subject</th>
<th>Marks</th>
</tr>
</table>

<input id="perfStudentId" placeholder="Student ID">
<input id="perfSubject" placeholder="Subject">
<input id="perfMarks" placeholder="Marks">

<button class="action" onclick="addPerformance()">Add Performance</button>

</div>

</div>

</div>



<script>

/* LOGIN */

function signup(){

let email=document.getElementById("email").value
let password=document.getElementById("password").value

fetch("http://localhost:8080/auth/signup",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email:email,password:password})
})
.then(res=>res.text())
.then(msg=>document.getElementById("msg").innerText=msg)

}


function login(){

let email=document.getElementById("email").value
let password=document.getElementById("password").value

fetch("http://localhost:8080/auth/signin",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email:email,password:password})
})
.then(res=>res.text())
.then(msg=>{

document.getElementById("msg").innerText=msg

if(msg==="Login successful!"){

document.getElementById("authBox").style.display="none"
document.getElementById("dashboard").style.display="block"

loadStudents()
loadAttendance()
loadPerformance()

}

})

}


/* SIDEBAR NAV */

function showSection(sectionId){

document.querySelectorAll(".section").forEach(sec=>{
sec.classList.remove("active")
})

document.getElementById(sectionId).classList.add("active")

}


/* STUDENTS */

function loadStudents(){

fetch("http://localhost:8080/students")
.then(res=>res.json())
.then(data=>{

let table=document.getElementById("studentTable")

table.innerHTML="<tr><th>ID</th><th>Name</th><th>Course</th></tr>"

data.forEach(s=>{

let row=table.insertRow()

row.insertCell(0).innerText=s.id
row.insertCell(1).innerText=s.name
row.insertCell(2).innerText=s.course

})

})

}


function addStudent(){

let name=document.getElementById("studentName").value
let course=document.getElementById("studentCourse").value

fetch("http://localhost:8080/students",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name:name,course:course})
})
.then(()=>loadStudents())

}


/* ATTENDANCE */

function loadAttendance(){

fetch("http://localhost:8080/attendance/all")
.then(res=>res.json())
.then(data=>{

let table=document.getElementById("attendanceTable")

table.innerHTML="<tr><th>ID</th><th>Student ID</th><th>Date</th><th>Status</th></tr>"

data.forEach(a=>{

let row=table.insertRow()

row.insertCell(0).innerText=a.id
row.insertCell(1).innerText=a.studentId
row.insertCell(2).innerText=a.date
row.insertCell(3).innerText=a.status

})

})

}


function addAttendance(){

let studentId=document.getElementById("attStudentId").value
let date=document.getElementById("attDate").value
let status=document.getElementById("attStatus").value

fetch("http://localhost:8080/attendance/add",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
studentId:studentId,
date:date,
status:status
})
})
.then(()=>loadAttendance())

}


/* PERFORMANCE */

function loadPerformance(){

fetch("http://localhost:8080/performance")
.then(res=>res.json())
.then(data=>{

let table=document.getElementById("performanceTable")

table.innerHTML="<tr><th>ID</th><th>Student ID</th><th>Subject</th><th>Marks</th></tr>"

data.forEach(p=>{

let row=table.insertRow()

row.insertCell(0).innerText=p.id
row.insertCell(1).innerText=p.studentId
row.insertCell(2).innerText=p.subject
row.insertCell(3).innerText=p.marks

})

})

}


function addPerformance(){

let studentId=document.getElementById("perfStudentId").value
let subject=document.getElementById("perfSubject").value
let marks=document.getElementById("perfMarks").value

fetch("http://localhost:8080/performance",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
studentId:studentId,
subject:subject,
marks:marks
})
})
.then(()=>loadPerformance())

}

</script>

</body>
</html>
