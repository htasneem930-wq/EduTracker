import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { 
  Users, 
  CalendarCheck, 
  BarChart3, 
  Plus,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axiosConfig";
import { cn } from "../api/utils";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(() => {
    const email = user?.email || user?.user?.email;
    if (!email) return null;
    return localStorage.getItem(`profile_${email}`) || null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, attRes] = await Promise.all([
          API.get("/api/students"),
          API.get("/api/attendance"),
        ]);
        setStudents(studentsRes.data);
        setAttendance(attRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const presentCount = attendance.filter(a => a.status === "PRESENT").length;
  const attPct = attendance.length === 0 ? 0 :
    Math.round((presentCount / attendance.length) * 100);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const upcomingClasses = [
    { time: "09:00 AM", subject: "Mathematics", room: "Room 101", students: 45 },
    { time: "11:30 AM", subject: "Physics", room: "Lab 2", students: 38 },
    { time: "02:00 PM", subject: "Computer Science", room: "IT Center", students: 42 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        <Navbar title="Teacher Dashboard" />

        <main className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Hello, Professor! 👨‍🏫</h2>
              <p className="text-slate-500 font-medium mt-1">Manage your classes and track student progress with ease.</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-indigo-500">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-indigo-600">
                    {user?.name ? user.name.charAt(0) : "T"}
                  </span>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-600 cursor-pointer">
                  Set profile picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const result = reader.result;
                        if (typeof result === "string") {
                          setProfileImage(result);
                          const email = user?.email || user?.user?.email;
                          if (email) {
                            localStorage.setItem(`profile_${email}`, result);
                          }
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                <p className="text-[11px] text-slate-400">JPG or PNG, recommended under 2MB.</p>
              </div>
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <StatCard 
              title="My Students" 
              value={students.length} 
              icon={<Users size={24} />} 
              color="indigo"
            />
            <StatCard 
              title="Attendance Records" 
              value={attendance.length} 
              icon={<CalendarCheck size={24} />} 
              color="emerald"
            />
            <StatCard 
              title="Avg Attendance" 
              value={`${attPct}%`} 
              icon={<BarChart3 size={24} />} 
              color="purple"
            />
            <StatCard 
              title="Today's Classes" 
              value="3" 
              icon={<Clock size={24} />} 
              color="amber"
            />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link to="/attendance" className="group p-6 bg-indigo-50 rounded-3xl border border-indigo-100 hover:bg-indigo-600 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <CalendarCheck size={24} />
                    </div>
                    <p className="font-bold text-indigo-900 group-hover:text-white transition-colors">Mark Attendance</p>
                    <p className="text-xs text-indigo-600/70 group-hover:text-indigo-100 transition-colors mt-1">Record daily presence</p>
                  </Link>

                  <Link to="/marks" className="group p-6 bg-purple-50 rounded-3xl border border-purple-100 hover:bg-purple-600 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <BarChart3 size={24} />
                    </div>
                    <p className="font-bold text-purple-900 group-hover:text-white transition-colors">Enter Marks</p>
                    <p className="text-xs text-purple-600/70 group-hover:text-purple-100 transition-colors mt-1">Update student grades</p>
                  </Link>

                  <Link to="/students" className="group p-6 bg-emerald-50 rounded-3xl border border-emerald-100 hover:bg-emerald-600 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Users size={24} />
                    </div>
                    <p className="font-bold text-emerald-900 group-hover:text-white transition-colors">Student List</p>
                    <p className="text-xs text-emerald-600/70 group-hover:text-emerald-100 transition-colors mt-1">Manage student profiles</p>
                  </Link>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
              >
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Class Overview</h3>
                  <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    {students.slice(0, 4).map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{s.name}</p>
                            <p className="text-xs text-slate-500 font-medium">Last active: 2 hours ago</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">Active</p>
                          <p className="text-xs text-slate-400 font-medium">Course: {s.courseName || "CS"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-amber-500" />
                  Today's Schedule
                </h3>
                <div className="space-y-6">
                  {upcomingClasses.map((item, idx) => (
                    <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-100 before:rounded-full group hover:before:bg-indigo-500 transition-all">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.time}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">{item.subject}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} /> {item.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {item.students} Students
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
                  Full Schedule
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Announcement</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                  Keep your class data up to date: review attendance, marks and analytics before weekly meetings.
                </p>
                <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all">
                  Got it
                </button>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
