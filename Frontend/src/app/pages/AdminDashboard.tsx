import { useState, useEffect } from "react";
import api from "../api";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
import { Textarea } from "../components/ui/textarea";

export default function AdminDashboard() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [grievances, setGrievances] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const userRes = await api.get('/users/me');
      if (userRes.data && userRes.data.username) {
        const name = userRes.data.username;
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        setUserName(capitalized);
      }

      const grievRes = await api.get('/grievances');
      if (grievRes.data) {
        setGrievances(grievRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin dashboard data", error);
      if (userName === "Loading...") setUserName("Administrator");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      // Map UI values back to DB values if needed (Received, In Progress, Resolved)
      const statusMap: Record<string, string> = {
        'received': 'Received',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
      };
      await api.patch(`/grievances/${id}/status`, { status: statusMap[newStatus] || newStatus });
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const totalGrievances = grievances.length;
  const pending = grievances.filter(g => g.status === 'Received').length;
  const inProgress = grievances.filter(g => g.status === 'In Progress').length;
  const resolved = grievances.filter(g => g.status === 'Resolved').length;

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-6 sm:space-y-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
              label: "Pending Review",
              value: pending,
              color: "from-amber-500 to-orange-500",
              change: "Need attention",
            },
            {
              icon: AlertCircle,
              label: "In Progress",
              value: inProgress,
              color: "from-purple-500 to-pink-500",
              change: "Being resolved",
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

        {/* Alert Management placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">Alert Management</h3>
              <p className="text-sm text-slate-600">Broadcast important announcements to villagers</p>
            </div>
            <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 w-full sm:w-auto">
                  <Plus className="size-5 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/60">
                <DialogHeader>
                  <DialogTitle>Create New Alert</DialogTitle>
                  <DialogDescription>Broadcast an important message to all villagers</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-slate-500">Alert generation is currently managed via the database or future Alert Management page.</p>
                </div>
                <Button onClick={() => setIsAlertModalOpen(false)}>Close</Button>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Grievances Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">Recent Grievances</h3>
            <p className="text-sm text-slate-600">Manage and update grievance statuses</p>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">ID</th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">Title</th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden md:table-cell">Category</th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden lg:table-cell">Submitted By</th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">No grievances found.</td>
                    </tr>
                  ) : (
                    grievances.map((grievance, index) => (
                      <motion.tr
                        key={grievance.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                      >
                        <td className="py-4 px-4"><span className="font-mono text-xs sm:text-sm text-slate-600">GRV-{grievance.id}</span></td>
                        <td className="py-4 px-4"><p className="font-medium text-xs sm:text-sm text-slate-800 line-clamp-2">{grievance.title}</p></td>
                        <td className="py-4 px-4 hidden md:table-cell"><span className="text-xs sm:text-sm text-slate-600 capitalize">{grievance.category}</span></td>
                        <td className="py-4 px-4 hidden lg:table-cell"><span className="text-xs sm:text-sm text-slate-600">{grievance.submitted_by}</span></td>
                        <td className="py-4 px-4 hidden sm:table-cell"><span className="text-xs sm:text-sm text-slate-600">{new Date(grievance.created_at).toLocaleDateString()}</span></td>
                        <td className="py-4 px-4">
                          <Select
                            defaultValue={grievance.status.toLowerCase().replace(" ", "-")}
                            onValueChange={(val) => handleStatusUpdate(grievance.id, val)}
                          >
                            <SelectTrigger className="w-24 sm:w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="received">Received</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
