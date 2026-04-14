import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUserSession, clearUserSession } from "../utils/auth";

export default function TeacherDashboard() {
  const nav = useNavigate();
  const { name } = getUserSession();
  const [tab, setTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [msg, setMsg] = useState("");

  // Add student form
  const [stuForm, setStuForm] = useState({ name: "", course: "", email: "", phone: "" });
  // Add marks form
  const [markForm, setMarkForm] = useState({ studentId: "", subject: "", marks: "" });
  // Add attendance form
  const [attForm, setAttForm] = useState({ studentId: "", date: "", status: "Present" });

  const loadStudents = () => api.get("/students").then((r) => setStudents(r.data));

  useEffect(() => { loadStudents(); }, []);

  const logout = () => { clearUserSession(); nav("/"); };

  const addStudent = async () => {
    try {
      const res = await api.post("/students/add", stuForm);
      setMsg(res.data.message);
      setStuForm({ name: "", course: "", email: "", phone: "" });
      loadStudents();
    } catch { setMsg("Error adding student."); }
  };

  const addMark = async () => {
    if (!markForm.studentId || !markForm.subject || !markForm.marks) {
      setMsg("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post("/performance/add", {
        studentId: parseInt(markForm.studentId),
        subject: markForm.subject,
        marks: parseInt(markForm.marks),
      });
      setMsg(res.data?.message || "Marks added successfully!");
      setTimeout(() => setMarkForm({ studentId: "", subject: "", marks: "" }), 500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error adding marks. Please try again.");
    }
  };

  const addAttendance = async () => {
    try {
      await api.post("/attendance/add", {
        studentId: parseInt(attForm.studentId),
        date: attForm.date,
        status: attForm.status,
      });
      setMsg("Attendance marked!");
      setAttForm({ studentId: "", date: "", status: "Present" });
    } catch { setMsg("Error marking attendance."); }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await api.delete(`/students/${id}`);
    loadStudents();
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.navTitle}>EduTrack — Teacher Dashboard</span>
        <div>
          <span style={styles.navName}>Hello, {name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.tabs}>
          {["students", "marks", "attendance"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg(""); }}
              style={{ ...styles.tabBtn, ...(tab === t ? styles.activeTab : {}) }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {msg && <p style={styles.msgBox}>{msg}</p>}

        {/* STUDENTS TAB */}
        {tab === "students" && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add New Student</h3>
            <p style={styles.hint}>When you add a student, they automatically get a login account with password: student123</p>
            <div style={styles.formGrid}>
              <input placeholder="Full Name" value={stuForm.name}
                onChange={(e) => setStuForm({ ...stuForm, name: e.target.value })}
                style={styles.input} />
              <input placeholder="Course" value={stuForm.course}
                onChange={(e) => setStuForm({ ...stuForm, course: e.target.value })}
                style={styles.input} />
              <input placeholder="Email (used for login)" value={stuForm.email}
                onChange={(e) => setStuForm({ ...stuForm, email: e.target.value })}
                style={styles.input} />
              <input placeholder="Phone" value={stuForm.phone}
                onChange={(e) => setStuForm({ ...stuForm, phone: e.target.value })}
                style={styles.input} />
            </div>
            <button onClick={addStudent} style={styles.btn}>Add Student</button>

            <h3 style={{ ...styles.sectionTitle, marginTop: "2rem" }}>All Students</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Course</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>{s.id}</td>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.course}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.phone}</td>
                    <td style={styles.td}>
                      <button onClick={() => deleteStudent(s.id)} style={styles.delBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MARKS TAB */}
        {tab === "marks" && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add Marks for a Student</h3>
            <div style={styles.formGrid}>
              <select
                value={markForm.studentId}
                onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                style={styles.input}
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input placeholder="Subject (e.g. Math)" value={markForm.subject}
                onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })}
                style={styles.input} />
              <input placeholder="Marks (0-100)" type="number" value={markForm.marks}
                onChange={(e) => setMarkForm({ ...markForm, marks: e.target.value })}
                style={styles.input} />
            </div>
            <button onClick={addMark} style={styles.btn}>Add Marks</button>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {tab === "attendance" && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Mark Attendance</h3>
            <div style={styles.formGrid}>
              <select
                value={attForm.studentId}
                onChange={(e) => setAttForm({ ...attForm, studentId: e.target.value })}
                style={styles.input}
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input type="date" value={attForm.date}
                onChange={(e) => setAttForm({ ...attForm, date: e.target.value })}
                style={styles.input} />
              <select
                value={attForm.status}
                onChange={(e) => setAttForm({ ...attForm, status: e.target.value })}
                style={styles.input}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <button onClick={addAttendance} style={styles.btn}>Mark Attendance</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f5ff", fontFamily: "sans-serif" },
  navbar: {
    background: "linear-gradient(135deg, #aa3bff 0%, #9333ea 100%)", color: "#fff", padding: "14px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  navTitle: { fontWeight: "600", fontSize: "16px" },
  navName: { fontSize: "14px", marginRight: "12px" },
  logoutBtn: {
    padding: "6px 14px", background: "rgba(255,255,255,0.2)",
    color: "#fff", border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "6px", cursor: "pointer", fontSize: "13px",
  },
  content: { maxWidth: "1000px", margin: "0 auto", padding: "2rem" },
  tabs: { display: "flex", gap: "8px", marginBottom: "1.5rem" },
  tabBtn: {
    padding: "8px 20px", border: "1.5px solid #e8d9ff", borderRadius: "8px",
    background: "#fff", cursor: "pointer", fontSize: "14px", color: "#666",
  },
  activeTab: { background: "#aa3bff", color: "#fff", border: "1.5px solid #aa3bff" },
  section: {
    background: "#fff", borderRadius: "12px", padding: "1.5rem",
    boxShadow: "0 2px 12px rgba(170, 59, 255, 0.08)",
  },
  sectionTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "1rem", color: "#aa3bff" },
  hint: { fontSize: "13px", color: "#888", marginBottom: "1rem" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" },
  input: {
    padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #e8d9ff",
    fontSize: "14px", width: "100%", boxSizing: "border-box",
  },
  btn: {
    padding: "10px 24px", background: "#aa3bff", color: "#fff",
    border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px",
  },
  msgBox: { background: "#f3e8ff", color: "#aa3bff", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "1rem" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "1rem" },
  thead: { background: "#f8f5ff" },
  th: { padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#666", borderBottom: "1px solid #e8d9ff" },
  tr: { borderBottom: "1px solid #f3e8ff" },
  td: { padding: "10px 14px", fontSize: "14px", color: "#333" },
  delBtn: {
  padding: "4px 10px",
  background: "#ffe8e8", 
  color: "#d32f2f",
  border: "1px solid #ffcdd2",
  borderRadius: "6px", 
  cursor: "pointer", 
  fontSize: "12px",
  },
};