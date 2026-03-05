import { Link } from "react-router";
import { motion } from "motion/react";
import { FileText, Bell, BarChart3, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="size-8 sm:size-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
              <Shield className="size-5 sm:size-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
              GramAlert
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild className="text-sm sm:text-base">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-sm sm:text-base">
              <Link to="/auth">Register</Link>
            </Button>
          </div>
        </div>
      </header>

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

            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
              Transparent grievance reporting and real-time alerts connecting villagers
              with local administrators for efficient community management
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg w-full sm:w-auto">
                <Link to="/auth" className="gap-2">
                  Get Started
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/50 border-white/60 shadow-md w-full sm:w-auto">
                Learn More
              </Button>
            </div>
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
              <div className="relative p-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500" />
                  <div className="h-4 w-32 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60">
                      <div className="h-3 w-20 rounded-full bg-slate-200 mb-3" />
                      <div className="h-8 w-16 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
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
                  <div className={`size-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="size-7 text-white" />
                  </div>
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
              <CheckCircle2 className="size-12 sm:size-16 mx-auto" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Built on Trust & Transparency
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-teal-50 max-w-2xl mx-auto px-4">
                Every grievance is tracked, every action is recorded, and every citizen
                has a voice in building a better community
              </p>
              <Button size="lg" asChild className="bg-white text-teal-700 hover:bg-teal-50">
                <Link to="/auth">Join GramAlert Today</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="container mx-auto max-w-6xl text-center text-slate-600">
          <p>© 2026 GramAlert. Empowering communities through technology.</p>
        </div>
      </footer>
    </div>
  );
}