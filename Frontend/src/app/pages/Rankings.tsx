import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { PanchayatLeaderboard } from "../components/PanchayatLeaderboard";
import { Trophy, TrendingUp, Award } from "lucide-react";

export default function Rankings() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transform scale-150">
                        <Trophy size={120} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md w-fit text-xs font-bold uppercase tracking-wider"
                            >
                                <TrendingUp size={14} />
                                Live Performance Data
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                                Panchayat Leaderboard
                            </h2>
                            <p className="text-indigo-100 max-w-md">
                                Discover the top-performing villages based on community sentiment and administrative resolution efficiency.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
                            <div className="size-12 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg">
                                <Award className="text-indigo-900 size-7" />
                            </div>
                            <div>
                                <div className="text-xl font-black">Well-being Score</div>
                                <div className="text-xs text-indigo-100">Blended Performance index</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Rankings Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 md:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">Community Rankings</h3>
                            <p className="text-slate-500 text-sm">Sorted by highest well-being score</p>
                        </div>
                        <div className="hidden sm:block px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600">
                            Updated real-time
                        </div>
                    </div>

                    <PanchayatLeaderboard />
                </motion.div>

                {/* Information Card */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100">
                        <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                            <TrendingUp className="size-4" />
                            Resolution Power (50%)
                        </h4>
                        <p className="text-sm text-teal-700/80">
                            Calculated by the ratio of resolved grievances vs total reports submitted in that Panchayat.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                        <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                            <Trophy className="size-4" />
                            AI Sentiment (50%)
                        </h4>
                        <p className="text-sm text-purple-700/80">
                            Derived from an AI analysis of the citizen feedback tone. Positive keywords boost the score!
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
