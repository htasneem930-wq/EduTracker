import React, { useState, useEffect } from "react";
import API from "./axiosConfig";
import { Users, GraduationCap, BookOpen, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, passRate: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/api/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Students", value: stats.totalStudents, icon: <GraduationCap />, color: "bg-blue-500" },
    { label: "Total Teachers", value: stats.totalTeachers, icon: <Users />, color: "bg-purple-500" },
    { label: "Pass Rate", value: `${stats.passRate}%`, icon: <CheckCircle />, color: "bg-green-500" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-lg text-white ${card.color}`}>{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Class-wise Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
