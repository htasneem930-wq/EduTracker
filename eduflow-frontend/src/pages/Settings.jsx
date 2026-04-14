import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { 
  User, 
  Lock, 
  Image as ImageIcon, 
  Save, 
  Loader2 
} from "lucide-react";
import API from "../api/axiosConfig";

const Settings = () => {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || user?.user?.name || "");
  const [email] = useState(user?.email || user?.user?.email || "");
  const [profileImage, setProfileImage] = useState(() => {
    const mail = user?.email || user?.user?.email;
    if (!mail) return null;
    return localStorage.getItem(`profile_${mail}`) || null;
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(user?.name || user?.user?.name || "");
  }, [user]);

  const emailKey = user?.email || user?.user?.email;

  const handleProfileSave = () => {
    setSavingProfile(true);
    setError("");
    setMessage("");
    try {
      const updated = { ...user, name };
      login(updated);
      if (emailKey && profileImage) {
        localStorage.setItem(`profile_${emailKey}`, profileImage);
      }
      setMessage("Profile updated successfully.");
    } catch (e) {
      setError("Error updating profile locally.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setError("");
    setMessage("");

    if (!emailKey) {
      setError("Missing user email.");
      setSavingPassword(false);
      return;
    }

    if (!oldPassword || !newPassword) {
      setError("Please fill both old and new password.");
      setSavingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setSavingPassword(false);
      return;
    }

    try {
      await API.post("/api/auth/change-password", {
        email: emailKey,
        oldPassword,
        newPassword,
      });
      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Error updating password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-all duration-300">
        <Navbar title="Account Settings" />

        <main className="p-8 max-w-4xl mx-auto space-y-8">
          {error && (
            <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
              {error}
            </div>
          )}
          {message && (
            <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
              {message}
            </div>
          )}

          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Profile</h2>
                <p className="text-sm text-slate-500">Update your name and profile picture</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-indigo-500">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-indigo-600">
                    {name ? name.charAt(0) : (user?.name || "U").charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Profile Image</label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-slate-800">
                      <ImageIcon size={16} />
                      <span>Upload Image</span>
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
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <p className="text-xs text-slate-400">JPG or PNG, recommended under 2MB.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-70"
                >
                  {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Profile</span>
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-900 rounded-2xl text-white">
                <Lock size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Security</h2>
                <p className="text-sm text-slate-500">Change your account password</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handlePasswordSave}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-70"
              >
                {savingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Update Password</span>
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Settings;

