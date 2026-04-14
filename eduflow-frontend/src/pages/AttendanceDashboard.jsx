import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendanceFilter from "../components/AttendanceFilter";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceChart from "../components/AttendanceChart";
import { AttendanceService } from "../services/attendanceService";

const AttendanceDashboard = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    date: "",
    month: "",
    year: "",
    course: "",
  });
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = user?.role || user?.user?.role;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.date) params.date = filters.date;
        if (filters.month) params.month = filters.month;
        if (filters.year) params.year = filters.year;
        if (filters.course) params.course = filters.course;

        const [statsRes, recordsRes] = await Promise.all([
          AttendanceService.getStats(params),
          AttendanceService.getAttendance(params),
        ]);
        setStats(statsRes.data);
        setRecords(recordsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      load();
    }
  }, [user, filters]);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Attendance Dashboard" />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="card" style={{ marginBottom: "20px" }}>
          <h3
            style={{
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: "700",
              color: "#4c1d95",
            }}
          >
            Filters
          </h3>
          <AttendanceFilter
            date={filters.date}
            month={filters.month}
            year={filters.year}
            course={filters.course}
            onChange={setFilters}
          />
        </div>

        <div className="stats-grid" style={{ marginBottom: "20px" }}>
          <div className="stat-card">
            <h3>Total Records</h3>
            <div className="number">{stats?.totalStudents || 0}</div>
          </div>
          <div className="stat-card light">
            <h3>Present</h3>
            <div className="number">{stats?.presentCount || 0}</div>
          </div>
          <div className="stat-card light">
            <h3>Absent</h3>
            <div className="number">{stats?.absentCount || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Attendance %</h3>
            <div className="number">
              {stats ? Math.round(stats.attendancePercentage || 0) : 0}%
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <AttendanceChart records={records} stats={stats} />
        </div>

        <div className="card">
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "18px",
              fontWeight: "700",
              color: "#4c1d95",
            }}
          >
            Attendance Records
          </h3>
          <AttendanceTable records={records} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
