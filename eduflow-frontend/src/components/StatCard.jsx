import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { cn } from "../api/utils";

const StatCard = ({ title, value, icon, trend, color = "indigo" }) => {
  const colors = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200",
    purple: "from-purple-500 to-purple-600 shadow-purple-200",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200",
    amber: "from-amber-500 to-amber-600 shadow-amber-200",
    rose: "from-rose-500 to-rose-600 shadow-rose-200",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "relative overflow-hidden bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-3 rounded-2xl bg-gradient-to-br text-white shadow-lg",
          colors[color]
        )}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-full",
            trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>

      {/* Decorative background shape */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500 -z-10 opacity-50" />
    </motion.div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  trend: PropTypes.number,
  color: PropTypes.string,
};

export default StatCard;
