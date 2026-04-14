import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { isAuthenticated, getUserRole } from "./utils/auth";

function Protected({ role, children }) {
  if (!isAuthenticated()) return <Navigate to="/" />;
  if (getUserRole() !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/student"
          element={
            <Protected role="STUDENT">
              <StudentDashboard />
            </Protected>
          }
        />
        <Route
          path="/teacher"
          element={
            <Protected role="TEACHER">
              <TeacherDashboard />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected role="ADMIN">
              <AdminDashboard />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}