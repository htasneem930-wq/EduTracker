import PropTypes from "prop-types";

const AttendanceTable = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div style={{ padding: "24px", textAlign: "center", fontSize: "14px" }}>
        No attendance records found for the selected filters.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((a, idx) => (
            <tr key={idx}>
              <td>{a.studentName}</td>
              <td>{a.subject}</td>
              <td>{a.date}</td>
              <td>
                <span
                  className={`badge ${
                    a.status === "PRESENT" ? "badge-green" : "badge-red"
                  }`}
                >
                  {a.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AttendanceTable.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      studentName: PropTypes.string,
      subject: PropTypes.string,
      date: PropTypes.string,
      status: PropTypes.string,
    })
  ),
};

export default AttendanceTable;

