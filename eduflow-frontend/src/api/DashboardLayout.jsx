import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Users, GraduationCap, CalendarCheck, BarChart3, LogOut, BookOpen } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = {
    ADMIN: [
      { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/admin/users", label: "User Management", icon: <Users size={20} /> },
      { to: "/admin/classes", label: "Classes & Subjects", icon: <BookOpen size={20} /> },
    ],
    TEACHER: [
      { to: "/teacher", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/teacher/marks", label: "Marks Entry", icon: <BarChart3 size={20} /> },
      { to: "/teacher/attendance", label: "Attendance", icon: <CalendarCheck size={20} /> },
    ],
    STUDENT: [
      { to: "/student", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      { to: "/student/report", label: "Report Card", icon: <BookOpen size={20} /> },
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">🎓 EduFlow</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {currentMenu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.to ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;