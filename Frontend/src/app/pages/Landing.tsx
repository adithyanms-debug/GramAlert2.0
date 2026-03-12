import { Link } from "react-router";
import { motion } from "motion/react";
import { FileText, Bell, BarChart3, ArrowRight, CheckCircle2, Shield, User, UserCog, Crown, Users, TrendingUp, Lock, Zap } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Landing() {
  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-white/20"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          >
            <div className="size-8 sm:size-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center shadow-lg">
              <Shield className="size-5 sm:size-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
              GramAlert
            </span>
          </motion.div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Login
              </Button>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white/95 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl p-2 z-50"
              >
                <Link to="/auth">
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-slate-700"
                  >
                    <User className="size-4 text-teal-600" />
                    <span>Villager Login</span>
                  </motion.div>
                </Link>
                <Link to="/admin-auth">
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-slate-700"
                  >
                    <UserCog className="size-4 text-blue-600" />
                    <span>Admin Login</span>
                  </motion.div>
                </Link>
                <Link to="/superadmin-auth">
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-slate-700"
                  >
                    <Crown className="size-4 text-purple-600" />
                    <span>Super Admin</span>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-xs sm:text-sm shadow-lg">
                <Link to="/auth">Register</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-lg">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-teal-800">Empowering Communities</span>
              </div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Smart Community
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Governance
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Transparent grievance reporting and real-time alerts connecting villagers
              with local administrators for efficient community management
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg w-full sm:w-auto">
                  <Link to="/auth" className="gap-2">
                    Get Started
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToFeatures}
                  className="backdrop-blur-sm bg-white/50 border-white/60 shadow-md w-full sm:w-auto hover:bg-white/70"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Floating Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40">
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl" />
              <div className="relative p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                      <FileText className="size-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700">My Grievances</h3>
                      <p className="text-xs text-slate-500">Track and manage your reports</p>
                    </div>
                  </div>
                  <div className="size-10 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                    <Bell className="size-5 text-teal-600" />
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Grievances", count: "24", color: "from-teal-100 to-emerald-100" },
                    { label: "In Progress", count: "12", color: "from-blue-100 to-cyan-100" },
                    { label: "Resolved", count: "8", color: "from-emerald-100 to-teal-100" }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 cursor-pointer"
                    >
                      <p className="text-xs text-slate-600 mb-3">{stat.label}</p>
                      <div className={`h-10 w-16 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <span className="text-2xl font-bold text-slate-700">{stat.count}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* List Items */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{ x: 8, scale: 1.02 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/50 cursor-pointer"
                    >
                      <div className="size-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                        <div className="h-2 w-1/2 rounded-full bg-slate-100" />
                      </div>
                      <div className="size-8 rounded-lg bg-emerald-100" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/40 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Active Users", value: "2,500+" },
              { icon: FileText, label: "Grievances", value: "1,200+" },
              { icon: TrendingUp, label: "Resolution Rate", value: "87%" },
              { icon: Bell, label: "Alerts Sent", value: "5,000+" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 mb-4 shadow-lg"
                >
                  <stat.icon className="size-8 text-white" />
                </motion.div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600">
              Powerful features for transparent community governance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Submit Grievance",
                description: "Report issues with detailed information, images, and location for quick resolution",
                color: "from-teal-500 to-emerald-500",
              },
              {
                icon: BarChart3,
                title: "Track Status",
                description: "Monitor your grievances in real-time with transparent status updates and timeline",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Bell,
                title: "Receive Alerts",
                description: "Get instant notifications about community announcements and grievance updates",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="h-full p-8 rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-lg hover:shadow-xl transition-all">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`size-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="size-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-100 to-teal-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Secure & Reliable Platform
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Your data is protected with enterprise-grade security. Every action is logged and transparent.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: "End-to-end encryption" },
                  { icon: Shield, text: "Role-based access control" },
                  { icon: Zap, text: "Real-time sync & updates" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                      <item.icon className="size-5 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-500 p-12 shadow-2xl flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="size-full rounded-2xl border-4 border-white/30 flex items-center justify-center"
                >
                  <Shield className="size-32 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative z-10 text-center space-y-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="size-12 sm:size-16 mx-auto" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Built on Trust & Transparency
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-teal-50 max-w-2xl mx-auto px-4">
                Every grievance is tracked, every action is recorded, and every citizen
                has a voice in building a better community
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" asChild className="bg-white text-teal-700 hover:bg-teal-50">
                  <Link to="/auth">Join GramAlert Today</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-white/40">
        <div className="container mx-auto max-w-6xl text-center text-slate-600">
          <p>© 2026 GramAlert. Empowering communities through technology.</p>
        </div>
      </footer>
    </div>
  );
}