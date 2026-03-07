import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Mail, Lock, User, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../api";
const features = [
  "Secure & Private",
  "Role-Based Access",
  "Real-time Notifications",
  "24/7 Support",
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await api.post("/auth/login", { username: email, password });
      } else {
        // Backend register expects: username, email, password, phone
        response = await api.post("/auth/register", {
          username: name.replace(/\s+/g, '').toLowerCase() || email.split('@')[0],
          email,
          password,
          phone: "0000000000" // Default as front-end has no phone field
        });
      }

      // Store token
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.removeItem("isDemoMode");
      }

      // Redirect on success
      navigate("/villager");
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMsg(error.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/admin");
    }, 800);
  };

  const handleVillagerDemo = () => {
    setIsLoading(true);
    localStorage.setItem("isDemoMode", "true");
    localStorage.setItem("token", "demo-token");
    setTimeout(() => {
      navigate("/villager");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center p-6 relative overflow-hidden">
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
          className="absolute -top-1/4 -right-1/4 size-96 rounded-full bg-gradient-to-br from-teal-200/30 to-emerald-200/30 blur-3xl"
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
          className="absolute -bottom-1/4 -left-1/4 size-96 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors group"
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
            className="hidden md:flex relative bg-gradient-to-br from-teal-600 to-emerald-600 p-8 lg:p-12 flex-col justify-between text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />

            {/* Floating Icons Animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-10 size-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Sparkles className="size-8" />
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
                Welcome to Smart Governance
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-teal-50 text-lg leading-relaxed"
              >
                Your voice matters. Report grievances, track resolutions, and stay
                informed with real-time community alerts.
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
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h3>
                <p className="text-slate-600">
                  {isLogin
                    ? "Enter your credentials to access your account"
                    : "Register to start reporting and tracking grievances"}
                </p>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                    <motion.div
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      className="relative"
                    >
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="pl-11 h-12 bg-white/60 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition-all"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-11 h-12 bg-white/60 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition-all"
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-11 h-12 bg-white/60 border-slate-200 focus:border-teal-500 focus:ring-teal-500 transition-all"
                  />
                </div>
              </motion.div>

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100"
                >
                  {errorMsg}
                </motion.div>
              )}

              {isLogin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer group">
                    <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <span className="group-hover:text-slate-800 transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
                    Forgot password?
                  </a>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-lg relative overflow-hidden group"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="size-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span className="relative z-10">{isLogin ? "Sign In" : "Create Account"}</span>
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

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm text-slate-600"
              >
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <motion.button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  {isLogin ? "Register" : "Sign In"}
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100"
            >
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                <strong className="text-teal-700">Demo Access:</strong> Try the platform instantly
              </p>
              <div className="flex gap-2">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleVillagerDemo}
                    disabled={isLoading}
                    className="w-full border-teal-300 hover:bg-teal-50"
                  >
                    Demo as Villager
                  </Button>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAdminDemo}
                    disabled={isLoading}
                    className="w-full border-emerald-300 hover:bg-emerald-50"
                  >
                    Demo as Admin
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}