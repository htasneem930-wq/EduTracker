import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, roles } from '../utils/auth';
import { GraduationCap, UserPlus, Mail, Lock, User, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: roles.STUDENT
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await signup(formData);
    setLoading(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-box">
            <GraduationCap size={40} className="logo-icon" />
          </div>
          <h1>Create Account</h1>
          <p>Join the EduTrack learning platform</p>
        </div>

        {error && (
          <div className="message-banner error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="message-banner success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group">
            <label><User size={16} /> Full Name</label>
            <input 
              name="name"
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label><ShieldCheck size={16} /> Select Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="role-select">
              <option value={roles.STUDENT}>Student</option>
              <option value={roles.TEACHER}>Teacher</option>
              <option value={roles.ADMIN}>Administrator</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : (
              <>
                <UserPlus size={20} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>

      <style>{`
        .auth-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #f5f0ff 0%, #fff 100%); padding: 20px; }
        .auth-card { background: white; width: 100%; max-width: 480px; padding: 40px; border-radius: 24px; box-shadow: 0 8px 32px rgba(170, 59, 255, 0.12); text-align: center; }
        .auth-header h1 { font-size: 28px; margin: 16px 0 8px; color: #aa3bff; }
        .auth-header p { color: #64748b; margin-bottom: 32px; font-size: 15px; }
        .logo-box { width: 72px; height: 72px; background: #aa3bff1a; color: #aa3bff; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .auth-form { text-align: left; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
        .input-group input, .role-select { width: 100%; padding: 12px 16px; border: 1.5px solid #e8d9ff; border-radius: 12px; font-size: 16px; transition: all 0.2s; background: white; }
        .input-group input:focus, .role-select:focus { outline: none; border-color: #aa3bff; box-shadow: 0 0 0 4px #aa3bff1a; }
        .message-banner { display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: 12px; margin-bottom: 24px; font-size: 14px; text-align: left; }
        .message-banner.error { background: #fee2e2; color: #b91c1c; }
        .message-banner.success { background: #dcfce7; color: #15803d; }
        .auth-btn { width: 100%; padding: 14px; background: #aa3bff; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .auth-btn:hover:not(:disabled) { background: #9333ea; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-footer { margin-top: 24px; color: #64748b; font-size: 14px; }
        .auth-footer a { color: #aa3bff; font-weight: 600; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
        .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SignupPage;
