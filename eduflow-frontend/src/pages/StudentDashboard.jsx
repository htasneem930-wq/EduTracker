import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { 
  GraduationCap, 
  Calendar, 
  Trophy, 
  BookOpen, 
  FileText, 
  Download,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";
import API from "../api/axiosConfig";
import { cn } from "../api/utils";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(() => {
    const email = user?.email || user?.user?.email;
    if (!email) return null;
    return localStorage.getItem(`profile_${email}`) || null;
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRes = await API.get("/api/students");
        const myStudent = studentsRes.data.find(s => s.email === user.email);
        if (myStudent) {
          const res = await API.get(`/api/analytics/student/${myStudent.id}`);
          setAnalytics(res.data);
        } else {
          setAnalytics(null);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const performanceData = [
    { name: "Unit 1", score: 65 },
    { name: "Unit 2", score: 78 },
    { name: "Midterm", score: 72 },
    { name: "Unit 3", score: 85 },
    { name: "Unit 4", score: 80 },
    { name: "Finals", score: 92 },
  ];

  const attendanceData = [
    { name: "Present", value: analytics?.attendancePercentage || 85 },
    { name: "Absent", value: 100 - (analytics?.attendancePercentage || 85) },
  ];

  const COLORS = ["#6366f1", "#e2e8f0"];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        <Navbar title="Student Dashboard" />

        <main className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                <GraduationCap size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Hi, {user?.name || "Student"}! 👋</h2>
                <p className="text-slate-500 font-medium mt-2">You're doing great! Keep up the momentum.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-indigo-500">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-indigo-600">
                    {user?.name ? user.name.charAt(0) : "S"}
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
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
              <div className="p-2 bg-emerald-500 rounded-xl text-white">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider leading-none">Current Rank</p>
                <p className="text-lg font-black text-slate-900 mt-0.5">Top 5%</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard 
                title="Attendance" 
                value={`${Math.round(analytics.attendancePercentage || 0)}%`} 
                icon={<Calendar size={24} />} 
                color="indigo"
              />
              <StatCard 
                title="Avg. Marks" 
                value={`${Math.round(analytics.averageMarks || 0)}%`} 
                icon={<TrendingUp size={24} />} 
                color="purple"
              />
              <StatCard 
                title="Performance" 
                value={analytics.performanceStatus || "Good"} 
                icon={<Trophy size={24} />} 
                color="amber"
              />
              <StatCard 
                title="Total Subjects" 
                value={Object.keys(analytics.subjectMarks || {}).length || 0} 
                icon={<BookOpen size={24} />} 
                color="emerald"
              />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            {/* Main Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Performance Trends</h3>
                  <p className="text-sm text-slate-500 font-medium">Your academic journey this semester</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Score History
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#6366f1" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Attendance Pie */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center text-center"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">Attendance</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">Overview of your presence</p>
              
              <div className="relative w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-3xl font-black text-slate-900">{Math.round(analytics?.attendancePercentage || 0)}%</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Present</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Classes</p>
                  <p className="text-xl font-black text-slate-900">{analytics?.totalClasses || 0}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Days Present</p>
                  <p className="text-xl font-black text-slate-900">{analytics?.totalPresent || 0}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Subject Marks */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <BookOpen size={24} className="text-indigo-600" />
                Subject Performance
              </h3>
              <div className="space-y-6">
                {Object.entries(analytics?.subjectMarks || {}).map(([sub, marks], idx) => (
                  <div key={sub} className="group cursor-default">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">{sub}</span>
                      <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{marks}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${marks}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                          marks >= 80 ? "from-indigo-500 to-purple-500" : 
                          marks >= 60 ? "from-emerald-500 to-teal-500" : 
                          "from-amber-500 to-rose-500"
                        )}
                      />
                    </div>
                  </div>
                ))}
                {(!analytics?.subjectMarks || Object.keys(analytics.subjectMarks).length === 0) && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No subjects found yet.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Downloads & Reports */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <FileText size={120} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Reports & Documents</h3>
                <p className="text-slate-400 font-medium mb-10">Download your official academic records.</p>
                
                <div className="space-y-4">
                  {analytics?.studentId && (
                    <>
                      <a 
                        href={`${import.meta.env.VITE_API_URL}/api/pdf/marksheet/${analytics.studentId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-3xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-indigo-500 rounded-2xl">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="font-bold">Academic Marksheet</p>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">PDF • Download</p>
                          </div>
                        </div>
                        <Download size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                      </a>

                      <a 
                        href={`${import.meta.env.VITE_API_URL}/api/pdf/attendance/${analytics.studentId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-6 bg-white/10 hover:bg-white/20 border border-white/10 rounded-3xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500 rounded-2xl">
                            <Calendar size={24} />
                          </div>
                          <div>
                            <p className="font-bold">Attendance Report</p>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">PDF • Download</p>
                          </div>
                        </div>
                        <Download size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
