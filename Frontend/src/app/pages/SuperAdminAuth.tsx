import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Mail, Lock, ArrowLeft, Sparkles, Check, Crown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const features = [
  "Create & Manage Admins",
  "Full System Control",
  "Monitor All Activities",
  "Analytics & Reports",
];

export default function SuperAdminAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check credentials: superadmin@123 with password: password
    if (email === "superadmin@123" && password === "password") {
      setTimeout(() => {
        navigate("/superadmin");
      }, 800);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        alert("Invalid credentials. Try: superadmin@123 / password");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/4 -right-1/4 size-96 rounded-full bg-gradient-to-br from-purple-200/30 to-violet-200/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/4 -left-1/4 size-96 rounded-full bg-gradient-to-br from-violet-200/30 to-purple-200/30 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors group"
        >
          <motion.div whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 300 }}>
            <ArrowLeft className="size-5" />
          </motion.div>
          <span className="font-medium hidden sm:inline">Back to Home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-2xl border border-white/60">
          {/* Branding Side - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex relative bg-gradient-to-br from-purple-600 to-violet-600 p-8 lg:p-12 flex-col justify-between text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
            
            {/* Floating Icons Animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-10 size-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Crown className="size-8" />
            </motion.div>
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="size-7" />
                </div>
                <span className="text-3xl font-bold">GramAlert</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold mb-4 leading-tight"
              >
                Super Admin Portal
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-purple-50 text-lg leading-relaxed"
              >
                Complete control over the GramAlert system with administrator
                management and comprehensive oversight.
              </motion.p>
            </div>

            <div className="relative z-10 space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="size-5" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 md:p-12"
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="size-8 text-purple-600" />
                <h3 className="text-3xl font-bold text-slate-800">
                  Super Admin
                </h3>
              </div>
              <p className="text-slate-600">
                Access the supreme control panel
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superadmin@gramalert.com"
                    className="pl-11 h-12 bg-white/60 border-slate-200 focus:border-purple-500 focus:ring-purple-500 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-11 h-12 bg-white/60 border-slate-200 focus:border-purple-500 focus:ring-purple-500 transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer group">
                  <input type="checkbox" className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                  <span className="group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                  Forgot password?
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-lg relative overflow-hidden group"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="size-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span className="relative z-10">Sign In as Super Admin</span>
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200"
            >
              <p className="text-sm text-slate-700 text-center">
                <strong className="text-purple-700">Demo Credentials:</strong><br />
                Email: <code className="text-purple-600 font-mono">superadmin@123</code><br />
                Password: <code className="text-purple-600 font-mono">password</code>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}