import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import API from "../api/axiosConfig";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#7c3aed", "#ef4444", "#10b981", "#f59e0b", "#3b82f6"];

const Analytics = () => {
  const { user } = useAuth();
  const role = user?.role || user?.user?.role;

  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/api/analytics/student/${id}`);
      setAnalytics(res.data);
    } catch (e) {
      console.error(e);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/api/students");
        setStudents(res.data);

        if (role === "STUDENT") {
          const me = res.data.find((s) => s.email === user.email);

          if (me) {
            setSelectedId(me.id);
            fetchAnalytics(me.id);
          }
        } else if ((role === "TEACHER" || role === "ADMIN") && res.data.length > 0 && !selectedId) {
          const firstId = res.data[0].id;
          if (firstId) {
            setSelectedId(firstId);
            fetchAnalytics(firstId);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user, role, selectedId, fetchAnalytics]);

  const handleStudentChange = (e) => {
    const id = e.target.value;
    setSelectedId(id);

    if (id) {
      fetchAnalytics(id);
    } else {
      setAnalytics(null);
    }
  };

  if (!user) {
    return <Spinner />;
  }

  const barData = analytics
    ? Object.entries(analytics?.subjectMarks || {}).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const pieData = analytics
    ? [
        { name: "Attendance", value: Math.round(analytics?.attendancePercentage || 0) },
        { name: "Missed", value: 100 - Math.round(analytics?.attendancePercentage || 0) },
      ]
    : [];

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <style>{`
          @media print {
            .sidebar, .navbar, .no-print, .select-card {
              display: none !important;
            }
            .main-content { margin: 0 !important; padding: 0 !important; width: 100% !important; }
            .layout { display: block !important; }
            .card { break-inside: avoid; box-shadow: none !important; border: 1px solid #e5e7eb !important; }
            body { background: white !important; }
            .print-header { display: block !important; margin-bottom: 20px; }
          }
          .print-header { display: none; }
        `}</style>
        <Navbar title="Performance Analytics" />

        {role !== "STUDENT" && (
          <div className="card select-card" style={{ marginBottom: "24px" }}>
            <h3
              style={{
                marginBottom: "16px",
                fontWeight: "700",
                color: "#4c1d95",
              }}
            >
              Select Student to View Analytics
            </h3>

            <div className="form-group">
              <select value={selectedId} onChange={handleStudentChange}>
                <option value="">-- Select a Student --</option>

                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (#
                    {s.rollNumber || `2026-${s.id}`})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : analytics ? (
          <>
            <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <button className="btn btn-primary" onClick={() => window.print()}>
                🖨️ Export PDF / Print
              </button>
            </div>

            <div className="print-header">
              <h2 style={{ color: "#4c1d95" }}>Academic Performance Report</h2>
              <p>Student: {students.find(s => String(s.id) === String(selectedId))?.name || user.name}</p>
              <hr style={{ margin: "16px 0", border: "0", borderTop: "1px solid #eee" }} />
            </div>

          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "24px",
              }}
            >
            {/* Marks Chart */}

            <div className="card">
              <h3
                style={{
                  marginBottom: "20px",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Marks per Subject
              </h3>

              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="name" />

                    <YAxis domain={[0, 100]} />

                    <Tooltip cursor={{ fill: "#f3f4f6" }} />

                    <Bar
                      dataKey="value"
                      fill="#7c3aed"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance Pie */}

            <div className="card">
              <h3
                style={{
                  marginBottom: "20px",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Attendance Overview (%)
              </h3>

              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <span
                  className={`badge ${
                    Math.round(analytics?.attendancePercentage || 0) >= 75
                      ? "badge-green"
                      : "badge-red"
                  }`}
                >
                  {Math.round(analytics?.attendancePercentage || 0)}% Attendance
                </span>
              </div>
            </div>

            {/* Summary */}

            <div className="card" style={{ gridColumn: "1 / -1" }}>
              <h3
                style={{
                  marginBottom: "16px",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Academic Summary
              </h3>

              <div className="stats-grid">
                <div className="stat-card light">
                  <h3>Overall Average</h3>
                  <div className="number">{Math.round(analytics?.averageMarks || 0)}%</div>
                </div>

                <div className="stat-card light">
                  <h3>Performance Status</h3>
                  <div
                    className="number"
                    style={{ fontSize: "20px" }}
                  >
                    {analytics?.performanceStatus || "N/A"}
                  </div>
                </div>

                <div className="stat-card light">
                  <h3>Total Subjects</h3>
                  <div className="number">{barData.length}</div>
                </div>
              </div>
            </div>
          </div>
          </div>
          </>
        ) : (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "48px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>
              📊
            </div>

            <p style={{ color: "#6b7280" }}>
              {role === "STUDENT" 
                ? "We couldn't find your student profile record. Please contact your administrator."
                : "Select a student to see their performance visualisations."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
