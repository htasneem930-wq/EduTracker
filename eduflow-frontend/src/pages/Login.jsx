import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import API from "../api/axiosConfig";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "../api/utils";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("STUDENT");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/auth/login", form);
      const role = res.data.role || res.data.user?.role;

      if (selectedRole && selectedRole !== role) {
        setError(
          `You selected ${selectedRole.toLowerCase()} role, but this account is registered as ${role.toLowerCase()}.`
        );
        return;
      }

      login(res.data);

      if (role === "ADMIN") navigate("/admin");
      else if (role === "TEACHER") navigate("/teacher");
      else navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side: Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10 bg-white"
      >
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12 group">
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EduTrack</span>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Welcome back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@institution.com"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Sign in as</label>
              <div className="grid grid-cols-3 gap-2">
                {["ADMIN", "STUDENT", "TEACHER"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "py-2 px-3 text-xs font-bold rounded-2xl border transition-all",
                      selectedRole === role
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
              />
              <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">Remember for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Right Side: Visual */}
      <div className="hidden lg:block flex-1 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center p-20 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 relative"
          >
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 shadow-2xl max-w-lg">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
                alt="Students" 
                className="rounded-[2rem] shadow-lg mb-8"
              />
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center">
                  {[1, 2, 3].map(i => (
                    <CheckCircle2 key={i} className="text-indigo-300" size={20} />
                  ))}
                </div>
                <h3 className="text-2xl font-bold">Trusted by Top Educators</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  "EduTrack has completely transformed how we manage student performance. The insights are invaluable."
                </p>
                <div className="pt-4">
                  <p className="font-bold">Dr. Sarah Jenkins</p>
                  <p className="text-xs text-indigo-200">Head of Academics, Global Heights</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">
              Attendance
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">
              Analytics
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">
              Reports
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
