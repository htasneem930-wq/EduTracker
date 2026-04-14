import PropTypes from "prop-types";

const AttendanceFilter = ({ date, month, year, course, onChange }) => {
  const handleChange = (field) => (e) => {
    onChange({ ...{ date, month, year, course }, [field]: e.target.value });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      <div className="form-group">
        <label>Date</label>
        <input type="date" value={date || ""} onChange={handleChange("date")} />
      </div>
      <div className="form-group">
        <label>Month</label>
        <input
          type="number"
          min="1"
          max="12"
          placeholder="1-12"
          value={month || ""}
          onChange={handleChange("month")}
        />
      </div>
      <div className="form-group">
        <label>Year</label>
        <input
          type="number"
          placeholder="e.g. 2026"
          value={year || ""}
          onChange={handleChange("year")}
        />
      </div>
      <div className="form-group">
        <label>Class / Course</label>
        <input
          type="text"
          placeholder="e.g. BCA"
          value={course || ""}
          onChange={handleChange("course")}
        />
      </div>
    </div>
  );
};

AttendanceFilter.propTypes = {
  date: PropTypes.string,
  month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  course: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default AttendanceFilter;

