import { Link } from "react-router";
import { motion } from "motion/react";
import { Shield, FileText, ArrowLeft } from "lucide-react";

export default function AdminGrievances() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-colors mb-8"
        >
          <ArrowLeft className="size-5" />
          Back to Dashboard
        </Link>

        <div className="p-8 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-16 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
              <FileText className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">All Grievances</h1>
              <p className="text-slate-600">View and manage all submitted grievances</p>
            </div>
          </div>
          <p className="text-slate-600">This page is under construction. Full grievance management coming soon!</p>
        </div>
      </motion.div>
    </div>
  );
}
