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
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [grievances, setGrievances] = useState<any[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    received: "bg-amber-100 text-amber-700 border-amber-200",
    "in progress": "bg-blue-100 text-blue-700 border-blue-200",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200"
  };

  // Alert form state
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertCategory, setAlertCategory] = useState("emergency");
  const [alertSeverity, setAlertSeverity] = useState("medium");
  const [isSubmittingAlert, setIsSubmittingAlert] = useState(false);

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
    } catch (error) {
      console.error("Failed to fetch admin dashboard data", error);
      if (userName === "Loading...") setUserName("Administrator");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number | string, newStatus: string) => {
    try {
      const statusMap: Record<string, string> = {
        'received': 'Received',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'rejected': 'Rejected'
      };
      const formattedStatus = statusMap[newStatus] || newStatus;
      await api.patch(`grievances/${id}/status`, { status: formattedStatus });
      toast.success("Status updated successfully");
      
      // Update local state immediately
      setGrievances(prev =>
        prev.map(g =>
          g.id === id ? { ...g, status: formattedStatus } : g
        )
      );

      // Also update selected grievance if it's the one being modified
      if (selectedGrievance && (selectedGrievance.id === id)) {
        setSelectedGrievance({ ...selectedGrievance, status: formattedStatus });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAlert(true);
    try {
      await api.post('alerts', {
        title: alertTitle,
        message: alertMessage,
        category: alertCategory,
        severity: alertSeverity
      });
      setIsAlertModalOpen(false);
      setAlertTitle("");
      setAlertMessage("");
      toast.success("Alert broadcasted successfully!");
    } catch (error) {
      console.error("Failed to create alert", error);
      toast.error("Failed to create alert. Please try again.");
    } finally {
      setIsSubmittingAlert(false);
    }
  };

  const totalGrievances = grievances.length;
  const pending = grievances.filter(g => (g.status === 'Received' || !g.status)).length;
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

        {/* Alert Management */}
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
                <form onSubmit={handleCreateAlert} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Alert Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Water Supply Maintenance"
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Provide details about the alert..."
                      className="min-h-[100px]"
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select defaultValue="emergency" onValueChange={setAlertCategory}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Severity</Label>
                      <Select defaultValue="medium" onValueChange={setAlertSeverity}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsAlertModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={isSubmittingAlert}
                    >
                      {isSubmittingAlert ? "Broadcasting..." : "Broadcast Alert"}
                    </Button>
                  </div>
                </form>
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
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">No grievances found.</td>
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
                          <div className="flex items-center gap-2">
                            <Select
                              defaultValue={(grievance.status || "Received").toLowerCase().replace(" ", "-")}
                              onValueChange={(val) => handleStatusUpdate(grievance.id, val)}
                            >
                              <SelectTrigger className={`w-28 sm:w-36 h-8 text-xs font-semibold ${statusStyles[(grievance.status || "Received").toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="received">Received</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedGrievance(grievance)}
                                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-8 px-2"
                              >
                                <Eye className="size-4" />
                                <span className="hidden sm:inline ml-1">View</span>
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
      </div>

      <GrievanceDetailsDialog
        grievance={selectedGrievance}
        isOpen={!!selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
        isAdmin={true}
        onStatusChange={handleStatusUpdate}
      />
    </DashboardLayout>
  );
}