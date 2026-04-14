import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../api/utils";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Attendance Tracking",
      description: "Real-time attendance management with automated reporting and notifications.",
      icon: <CheckCircle2 className="text-indigo-500" size={24} />,
      gradient: "from-blue-500/10 to-indigo-500/10"
    },
    {
      title: "Performance Analytics",
      description: "Deep insights into student progress with interactive charts and trends.",
      icon: <BarChart3 className="text-purple-500" size={24} />,
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      title: "Role-based Access",
      description: "Secure, tailored dashboards for Administrators, Teachers, and Students.",
      icon: <ShieldCheck className="text-emerald-500" size={24} />,
      gradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
      title: "Reports & Insights",
      description: "Generate comprehensive performance reports and academic insights instantly.",
      icon: <Zap className="text-amber-500" size={24} />,
      gradient: "from-amber-500/10 to-orange-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EduTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Track Attendance
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-300 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
           
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Track. Analyze. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Improve Student Performance.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              The all-in-one education management system designed for modern institutions. 
              Empower teachers, engage students, and drive success with data-driven insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate("/signup")}
                className="group px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl"
              >
                Track Attendance Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              {/* secondary CTA removed as requested */}
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-slate-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">Joined by 10,000+ educators worldwide</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:opacity-100 transition-opacity opacity-0" />
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                alt="Dashboard Preview" 
                className="rounded-[1.8rem] w-full shadow-lg"
              />
              {/* Floating Stats Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Attendance</p>
                    <p className="text-2xl font-bold text-slate-900">94.8%</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-purple-50/70 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4">Powerful Features</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Everything you need to manage your institution efficiently
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              EduTrack brings all your academic data into one place, giving you the clarity and control you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br", feature.gradient)}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4">
              How it works
            </h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              Three simple steps to smarter student analytics
            </h3>
            <p className="text-lg text-slate-600">
              From onboarding your institute to tracking individual student journeys,
              EduTrack keeps everything in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Onboard your institute
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create admin, teacher, and student accounts in minutes. Import existing
                records or start fresh with EduTrack&apos;s simple setup.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Capture attendance & marks
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Teachers record attendance and assessments from one dashboard.
                Data flows instantly into analytics for real-time insights.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Monitor & improve outcomes
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Admins and teachers track trends, identify at-risk students, and share
                clear reports with parents and management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[80px]" />
          
          <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
            <div>
              <p className="text-5xl font-extrabold mb-4">500+</p>
              <p className="text-indigo-100 font-medium">Institutions Trust Us</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold mb-4">50k+</p>
              <p className="text-indigo-100 font-medium">Students Enrolled</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold mb-4">99%</p>
              <p className="text-indigo-100 font-medium">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-purple-50/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-bold uppercase tracking-wider text-sm mb-4">
              Loved by modern campuses
            </h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              Hear from institutions using EduTrack every day
            </h3>
            <p className="text-lg text-slate-600">
              Colleges and schools rely on EduTrack to unify academics, attendance,
              and performance into a single source of truth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                &quot;EduTrack has completely changed how we monitor performance. Our
                faculty finally has a live view of student progress across every
                subject.&quot;
              </p>
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-900">Dr. Meera Nair</p>
                <p className="text-xs text-slate-500">Dean, Horizon International College</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                &quot;Attendance dashboards give us instant clarity on at-risk
                students. We&apos;ve reduced dropouts and improved overall engagement.&quot;
              </p>
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-900">Rahul Verma</p>
                <p className="text-xs text-slate-500">Academic Coordinator, Skyline Public School</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                &quot;Students love the transparency. They can see marks, attendance,
                and reports from anywhere — it keeps everyone accountable.&quot;
              </p>
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-900">Anita Deshpande</p>
                <p className="text-xs text-slate-500">Principal, Lakeside Junior College</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
            Ready to transform your <br /> educational management?
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Join thousands of educators who are already using EduTrack to streamline their workflows.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate("/attendance")}
              className="px-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              Start Tracking Attendance
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-600 rounded-xl">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-slate-900">EduTrack</span>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-sm">
                Empowering education through data and analytics. Build a better future for your students today.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
            <p>© 2026 EduTrack Systems Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600">Twitter</a>
              <a href="#" className="hover:text-slate-600">LinkedIn</a>
              <a href="#" className="hover:text-slate-600">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
