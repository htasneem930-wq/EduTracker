import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import StatCard from "../components/StatCard";
import API from "../api/axiosConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#7c3aed", "#a855f7", "#4ade80", "#f97316", "#22d3ee"];

const OverviewDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalAttendance: 0,
    totalMarks: 0,
    avgMarks: 0,
    attendancePct: 0,
  });
  const [subjectPerf, setSubjectPerf] = useState([]);
  const [attendanceDist, setAttendanceDist] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes, marksRes] = await Promise.all([
          API.get("/api/students"),
          API.get("/api/attendance"),
          API.get("/api/marks"),
        ]);

        const students = studentsRes.data || [];
        const attendance = attendanceRes.data || [];
        const marks = marksRes.data || [];

        const totalStudents = students.length;
        const totalAttendance = attendance.length;
        const totalMarks = marks.length;

        // attendance distribution
        const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
        const attendancePct =
          attendance.length === 0 ? 0 : Math.round((presentCount / attendance.length) * 100);

        setAttendanceDist([
          { name: "Present", value: presentCount },
          { name: "Absent", value: attendance.length - presentCount },
        ]);

        // marks analytics
        let sumPct = 0;
        const subjectMap = {};
        const dayMap = {};

        marks.forEach((m) => {
          const pct = m.totalMarks > 0 ? (m.marksObtained / m.totalMarks) * 100 : 0;
          sumPct += pct;

          if (!subjectMap[m.subject]) {
            subjectMap[m.subject] = { name: m.subject, total: 0, count: 0 };
          }
          subjectMap[m.subject].total += pct;
          subjectMap[m.subject].count += 1;

          const key = m.semester || "S1";
          if (!dayMap[key]) {
            dayMap[key] = { name: key, total: 0, count: 0 };
          }
          dayMap[key].total += pct;
          dayMap[key].count += 1;
        });

        const avgMarks = marks.length === 0 ? 0 : Math.round(sumPct / marks.length);

        const subjectData = Object.values(subjectMap).map((s) => ({
          name: s.name,
          value: Math.round(s.total / s.count),
        }));

        const trend = Object.values(dayMap)
          .map((d) => ({
            name: d.name,
            value: Math.round(d.total / d.count),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setSummary({
          totalStudents,
          totalAttendance,
          totalMarks,
          avgMarks,
          attendancePct,
        });
        setSubjectPerf(subjectData);
        setTrendData(trend);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Performance Overview" />

        <div className="stats-grid" style={{ marginBottom: "24px" }}>
          <StatCard
            title="Total Students"
            value={summary.totalStudents}
            icon="🎓"
          />
          <StatCard
            title="Attendance Records"
            value={summary.totalAttendance}
            icon="📅"
          />
          <StatCard
            title="Marks Entries"
            value={summary.totalMarks}
            icon="📊"
          />
          <StatCard
            title="Avg Marks %"
            value={`${summary.avgMarks}%`}
            icon="⭐"
            light
          />
        </div>

        <div className="overview-grid page-fade">
          <div className="card overview-card">
            <h3 className="overview-title">Subject Performance</h3>
            <div className="overview-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerf}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {subjectPerf.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card overview-card">
            <h3 className="overview-title">Attendance Overview</h3>
            <div className="overview-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {attendanceDist.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <span
                className={`badge ${
                  summary.attendancePct >= 75 ? "badge-green" : "badge-yellow"
                }`}
              >
                {summary.attendancePct}% overall attendance
              </span>
            </div>
          </div>

          <div className="card overview-card overview-wide">
            <h3 className="overview-title">Semester Trend</h3>
            <div className="overview-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;

