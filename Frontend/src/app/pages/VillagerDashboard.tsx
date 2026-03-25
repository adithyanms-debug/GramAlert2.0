import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Clock, CheckCircle2, TrendingUp, FileText, Bell, Image as ImageIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";
import { SERVER_BASE_URL } from "../api";
import StatusBadge from "../components/StatusBadge";
import UpvoteButton from "../components/UpvoteButton";

export default function VillagerDashboard() {
  const [userName, setUserName] = useState("Loading...");
  const [grievances, setGrievances] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [isUpvoting, setIsUpvoting] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('users/me');
        if (userRes.data && userRes.data.username) {
          const name = userRes.data.username;
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
          setUserName(capitalized);
        }

        const grievRes = await api.get('grievances');
        if (grievRes.data) {
          setGrievances(grievRes.data);
        }

        const alertsRes = await api.get('alerts');
        if (alertsRes.data) {
          setAlerts(alertsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        if (userName === "Loading...") setUserName("Villager");
      }
    };
    fetchData();
  }, []);

  // Aggregate stats
  const totalGrievances = grievances.length;
  const inProgress = grievances.filter(g => g.status === 'In Progress').length;
  const resolved = grievances.filter(g => g.status === 'Resolved').length;

  const handleUpvote = async (grievanceId: string | number) => {
    if (isUpvoting === grievanceId) return;
    setIsUpvoting(grievanceId);
    try {
      const res = await api.post(`grievances/${grievanceId}/upvote`);
      setGrievances(prev =>
        prev.map(g =>
          g.id === grievanceId
            ? { ...g, upvote_count: res.data.upvote_count, has_upvoted: res.data.upvoted }
            : g
        )
      );
    } catch (error) {
      console.error("Failed to toggle upvote", error);
    } finally {
      setIsUpvoting(null);
    }
  };

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {userName}!</h2>
            <p className="text-teal-50 mb-4 text-sm sm:text-base">
              Stay updated with your grievances and community alerts
            </p>
            <Button asChild className="bg-white text-teal-700 hover:bg-teal-50 w-full sm:w-auto">
              <Link to="/villager/submit">Submit New Grievance</Link>
            </Button>
          </div>
        </motion.div>

        {/* Alerts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="size-6 text-teal-600" />
              Recent Alerts
            </h3>
            <Link to="/villager/alerts" className="text-sm text-teal-600 hover:text-teal-700">
              View All
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {alerts.length === 0 ? (
              <p className="text-slate-500 py-4">No active alerts at the moment.</p>
            ) : (
              alerts.slice(0, 5).map((alert, index) => {
                const colors = {
                  critical: "from-red-600 to-rose-700",
                  high: "from-red-500 to-rose-500",
                  medium: "from-amber-500 to-orange-500",
                  low: "from-blue-500 to-cyan-500",
                  info: "from-blue-500 to-cyan-500",
                };

                const severity = (alert.severity || "info").toLowerCase();

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="flex-shrink-0 w-80 p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`size-10 rounded-lg bg-gradient-to-br ${colors[severity as keyof typeof colors] || colors.info} flex items-center justify-center`}>
                        <Bell className="size-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{alert.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{new Date(alert.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {alert.description}
                    </p>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              label: "Total Grievances",
              value: totalGrievances,
              color: "from-blue-500 to-cyan-500",
              change: "All time",
            },
            {
              icon: Clock,
              label: "In Progress",
              value: inProgress,
              color: "from-amber-500 to-orange-500",
              change: "Needs attention",
            },
            {
              icon: CheckCircle2,
              label: "Resolved",
              value: resolved,
              color: "from-emerald-500 to-teal-500",
              change: totalGrievances > 0 ? (resolved / totalGrievances * 100).toFixed(0) + "% success rate" : "No data",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Grievances */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Recent Grievances</h3>
            <Link to="/villager/grievances" className="text-sm text-teal-600 hover:text-teal-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {grievances.length === 0 ? (
              <div className="text-center p-8 bg-white/50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">You haven't submitted any grievances yet.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/villager/submit">Submit One Now</Link>
                </Button>
              </div>
            ) : (
              grievances.map((grievance, index) => {
                const gStatus = grievance.status || "Received";

                return (
                  <motion.div
                    key={grievance.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="p-4 sm:p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Upvote Column */}
                        <UpvoteButton
                          grievanceId={grievance.id}
                          upvoteCount={grievance.upvote_count || 0}
                          hasUpvoted={grievance.has_upvoted}
                          onVote={handleUpvote}
                        />

                        {/* Thumbnail */}
                        <div className="size-16 hidden sm:flex shrink-0 rounded-lg bg-slate-100 items-center justify-center overflow-hidden border border-slate-200">
                          {grievance.file_url ? (
                            <img
                              src={`${SERVER_BASE_URL}${grievance.file_url}`}
                              alt=""
                              className="size-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="size-full bg-slate-100 flex items-center justify-center"><svg class="size-6 text-slate-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                              }}
                            />
                          ) : (
                            <ImageIcon className="size-6 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <span className="text-xs sm:text-sm font-mono text-slate-500">
                              GRV-{grievance.id}
                            </span>
                            <StatusBadge status={gStatus} />
                          </div>
                          <h4 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base">
                            {grievance.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                            <span className="capitalize">{grievance.category}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{new Date(grievance.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-teal-600 hover:text-teal-700 font-medium text-xs sm:text-sm self-start sm:self-center shrink-0"
                        onClick={() => setSelectedGrievance(grievance)}
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <GrievanceDetailsDialog
        grievance={selectedGrievance}
        isOpen={!!selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
      />
    </DashboardLayout>
  );
}