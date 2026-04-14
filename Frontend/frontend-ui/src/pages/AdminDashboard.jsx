import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUserSession, clearUserSession } from "../utils/auth";

export default function AdminDashboard() {
  const nav = useNavigate();
  const { name } = getUserSession();
  const [tab, setTab] = useState("teachers");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [msg, setMsg] = useState("");

  const [teaForm, setTeaForm] = useState({ name: "", email: "", subject: "" });
  const [stuForm, setStuForm] = useState({ name: "", course: "", email: "", phone: "" });

  const loadData = () => {
    api.get("/teachers").then((r) => setTeachers(r.data));
    api.get("/students").then((r) => setStudents(r.data));
  };

  useEffect(() => { loadData(); }, []);

  const logout = () => { clearUserSession(); nav("/"); };

  const addTeacher = async () => {
    try {
      const res = await api.post("/teachers/add", teaForm);
      setMsg(res.data.message);
      setTeaForm({ name: "", email: "", subject: "" });
      loadData();
    } catch { setMsg("Error adding teacher."); }
  };

  const addStudent = async () => {
    try {
      const res = await api.post("/students/add", stuForm);
      setMsg(res.data.message);
      setStuForm({ name: "", course: "", email: "", phone: "" });
      loadData();
    } catch { setMsg("Error adding student."); }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    await api.delete(`/teachers/${id}`);
    loadData();
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await api.delete(`/students/${id}`);
    loadData();
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.navTitle}>EduTrack — Admin Dashboard</span>
        <div>
          <span style={styles.navName}>Hello, {name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Summary */}
        <div style={styles.cardRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Teachers</div>
            <div style={styles.summaryValue}>{teachers.length}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Students</div>
            <div style={styles.summaryValue}>{students.length}</div>
          </div>
        </div>

        <div style={styles.tabs}>
          {["teachers", "students"].map((t) => (
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

        {/* TEACHERS TAB */}
        {tab === "teachers" && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add New Teacher</h3>
            <p style={styles.hint}>Teacher's default login password will be: teacher123</p>
            <div style={styles.formGrid}>
              <input placeholder="Full Name" value={teaForm.name}
                onChange={(e) => setTeaForm({ ...teaForm, name: e.target.value })}
                style={styles.input} />
              <input placeholder="Email (used for login)" value={teaForm.email}
                onChange={(e) => setTeaForm({ ...teaForm, email: e.target.value })}
                style={styles.input} />
              <input placeholder="Subject Specialization" value={teaForm.subject}
                onChange={(e) => setTeaForm({ ...teaForm, subject: e.target.value })}
                style={styles.input} />
            </div>
            <button onClick={addTeacher} style={styles.btn}>Add Teacher</button>

            <h3 style={{ ...styles.sectionTitle, marginTop: "2rem" }}>All Teachers</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} style={styles.tr}>
                    <td style={styles.td}>{t.id}</td>
                    <td style={styles.td}>{t.name}</td>
                    <td style={styles.td}>{t.email}</td>
                    <td style={styles.td}>{t.subject}</td>
                    <td style={styles.td}>
                      <button onClick={() => deleteTeacher(t.id)} style={styles.delBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === "students" && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add New Student</h3>
            <p style={styles.hint}>Student's default login password will be: student123</p>
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
                    <td style={styles.td}>
                      <button onClick={() => deleteStudent(s.id)} style={styles.delBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  cardRow: { display: "flex", gap: "16px", marginBottom: "1.5rem" },
  summaryCard: {
    flex: 1, background: "#fff", borderRadius: "12px", padding: "1.2rem",
    boxShadow: "0 2px 12px rgba(170, 59, 255, 0.08)", textAlign: "center",
  },
  summaryLabel: { fontSize: "12px", color: "#888", marginBottom: "6px" },
  summaryValue: { fontSize: "26px", fontWeight: "600", color: "#aa3bff" },
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
    padding: "4px 10px", background: "#ffe8e8", color: "#d32f2f",
    border: "1px solid #ffcdd2", borderRadius: "6px", cursor: "pointer", fontSize: "12px",
  },
};