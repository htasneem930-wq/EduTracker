import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getUserSession, clearUserSession } from "../utils/auth";

export default function StudentDashboard() {
  const nav = useNavigate();
  const { name, studentId } = getUserSession();
  const [perf, setPerf] = useState([]);
  const [att, setAtt] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      try {
        const [perfRes, attRes] = await Promise.all([
          api.get(`/performance/${studentId}`),
          api.get(`/attendance/${studentId}`),
        ]);
        setPerf(perfRes.data);
        setAtt(attRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  const logout = () => {
    clearUserSession();
    nav("/");
  };

  const presentCount = att.filter((a) => a.status === "Present").length;
  const totalDays = att.length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  if (loading) return <div style={styles.loading}>Loading your data...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.navTitle}>EduTrack — Student Dashboard</span>
        <div>
          <span style={styles.navName}>Hello, {name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Summary cards */}
        <div style={styles.cardRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Subjects</div>
            <div style={styles.summaryValue}>{perf.length}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Attendance</div>
            <div style={{ ...styles.summaryValue, color: percentage >= 75 ? "green" : "red" }}>
              {percentage}%
            </div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Days Present</div>
            <div style={styles.summaryValue}>{presentCount}/{totalDays}</div>
          </div>
        </div>

        {/* Marks table */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>My Marks</h3>
          {perf.length === 0 ? (
            <p style={styles.empty}>No marks added yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Marks</th>
                  <th style={styles.th}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {perf.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.subject}</td>
                    <td style={styles.td}>{p.marks}/100</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: p.marks >= 75 ? "#e6f4ea" : p.marks >= 50 ? "#fff3e0" : "#fce8e8",
                        color: p.marks >= 75 ? "#2e7d32" : p.marks >= 50 ? "#e65100" : "#c62828",
                      }}>
                        {p.marks >= 75 ? "A" : p.marks >= 50 ? "B" : "C"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Attendance table */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>My Attendance</h3>
          {att.length === 0 ? (
            <p style={styles.empty}>No attendance records yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {att.map((a) => (
                  <tr key={a.id} style={styles.tr}>
                    <td style={styles.td}>{a.date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: a.status === "Present" ? "#e6f4ea" : "#fce8e8",
                        color: a.status === "Present" ? "#2e7d32" : "#c62828",
                      }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f5ff", fontFamily: "sans-serif" },
  loading: { padding: "2rem", textAlign: "center", color: "#666" },
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
  content: { maxWidth: "900px", margin: "0 auto", padding: "2rem" },
  cardRow: { display: "flex", gap: "16px", marginBottom: "2rem", flexWrap: "wrap" },
  summaryCard: {
    flex: 1, minWidth: "140px", background: "#fff", borderRadius: "12px",
    padding: "1.2rem", boxShadow: "0 2px 12px rgba(170, 59, 255, 0.08)", textAlign: "center",
  },
  summaryLabel: { fontSize: "12px", color: "#888", marginBottom: "6px" },
  summaryValue: { fontSize: "26px", fontWeight: "600", color: "#aa3bff" },
  section: {
    background: "#fff", borderRadius: "12px", padding: "1.5rem",
    marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(170, 59, 255, 0.08)",
  },
  sectionTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "1rem", color: "#aa3bff" },
  empty: { color: "#999", fontSize: "14px" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8f5ff" },
  th: { padding: "10px 14px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#666", borderBottom: "1px solid #e8d9ff" },
  tr: { borderBottom: "1px solid #f3e8ff" },
  td: { padding: "10px 14px", fontSize: "14px", color: "#333" },
  badge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
};