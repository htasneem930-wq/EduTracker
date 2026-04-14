import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axiosConfig";
import { cn } from "../api/utils";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name:"", email:"", subject:"", phone:"", qualification:""
  });

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/teachers");
      setTeachers(res.data);
    } catch(e){ console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/api/teachers", form);
      setShowForm(false);
      setForm({name:"", email:"", subject:"", phone:"", qualification:""});
      fetchTeachers();
    } catch(err) { 
      alert(err.response?.data?.error || "Error adding teacher"); 
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await API.delete(`/api/teachers/${id}`);
      fetchTeachers();
    } catch (e) { alert("Error deleting teacher"); }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        <Navbar title="Faculty Directory" />

        <main className="p-8">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search faculty..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={20} />
                Filter
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Plus size={20} />
                Add Teacher
              </button>
            </div>
          </div>

          {/* Add Teacher Modal */}
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
                        <UserCheck size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Add Faculty Member</h3>
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
                        <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                        <input 
                          required 
                          placeholder="Dr. Sarah Jenkins"
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
                          placeholder="sarah@institution.com"
                          value={form.email}
                          onChange={e=>setForm({...form,email:e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Primary Subject</label>
                        <input 
                          required 
                          placeholder="e.g. Mathematics"
                          value={form.subject}
                          onChange={e=>setForm({...form,subject:e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                        <input 
                          required 
                          placeholder="+1 (555) 000-0000"
                          value={form.phone}
                          onChange={e=>setForm({...form,phone:e.target.value})}
                          className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Qualification</label>
                        <input 
                          required 
                          placeholder="e.g. Ph.D. in Pure Mathematics"
                          value={form.qualification}
                          onChange={e=>setForm({...form,qualification:e.target.value})}
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
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : "Save Faculty Member"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Teacher List Grid */}
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] shadow-sm">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
              <p className="text-slate-500 font-medium">Loading faculty members...</p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-[2.5rem] shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-slate-200" size={40} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">No Faculty Found</h4>
              <p className="text-slate-500">Add your first teacher to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100/50">
                      {t.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{t.name}</h3>
                    <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-6">
                      {t.subject}
                    </p>

                    <div className="w-full space-y-4 text-left">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <Mail size={16} />
                        </div>
                        <span className="text-sm font-medium truncate">{t.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <Phone size={16} />
                        </div>
                        <span className="text-sm font-medium">{t.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <GraduationCap size={16} />
                        </div>
                        <span className="text-sm font-medium line-clamp-1">{t.qualification}</span>
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-8">
                      <button className="flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all text-sm">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 transition-all text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Teachers;
