import PropTypes from "prop-types";
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
  Legend,
} from "recharts";

const COLORS = ["#16a34a", "#dc2626"];

const AttendanceChart = ({ records, stats }) => {
  const groupedByDate = {};

  (records || []).forEach((r) => {
    const key = r.date;
    if (!groupedByDate[key]) {
      groupedByDate[key] = { date: key, present: 0, absent: 0 };
    }
    if (r.status === "PRESENT") groupedByDate[key].present += 1;
    else groupedByDate[key].absent += 1;
  });

  const barData = Object.values(groupedByDate);

  const pieData = [
    { name: "Present", value: stats?.presentCount || 0 },
    { name: "Absent", value: stats?.absentCount || 0 },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
        gap: "24px",
        alignItems: "stretch",
      }}
    >
      <div className="card">
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          Daily Attendance
        </h3>
        <div style={{ width: "100%", height: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#16a34a" />
              <Bar dataKey="absent" stackId="a" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3
          style={{
            marginBottom: "16px",
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          Present vs Absent
        </h3>
        <div style={{ width: "100%", height: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

AttendanceChart.propTypes = {
  records: PropTypes.array,
  stats: PropTypes.shape({
    totalStudents: PropTypes.number,
    presentCount: PropTypes.number,
    absentCount: PropTypes.number,
    attendancePercentage: PropTypes.number,
  }),
};

export default AttendanceChart;

