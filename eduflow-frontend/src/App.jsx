import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import Analytics from "./pages/Analytics";
import AuthLanding from "./pages/AuthLanding";
import OverviewDashboard from "./pages/OverviewDashboard";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]} />}>
          <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
          <Route path="/teachers" element={<Teachers />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
          <Route path="/overview" element={<OverviewDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "TEACHER", "STUDENT"]} />}>
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
