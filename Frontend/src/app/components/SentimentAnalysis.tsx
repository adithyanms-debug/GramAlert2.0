import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Smile, Frown, Meh, Info } from "lucide-react";
import api from "../api";

interface SentimentStat {
    panchayat_id: number;
    panchayat_name: string;
    avg_sentiment: number;
    total_grievances: number;
}

export function SentimentAnalysis() {
    const [stats, setStats] = useState<SentimentStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                const res = await api.get("superadmin/sentiment-stats");
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch sentiment stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSentiment();
    }, []);

    const getSentimentIcon = (score: number) => {
        if (score > 0.3) return <Smile className="text-emerald-500" />;
        if (score < -0.3) return <Frown className="text-rose-500" />;
        return <Meh className="text-amber-500" />;
    };

    const getSentimentLabel = (score: number) => {
        if (score > 0.3) return "Satisfied";
        if (score < -0.3) return "Frustrated";
        return "Neutral";
    };

    const getSentimentColor = (score: number) => {
        if (score > 0.3) return "bg-emerald-500";
        if (score < -0.3) return "bg-rose-500";
        return "bg-amber-500";
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading AI Sentiment Data...</div>;

    return (
        <div className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                        Community Sentiment Map
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700 font-bold uppercase tracking-wider">AI Powered</span>
                    </h3>
                    <p className="text-sm text-slate-600">
                        Real-time "mood" analysis based on grievance descriptions
                    </p>
                </div>
                <div className="bg-slate-100 p-2 rounded-lg flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1"><Smile className="size-3 text-emerald-500" /> Positive</div>
                    <div className="flex items-center gap-1"><Meh className="size-3 text-amber-500" /> Neutral</div>
                    <div className="flex items-center gap-1"><Frown className="size-3 text-rose-500" /> Negative</div>
                </div>
            </div>

            <div className="grid gap-6">
                {stats.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 flex flex-col items-center gap-2">
                        <Info className="size-8 text-slate-300" />
                        No AI data available yet. New grievances will be analyzed automatically.
                    </div>
                ) : (
                    stats.map((item, index) => (
                        <motion.div
                            key={item.panchayat_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800">{item.panchayat_name}</span>
                                    <span className="text-[10px] text-slate-400">({item.total_grievances} reports)</span>
                                </div>
                                <div className="flex items-center gap-2 font-medium">
                                    {getSentimentIcon(item.avg_sentiment)}
                                    <span className="text-slate-700">{getSentimentLabel(item.avg_sentiment)}</span>
                                </div>
                            </div>

                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                <div
                                    className={`h-full transition-all duration-1000 ${getSentimentColor(item.avg_sentiment)}`}
                                    style={{ width: `${Math.min(100, (Math.abs(item.avg_sentiment) + 0.1) * 100)}%` }}
                                />
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs flex gap-3">
                <Info className="size-5 shrink-0" />
                <p>
                    This dashboard uses <strong>AI Path Analysis</strong> to determine the underlying emotional state of report descriptions.
                    Lower scores indicate areas where community urgency and frustration are peaking, requiring immediate outreach.
                </p>
            </div>
        </div>
    );
}
