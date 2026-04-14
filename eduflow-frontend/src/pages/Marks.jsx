import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  ClipboardList, 
  Search, 
  Plus, 
  MoreVertical, 
  TrendingUp, 
  Award,
  BookOpen,
  Filter,
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axiosConfig";
import { cn } from "../api/utils";

const Marks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    studentId:"", subject:"", marksObtained:0, totalMarks:100, examType:"MID_TERM", semester:"1"
  });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const studRes = await API.get("/api/students");
      setStudents(studRes.data);
      if (user.role === "STUDENT") {
        const me = studRes.data.find(s => s.email === user.email);
        if (me) {
          const res = await API.get(`/api/marks/student/${me.id}`);
          setMarks(res.data);
        }
      } else {
        const res = await API.get("/api/marks");
        setMarks(res.data);
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/api/marks", form);
      fetchData();
      setShowForm(false);
      setForm({studentId:"", subject:"", marksObtained:0, totalMarks:100, examType:"MID_TERM", semester:"1"});
    } catch(err) { 
      alert(err.response?.data?.error || "Error adding marks"); 
    } finally {
      setSubmitting(false);
    }
  };

  const role = user?.role || user?.user?.role;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        <Navbar title="Academic Performance" />

        <main className="p-8">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {(role === "TEACHER" || role === "ADMIN") && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <Plus size={20} />
                  Add Marks
                </button>
              )}
            </div>
          </div>

          {/* Add Marks Modal */}
          <AnimatePresence>
            {showForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                        <ClipboardList size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Record Academic Marks</h3>
                    </div>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleAdd} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Select Student</label>
                        <select 
                          required 
                          value={form.studentId}
                          onChange={e=>setForm({...form,studentId:e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        >
                          <option value="">Choose Student</option>
                          {students.map(s=>(<option key={s.id} value={s.id}>{s.name}</option>))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Subject Name</label>
                        <input 
                          required 
                          placeholder="e.g. Physics"
                          value={form.subject}
                          onChange={e=>setForm({...form,subject:e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Marks Obtained</label>
                        <input 
                          type="number" 
                          required 
                          placeholder="0"
                          value={form.marksObtained}
                          onChange={e=>setForm({...form,marksObtained:parseInt(e.target.value, 10) || 0})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Total Marks</label>
                        <input 
                          type="number" 
                          required 
                          placeholder="100"
                          value={form.totalMarks}
                          onChange={e=>setForm({...form,totalMarks:parseInt(e.target.value, 10) || 100})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Exam Type</label>
                        <select 
                          value={form.examType}
                          onChange={e=>setForm({...form,examType:e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        >
                          <option value="MID_TERM">Mid Term</option>
                          <option value="FINAL">Final Exam</option>
                          <option value="QUIZ">Quick Quiz</option>
                          <option value="ASSIGNMENT">Assignment</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Semester</label>
                        <input 
                          required 
                          placeholder="1"
                          value={form.semester}
                          onChange={e=>setForm({...form,semester:e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-8 flex gap-4">
                      <button 
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="flex-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : "Record Marks"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Marks Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                  <p className="text-slate-500 font-medium">Loading performance data...</p>
                </div>
              ) : marks.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-slate-200" size={40} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">No Academic Records</h4>
                  <p className="text-slate-500">Performance data will appear here once recorded.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Type</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {marks.map((m, idx) => {
                      const percentage = (m.marksObtained / m.totalMarks) * 100;
                      return (
                        <motion.tr 
                          key={m.id || idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                                {m.studentName?.charAt(0) || "S"}
                              </div>
                              <p className="text-sm font-bold text-slate-900">{m.studentName || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} className="text-slate-300" />
                              <span className="text-sm font-semibold text-slate-600">{m.subject}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1.5 w-32">
                              <div className="flex justify-between items-center text-xs font-bold">
                                <span className={cn(
                                  percentage >= 80 ? "text-emerald-600" : percentage >= 60 ? "text-indigo-600" : "text-rose-600"
                                )}>
                                  {m.marksObtained}/{m.totalMarks}
                                </span>
                                <span className="text-slate-400">{Math.round(percentage)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    percentage >= 80 ? "bg-emerald-500" : percentage >= 60 ? "bg-indigo-500" : "bg-rose-500"
                                  )}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider border border-slate-100">
                              {m.examType?.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-sm font-bold text-slate-900">SEM {m.semester}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Marks;
