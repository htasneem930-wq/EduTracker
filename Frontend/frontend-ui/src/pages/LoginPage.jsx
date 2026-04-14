import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Loader } from "lucide-react";
import api from "../api/axios";
import { saveUserSession } from "../utils/auth";

export default function LoginPage() {
  const nav = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "STUDENT",
  });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.email || !form.password) {
      setMsg("Please fill in all fields");
      setMsgType("error");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      if (isLogin) {
        const authHeader = btoa(`${form.email.trim()}:${form.password}`);
        const res = await api.post("/auth/signin", {}, {
          headers: {
            Authorization: `Basic ${authHeader}`
          }
        });
        if (res.data.success) {
          setMsg("Login successful! Redirecting...");
          setMsgType("success");
          saveUserSession({ ...res.data, email: form.email.trim() }, form.password);
          const role = res.data.role;
          setTimeout(() => {
            if (role === "ADMIN") nav("/admin");
            else if (role === "TEACHER") nav("/teacher");
            else nav("/student");
          }, 500);
        } else {
          setMsg(res.data.message || "Login failed. Check your credentials.");
          setMsgType("error");
        }
      } else {
        if (!form.name) {
          setMsg("Please fill in all fields");
          setMsgType("error");
          setLoading(false);
          return;
        }
        const res = await api.post("/auth/signup", {
          name: form.name,
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        });
        setMsg(res.data.message || "Registration completed");
        setMsgType(res.data.success ? "success" : "warning");
        if (res.data.success) {
          setTimeout(() => {
            setIsLogin(true);
            setForm({ email: "", password: "", name: "", role: "STUDENT" });
            setMsg("");
          }, 1500);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Connection error. Ensure backend is running on port 8080.";
      setMsg(errorMsg);
      setMsgType("error");
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Left side - Branding and illustration area */}
      <div style={styles.leftSide}>
        <div style={styles.brandBox}>
          <div style={styles.logoCircle}>
            <span style={styles.logoText}>ET</span>
          </div>
          <h1 style={styles.brandTitle}>EduTrack</h1>
          <p style={styles.brandDesc}>Modern Student Management System</p>
          <div style={styles.features}>
            <div style={styles.featureItem}>✓ Easy Management</div>
            <div style={styles.featureItem}>✓ Real-time Tracking</div>
            <div style={styles.featureItem}>✓ Secure & Simple</div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div style={styles.rightSide}>
        <div style={styles.card}>
          <h2 style={styles.formTitle}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p style={styles.formDesc}>
            {isLogin 
              ? "Sign in to access your dashboard" 
              : "Join EduTrack and manage education efficiently"}
          </p>

          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>
                <User size={16} style={{ marginRight: "6px" }} />
                Full Name
              </label>
              <input
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handle}
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>
              <Mail size={16} style={{ marginRight: "6px" }} />
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handle}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              <Lock size={16} style={{ marginRight: "6px" }} />
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handle}
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={styles.eyeBtn}
                title={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handle}
                style={{ ...styles.input, cursor: "pointer" }}
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          {msg && (
            <div style={{
              ...styles.alert,
              ...(msgType === "success" ? styles.successAlert : msgType === "warning" ? styles.warningAlert : styles.errorAlert)
            }}>
              {msg}
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <>
                <Loader size={18} style={{ animation: "spin 1s linear infinite", marginRight: "8px" }} />
                Loading...
              </>
            ) : isLogin ? "Sign In" : "Create Account"}
          </button>

          <div style={styles.divider}>
            <span>or</span>
          </div>

          <p style={styles.toggle}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              style={styles.link}
              onClick={() => { 
                setIsLogin(!isLogin);
                setMsg("");
                setForm({ email: "", password: "", name: "", role: "STUDENT" });
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>

          {isLogin && (
            <p style={styles.hint}>
              New to EduTrack? If a teacher added you, sign up using your email to set your password.
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus, select:focus {
          border-color: #aa3bff !important;
          box-shadow: 0 0 0 3px rgba(170, 59, 255, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
  },
  leftSide: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    color: "#fff",
  },
  brandBox: {
    textAlign: "center",
    animation: "slideIn 0.6s ease-out",
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
  },
  logoText: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#fff",
  },
  brandTitle: {
    fontSize: "42px",
    fontWeight: "700",
    margin: "0 0 8px",
    color: "#fff",
  },
  brandDesc: {
    fontSize: "16px",
    margin: "0 0 2rem",
    color: "rgba(255, 255, 255, 0.85)",
  },
  features: {
    textAlign: "left",
    display: "inline-block",
  },
  featureItem: {
    fontSize: "14px",
    margin: "8px 0",
    color: "rgba(255, 255, 255, 0.9)",
  },
  rightSide: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    padding: "3rem",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    animation: "slideIn 0.6s ease-out 0.1s both",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px",
    color: "#1a1a1a",
  },
  formDesc: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 2rem",
  },
  field: {
    marginBottom: "1.5rem",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.3s ease",
    background: "#f9f9f9",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 14px",
    paddingRight: "44px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.3s ease",
    background: "#f9f9f9",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justify: "center",
    transition: "color 0.2s",
  },
  alert: {
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "1rem",
    border: "1px solid",
    animation: "slideIn 0.3s ease-out",
  },
  successAlert: {
    background: "#f0f7f4",
    borderColor: "#2ecc71",
    color: "#27ae60",
  },
  errorAlert: {
    background: "#fff5f5",
    borderColor: "#e74c3c",
    color: "#c0392b",
  },
  warningAlert: {
    background: "#fffaf0",
    borderColor: "#f39c12",
    color: "#d68910",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  divider: {
    textAlign: "center",
    margin: "1.5rem 0",
    color: "#ccc",
    fontSize: "12px",
  },
  toggle: {
    textAlign: "center",
    fontSize: "13px",
    margin: "1rem 0 0",
    color: "#666",
  },
  link: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "600",
    transition: "color 0.2s",
  },
  hint: {
    fontSize: "12px",
    color: "#999",
    margin: "1rem 0 0",
    textAlign: "center",
    fontStyle: "italic",
  },
};