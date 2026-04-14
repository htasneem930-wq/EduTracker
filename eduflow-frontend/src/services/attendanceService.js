import API from "../api/axiosConfig";

export const AttendanceService = {
  getAttendance(params = {}) {
    return API.get("/api/attendance/filter", { params });
  },

  getStats(params = {}) {
    return API.get("/api/attendance/stats", { params });
  },

  getAll() {
    return API.get("/api/attendance");
  },

  markSingle(payload) {
    return API.post("/api/attendance", payload);
  },
};

