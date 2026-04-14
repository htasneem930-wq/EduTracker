import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Mail, 
  BookOpen, 
  Filter,
  Loader2,
  CheckCircle2,
  X,
  Download,
  FileText,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axiosConfig";
import { cn } from "../api/utils";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name:"", email:"", courseName:""
  });
  const apiBase = import.meta.env.VITE_API_URL;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/students");
      setStudents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.trim()) {
      try {
        const res = await API.get(`/api/students/search?name=${encodeURIComponent(val)}`);
        setStudents(res.data);
      } catch (e) { console.error(e); }
    } else { fetchStudents(); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const password = Math.random().toString(36).slice(-8) + "1!";

      const res = await API.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password,
        role: "STUDENT",
      });

      await API.post("/api/students", {
        name: form.name,
        email: form.email,
        userId: res.data.id,
        courseName: form.courseName || "",
      });

      alert(`Student account created successfully!\nEmail: ${form.email}\nTemporary Password: ${password}`);

      setShowForm(false);
      setForm({name:"", email:"", courseName:""});
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding student. Email may already exist.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await API.delete(`/api/students/${id}`);
      fetchStudents();
    } catch (e) { alert("Error deleting student"); }
  };

  const handleDownloadAllMarks = () => {
    if (!apiBase) return;
    window.open(`${apiBase}/api/pdf/marksheet/all`, "_blank");
  };

  const handleDownloadAllAttendance = () => {
    if (!apiBase) return;
    window.open(`${apiBase}/api/pdf/attendance/all`, "_blank");
  };

  const handleDownloadStudentMarks = (id) => {
    if (!apiBase) return;
    window.open(`${apiBase}/api/pdf/marksheet/${id}`, "_blank");
  };

  const handleDownloadStudentAttendance = (id) => {
    if (!apiBase) return;
    window.open(`${apiBase}/api/pdf/attendance/${id}`, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        <Navbar title="Student Directory" />

        <main className="p-8">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={search}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownloadAllMarks}
                className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-[1.5rem] text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <FileText size={18} />
                Marks PDF
              </button>
              <button 
                onClick={handleDownloadAllAttendance}
                className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-[1.5rem] text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <Calendar size={18} />
                Attendance PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={20} />
                Filter
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Plus size={20} />
                Add Student
              </button>
            </div>
          </div>

          {/* Add Student Modal */}
          <AnimatePresence>
            {showForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                        <Users size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Add New Student</h3>
                    </div>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleAdd} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input 
                        required 
                        placeholder="e.g. John Doe"
                        value={form.name}
                        onChange={e=>setForm({...form,name:e.target.value})}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@institution.com"
                        value={form.email}
                        onChange={e=>setForm({...form,email:e.target.value})}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Course / Major</label>
                      <input 
                        required 
                        placeholder="e.g. Computer Science"
                        value={form.courseName}
                        onChange={e=>setForm({...form,courseName:e.target.value})}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
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
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Student List Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                  <p className="text-slate-500 font-medium">Fetching students...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-slate-200" size={40} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">No Students Found</h4>
                  <p className="text-slate-500">Try adjusting your search or add a new student.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Profile</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Number</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((s, idx) => (
                      <motion.tr 
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg group-hover:scale-110 transition-transform shadow-sm shadow-indigo-100">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{s.name}</p>
                              <div className="flex items-center gap-2 text-slate-400">
                                <Mail size={12} />
                                <p className="text-xs font-medium">{s.email}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-slate-300" />
                            <span className="text-sm font-semibold text-slate-600">{s.courseName || s.course || "General"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-slate-900">
                          #{s.rollNumber || `2026-${s.id}`}
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDownloadStudentMarks(s.id)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => handleDownloadStudentAttendance(s.id)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            >
                              <Calendar size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(s.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {students.length > 0 && (
              <div className="p-8 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Showing {students.length} students
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Next</button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Students;
