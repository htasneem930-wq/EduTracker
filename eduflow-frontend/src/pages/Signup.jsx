import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { useAuth } from "../context/useAuth";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  Shield, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "../api/utils";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/auth/register", form);
      login(res.data);
      const role = res.data.role || res.data.user?.role;

      if (role === "ADMIN") navigate("/admin");
      else if (role === "TEACHER") navigate("/teacher");
      else navigate("/student");

    } catch (err) {
      setError(err.response?.data?.error || "Error creating account. Email might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side: Visual */}
      <div className="hidden lg:block flex-1 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700" />
        
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-40 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center p-20 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 shadow-2xl max-w-lg"
          >
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Shield className="text-white" size={40} />
            </div>
            <h3 className="text-3xl font-bold mb-6">Join the Community</h3>
            <ul className="text-left space-y-4 mb-8">
              {[
                "Personalized learning dashboards",
                "Real-time progress tracking",
                "Instant attendance reports",
                "Secure data management"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-indigo-100">
                  <CheckCircle2 className="text-emerald-400" size={20} />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-indigo-200">Already 5,000+ students and teachers have joined us this month!</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10 bg-white"
      >
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10 group">
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EduTrack</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create an account</h2>
            <p className="text-slate-500 font-medium">Start your journey with EduTrack today.</p>
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

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                </div>
                <input 
                  type="text" 
                  name="name"
                  placeholder="John Doe"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@institution.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Create a password"
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  value={form.password}
                  onChange={handleChange}
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
              <label className="text-sm font-bold text-slate-700 ml-1">Account Role</label>
              <div className="grid grid-cols-3 gap-3">
                {["STUDENT", "TEACHER", "ADMIN"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={cn(
                      "py-3 rounded-2xl text-sm font-bold transition-all border",
                      form.role === role 
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    )}
                  >
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
