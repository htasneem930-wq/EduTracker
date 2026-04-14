import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, UserCheck,
  CalendarCheck, BarChart2, ClipboardList, LogOut,
  ChevronLeft, ChevronRight, GraduationCap, Settings
} from "lucide-react";
import { useState } from "react";
import { cn } from "../api/utils";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const role = user?.role || user?.user?.role;

  const links =
    role === "ADMIN"
      ? [
          { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
          { to: "/students", label: "Students", icon: <Users size={20} /> },
          { to: "/teachers", label: "Teachers", icon: <UserCheck size={20} /> },
          { to: "/attendance-dashboard", label: "Attendance Dashboard", icon: <CalendarCheck size={20} /> },
          { to: "/attendance", label: "Attendance", icon: <CalendarCheck size={20} /> },
          { to: "/marks", label: "Marks", icon: <ClipboardList size={20} /> },
          { to: "/analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
          { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
        ]
      : role === "TEACHER"
      ? [
          { to: "/teacher", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
          { to: "/students", label: "My Students", icon: <Users size={20} /> },
          { to: "/attendance-dashboard", label: "Attendance Dashboard", icon: <CalendarCheck size={20} /> },
          { to: "/attendance", label: "Attendance", icon: <CalendarCheck size={20} /> },
          { to: "/marks", label: "Marks", icon: <ClipboardList size={20} /> },
          { to: "/analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
          { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
        ]
      : role === "STUDENT"
      ? [
          { to: "/student", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
          { to: "/attendance", label: "My Attendance", icon: <CalendarCheck size={20} /> },
          { to: "/marks", label: "My Marks", icon: <ClipboardList size={20} /> },
          { to: "/analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
          { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
        ]
      : [];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-slate-800",
        isCollapsed ? "items-center" : "items-stretch"
      )}
    >
      {/* Logo Section */}
      <div className={cn("p-6 flex items-center justify-between", isCollapsed ? "justify-center" : "")}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-indigo-600 rounded-xl">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              EduTrack
            </span>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="p-2 bg-indigo-600 rounded-xl">
            <GraduationCap className="text-white" size={24} />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-indigo-600 text-white p-1 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} /> }
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                  : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              <span className={cn("transition-colors", isActive ? "text-indigo-400" : "group-hover:text-slate-200")}>
                {link.icon}
              </span>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium"
                >
                  {link.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed && (
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold text-white truncate">{user?.name || user?.user?.name || "User"}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{role || "Role"}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
