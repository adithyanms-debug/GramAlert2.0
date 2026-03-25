import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, Medal, Smile, CheckCircle2 } from "lucide-react";
import api from "../api";

interface PanchayatRanking {
    id: number;
    name: string;
    district: string;
    total_grievances: number;
    resolved_grievances: number;
    avg_sentiment: number;
    well_being_score: number;
}

export function PanchayatLeaderboard() {
    const [rankings, setRankings] = useState<PanchayatRanking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const res = await api.get("panchayats/rankings");
                setRankings(res.data);
            } catch (error) {
                console.error("Failed to fetch rankings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rankings.map((p, index) => {
                const isTopThree = index < 3;
                const rankColors = [
                    "bg-amber-100 border-amber-200 text-amber-700", // Gold
                    "bg-slate-100 border-slate-200 text-slate-500", // Silver
                    "bg-orange-100 border-orange-200 text-orange-700", // Bronze
                ];

                return (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4`}
                    >
                        {/* Rank Number / Icon */}
                        <div className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center font-bold text-lg 
                            ${isTopThree ? rankColors[index] : "bg-slate-50 text-slate-400 border border-slate-100"}`}
                        >
                            {index === 0 ? <Trophy className="size-5" /> :
                                index === 1 ? <Medal className="size-5" /> :
                                    index === 2 ? <Medal className="size-5" /> :
                                        index + 1}
                        </div>

                        {/* Name and Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-slate-800 truncate flex items-center gap-1">
                                    {p.name}
                                    <span className="text-[10px] font-normal text-slate-400 capitalize px-1.5 py-0.5 rounded bg-slate-50">
                                        {p.district}
                                    </span>
                                </h4>
                                <div className="text-sm font-black text-teal-600">
                                    {p.well_being_score}<span className="text-[10px] font-medium text-slate-400 ml-0.5">pts</span>
                                </div>
                            </div>

                            {/* Mini Stats Bar */}
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                    <Smile className={`size-3 ${p.avg_sentiment > 0 ? 'text-emerald-500' : 'text-rose-400'}`} />
                                    {p.avg_sentiment > 0 ? 'Positive' : p.avg_sentiment < 0 ? 'Negative' : 'Neutral'}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                    <CheckCircle2 className="size-3 text-teal-500" />
                                    {p.total_grievances > 0
                                        ? Math.round((p.resolved_grievances / p.total_grievances) * 100)
                                        : 0}% resolved
                                </span>
                            </div>

                            {/* Simple Progress Line */}
                            <div className="mt-2 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${p.well_being_score}%` }}
                                    className={`h-full rounded-full bg-gradient-to-r ${p.well_being_score > 70 ? "from-teal-500 to-emerald-400" :
                                        p.well_being_score > 40 ? "from-amber-400 to-orange-400" :
                                            "from-rose-400 to-red-500"
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Visual Enhancement for top rank */}
                        {index === 0 && (
                            <div className="absolute -top-1 -right-1">
                                <span className="flex h-3 w-3 shadow-sm">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

export default PanchayatLeaderboard;
