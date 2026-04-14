import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axiosConfig";
import { cn } from "../api/utils";

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [form, setForm] = useState({
    studentId: "", date: new Date().toISOString().split("T")[0],
    status: "PRESENT", subject: ""
  });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [studRes, attRes] = await Promise.all([
        API.get("/api/students"),
        API.get("/api/attendance"),
      ]);
      setStudents(studRes.data);
      if (user.role === "STUDENT") {
        const me = studRes.data.find(s => s.email === user.email);
        if (me) {
          const res = await API.get(`/api/attendance/student/${me.id}`);
          setAttendance(res.data);
        }
      } else {
        setAttendance(attRes.data);
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMark = async (e) => {
    e.preventDefault();
    setMarking(true);
    try {
      await API.post("/api/attendance", form);
      fetchData();
      setForm({...form, studentId: "", subject: ""});
    } catch(err) { 
      alert(err.response?.data?.error || "Error marking attendance"); 
    } finally {
      setMarking(false);
    }
  };

  const role = user?.role || user?.user?.role;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        <Navbar title="Attendance Management" />

        <main className="p-8">
          {(role === "TEACHER" || role === "ADMIN") && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Mark New Attendance</h3>
                  <p className="text-sm text-slate-500 font-medium">Record student presence for a specific subject</p>
                </div>
              </div>

              <form onSubmit={handleMark} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Select Student</label>
                  <select 
                    required 
                    value={form.studentId}
                    onChange={e=>setForm({...form,studentId:e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Choose Student</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                  <input 
                    required 
                    placeholder="e.g. Mathematics"
                    value={form.subject}
                    onChange={e=>setForm({...form,subject:e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={form.date}
                    onChange={e=>setForm({...form,date:e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Status</label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setForm({...form, status: "PRESENT"})}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                        form.status === "PRESENT" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({...form, status: "ABSENT"})}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                        form.status === "ABSENT" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Absent
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={marking}
                  className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {marking ? <Loader2 className="animate-spin" size={20} /> : "Mark Now"}
                </button>
              </form>
            </motion.div>
          )}

          {/* Attendance History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Attendance Log</h3>
                <p className="text-sm text-slate-500 font-medium">History of all recorded attendance</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search logs..."
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                  <p className="text-slate-500 font-medium">Loading records...</p>
                </div>
              ) : attendance.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarCheck className="text-slate-200" size={40} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">No Attendance Records</h4>
                  <p className="text-slate-500">Records will appear here once they are marked.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendance.map((a, idx) => (
                      <motion.tr 
                        key={a.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                              {a.studentName?.charAt(0) || "S"}
                            </div>
                            <p className="text-sm font-bold text-slate-900">{a.studentName || "Unknown"}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-semibold text-slate-600">{a.subject}</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-900">
                          {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-5">
                          <button
                            type="button"
                            onClick={async () => {
                              const nextStatus = a.status === "PRESENT" ? "ABSENT" : "PRESENT";
                              try {
                                await API.post("/api/attendance", {
                                  studentId: a.studentId,
                                  date: a.date,
                                  subject: a.subject,
                                  status: nextStatus,
                                });
                                fetchData();
                              } catch (err) {
                                alert(err.response?.data?.error || "Error updating attendance");
                              }
                            }}
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold",
                              a.status === "PRESENT" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}
                          >
                            {a.status === "PRESENT" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                            {a.status}
                          </button>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {attendance.length > 0 && (
              <div className="p-6 bg-slate-50/30 text-center">
                <p className="text-sm text-slate-400 font-medium">Showing {attendance.length} records</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Attendance;
