import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { Mail, KeyRound, Shield, ArrowLeft, Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post(`/api/auth/forgot-password?email=${email}`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/api/auth/reset-password", { email, otp, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-xl border border-purple-100 overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white/20 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-100">
                Secure Reset
              </p>
              <p className="text-lg font-bold">Protecting your EduTrack account</p>
            </div>
          </div>
          <p className="text-sm text-indigo-100 leading-relaxed mb-6">
            We use email verification to make sure it&apos;s really you. Enter your
            registered email, verify the OTP, and choose a strong new password.
          </p>
          <ul className="space-y-3 text-xs text-indigo-100">
            <li>• Never share your OTP with anyone.</li>
            <li>• Use at least 8 characters with letters and numbers.</li>
            <li>• Avoid using the same password across multiple sites.</li>
          </ul>
        </div>

        <div className="p-8 md:p-10">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-6"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Forgot your password?
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {step === 1
              ? "Enter your registered email address and we’ll send you a one-time code."
              : "Enter the OTP sent to your email and choose a new password."}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={sendOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@institution.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  One-Time Passcode
                </label>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                  </div>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Reset Password"}
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-slate-500 text-center">
            Remembered your password?{" "}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
