import { motion } from "motion/react";
import { Link } from "react-router";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-[150px] font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent leading-none">
              404
            </h1>
            <Search className="absolute -top-4 -right-4 size-12 text-teal-500 animate-bounce" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 space-y-3"
        >
          <h2 className="text-3xl font-bold text-slate-800">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="size-5" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
          >
            <button onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="size-5" />
              Go Back
            </button>
          </Button>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <Link
              to="/villager"
              className="p-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium transition-colors"
            >
              Villager Dashboard
            </Link>
            <Link
              to="/admin"
              className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/superadmin"
              className="p-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors"
            >
              Super Admin
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
