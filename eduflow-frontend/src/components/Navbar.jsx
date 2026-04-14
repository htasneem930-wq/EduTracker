import PropTypes from "prop-types";
import { useAuth } from "../context/useAuth"; 
import { Bell, Search, User, ChevronDown, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const email = user?.email || user?.user?.email;
  const avatar = email ? localStorage.getItem(`profile_${email}`) : null;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        
        <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-2xl w-64 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 pl-2 group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">
              {user?.name || user?.user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {user?.role || user?.user?.role || "Role"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </motion.div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Navbar;
