import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Bell,
  UserPlus,
  Crown,
  Trash2,
  Loader2,
} from "lucide-react";
import { SentimentAnalysis } from "../components/SentimentAnalysis";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import api from "../api";
import { toast } from "sonner";

interface Admin {
  id: string | number;
  username: string;
  email: string;
  created_at: string;
  status?: string;
}

interface Stats {
  totalAdmins: number;
  totalGrievances: number;
  activeAlerts: number;
  uptime: string;
}

interface GrievanceStat {
  category: string;
  total: number;
  pending: number;
  resolved: number;
}

export default function SuperAdminDashboard() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [grievanceStats, setGrievanceStats] = useState<GrievanceStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [panchayats, setPanchayats] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    panchayat_id: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [adminsRes, statsRes, gStatsRes] = await Promise.all([
        api.get("superadmin/admins"),
        api.get("superadmin/stats"),
        api.get("superadmin/grievance-stats"),
      ]);
      setAdmins(adminsRes.data);
      setStats(statsRes.data);
      setGrievanceStats(gStatsRes.data);
    } catch (error: any) {
      toast.error("Failed to fetch dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch panchayats for dropdown
    api.get("panchayats").then(res => setPanchayats(res.data || [])).catch(() => { });
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.post("superadmin/admins", {
        ...formData,
        panchayat_id: parseInt(formData.panchayat_id),
      });
      toast.success("Administrator created successfully");
      setIsAdminModalOpen(false);
      setFormData({ username: "", email: "", password: "", panchayat_id: "" });
      fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create administrator";
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAdmin = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this administrator?")) return;

    try {
      await api.delete(`superadmin/admins/${id}`);
      toast.success("Administrator deleted successfully");
      fetchData();
    } catch (error: any) {
      toast.error("Failed to delete administrator");
    }
  };

  if (isLoading && !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-8 text-purple-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              icon: Users,
              label: "Total Admins",
              value: stats?.totalAdmins || "0",
              color: "from-purple-500 to-violet-500",
              change: "Active in system",
            },
            {
              icon: FileText,
              label: "All Grievances",
              value: stats?.totalGrievances || "0",
              color: "from-blue-500 to-indigo-500",
              change: "Total submitted",
            },
            {
              icon: Clock,
              label: "System Uptime",
              value: stats?.uptime || "99.9%",
              color: "from-emerald-500 to-teal-500",
              change: "Last 30 days",
            },
            {
              icon: Bell,
              label: "Active Alerts",
              value: stats?.activeAlerts || "0",
              color: "from-amber-500 to-orange-500",
              change: "Currently live",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`size-10 sm:size-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="size-5 sm:size-6 text-white" />
                </div>
                <TrendingUp className="size-4 sm:size-5 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mb-1 sm:mb-2">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Admin Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                Administrator Management
              </h3>
              <p className="text-sm text-slate-600">
                Create and manage system administrators
              </p>
            </div>
            <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 w-full sm:w-auto">
                  <UserPlus className="size-5 mr-2" />
                  Create Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/60">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Crown className="size-5 text-purple-600" />
                    Create New Administrator
                  </DialogTitle>
                  <DialogDescription>
                    Add a new administrator to manage community grievances
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={handleCreateAdmin}>
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Full Name / Username</Label>
                    <Input
                      id="admin-name"
                      required
                      placeholder="Enter administrator name"
                      className="bg-white/80"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      required
                      placeholder="admin@gramalert.com"
                      className="bg-white/80"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Initial Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      required
                      placeholder="Enter temporary password"
                      className="bg-white/80"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-panchayat">Assign Panchayat</Label>
                    <Select
                      value={formData.panchayat_id}
                      onValueChange={(val) => setFormData({ ...formData, panchayat_id: val })}
                    >
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select panchayat" />
                      </SelectTrigger>
                      <SelectContent>
                        {panchayats.map((p: any) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.name} — {p.district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  >
                    {isCreating ? (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="size-4 mr-2" />
                    )}
                    Create Administrator
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden lg:table-cell">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No administrators found
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin, index) => (
                      <motion.tr
                        key={admin.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs sm:text-sm text-slate-600">
                            ADM-{admin.id}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-xs sm:text-sm text-slate-800">
                            {admin.username}
                          </p>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className="text-xs sm:text-sm text-slate-600">
                            {admin.email}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <span className="text-xs sm:text-sm text-slate-600">
                            {new Date(admin.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                onClick={() => handleDeleteAdmin(admin.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Community Sentiment Analysis */}
        <SentimentAnalysis />


        {/* Grievance Overview by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
              Grievance Overview by Category
            </h3>
            <p className="text-sm text-slate-600">
              System-wide grievance statistics across all zones
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {grievanceStats.length === 0 ? (
              <div className="col-span-full py-8 text-center text-slate-500">
                No grievance statistics available
              </div>
            ) : (
              grievanceStats.map((stat, index) => (
                <motion.div
                  key={stat.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-white/60 to-white/40 border border-white/60 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="size-5 text-purple-600" />
                    <span className="text-2xl font-bold text-slate-800">{stat.total}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2 capitalize">{stat.category}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-600 flex items-center gap-1">
                      <Clock className="size-3" />
                      {stat.pending} Pending
                    </span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      {stat.resolved} Done
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
