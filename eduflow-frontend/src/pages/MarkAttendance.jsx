import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendanceFilter from "../components/AttendanceFilter";
import { AttendanceService } from "../services/attendanceService";
import API from "../api/axiosConfig";

const MarkAttendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCourse, setSelectedCourse] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/api/students");
        setStudents(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const filteredStudents = students.filter((s) =>
    selectedCourse
      ? (s.courseName || s.course || "").toLowerCase() ===
        selectedCourse.toLowerCase()
      : true
  );

  const handleToggle = (id) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = async () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    if (filteredStudents.length === 0) {
      alert("No students found for this class");
      return;
    }

    setSaving(true);
    try {
      for (const s of filteredStudents) {
        const status = statusMap[s.id] ? "PRESENT" : "ABSENT";
        await AttendanceService.markSingle({
          studentId: s.id,
          date: selectedDate,
          status,
          subject: "General",
        });
      }
      alert("Attendance saved successfully");
    } catch (e) {
      console.error(e);
      alert("Error saving attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Mark Attendance" />

        <div className="card" style={{ marginBottom: "20px" }}>
          <h3
            style={{
              marginBottom: "12px",
              fontSize: "18px",
              fontWeight: "700",
              color: "#4c1d95",
            }}
          >
            Attendance Filters
          </h3>
          <AttendanceFilter
            date={selectedDate}
            month=""
            year=""
            course={selectedCourse}
            onChange={(next) => {
              setSelectedDate(next.date || "");
              setSelectedCourse(next.course || "");
            }}
          />
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
            Students List
          </h3>
          {filteredStudents.length === 0 ? (
            <p style={{ fontSize: "14px" }}>
              No students found. Try changing the class filter.
            </p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Present?</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.courseName || s.course || "-"}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!statusMap[s.id]}
                          onChange={() => handleToggle(s.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: "16px", textAlign: "right" }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{ minWidth: "160px" }}
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;

