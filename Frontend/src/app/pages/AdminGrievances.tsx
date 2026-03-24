import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import api from "../api";
import {
  Eye,
  MessageSquare,
  Download,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";
import { toast } from "sonner";
import StatusBadge from "../components/StatusBadge";

export default function AdminGrievances() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [escalationMap, setEscalationMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const [grievanceRes, escalationRes] = await Promise.all([
        api.get("grievances"),
        api.get("escalations").catch(() => ({ data: [] })),
      ]);
      setGrievances(grievanceRes.data);

      // Build a map of grievance_id -> escalations[]
      const map: Record<string, any[]> = {};
      for (const esc of escalationRes.data) {
        if (!map[esc.grievance_id]) map[esc.grievance_id] = [];
        map[esc.grievance_id].push(esc);
      }
      setEscalationMap(map);
    } catch (error) {
      console.error("Failed to fetch grievances", error);
      toast.error("Could not load grievances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleViewDetails = async (grievance: any) => {
    try {
      const res = await api.get(`grievances/${grievance.id}`);
      setSelectedGrievance(res.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch grievance details", error);
      toast.error("Could not load grievance details");
    }
  };

  const handleStatusChange = async (id: number | string, newStatus: string) => {
    try {
      await api.patch(`grievances/${id}/status`, { status: newStatus });
      toast.success(`Grievance status updated to ${newStatus}`);

      // Update local state immediately
      setGrievances(prev =>
        prev.map(g =>
          g.id === id ? { ...g, status: newStatus } : g
        )
      );

      // Also update selected grievance if it's the one being modified
      if (selectedGrievance && selectedGrievance.id === id) {
        setSelectedGrievance({ ...selectedGrievance, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  const handleAddComment = async (id: number | string) => {
    try {
      // Fetch the updated grievance to show new comments in dialog
      const res = await api.get(`grievances/${id}`);
      setSelectedGrievance(res.data);
      fetchGrievances(); // Refresh list
    } catch (error) {
      console.error("Failed to refresh grievance after comment", error);
    }
  };

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch =
      g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id?.toString().includes(searchQuery);

    const matchesStatus = filterStatus === "all"
      ? true
      : filterStatus === "Escalated"
        ? !!escalationMap[g.id]
        : g.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesCategory = filterCategory === "all" || g.category?.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="size-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search grievances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="drainage">Drainage</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="water supply">Water Supply</SelectItem>
                <SelectItem value="road maintenance">Road Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="bg-white/80">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Grievances Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                All Grievances
              </h3>
              <p className="text-sm text-slate-600">
                Showing {filteredGrievances.length} grievances
              </p>
            </div>
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
                      Title
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden lg:table-cell">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden xl:table-cell">
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden md:table-cell">
                      Submitted By
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrievances.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No grievances found.
                      </td>
                    </tr>
                  ) : (
                    filteredGrievances.map((grievance, index) => (
                      <motion.tr
                        key={grievance.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                        className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs sm:text-sm text-slate-600">
                            GRV-{grievance.id}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-xs sm:text-sm text-slate-800 line-clamp-2">
                            {grievance.title}
                          </p>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <span className="text-xs sm:text-sm text-slate-600 capitalize">
                            {grievance.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden xl:table-cell">
                          <span className={`text-xs sm:text-sm font-medium capitalize ${grievance.priority === 'high' ? 'text-red-600' :
                            grievance.priority === 'medium' ? 'text-amber-600' :
                              'text-emerald-600'
                            }`}>
                            {grievance.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className="text-xs sm:text-sm text-slate-600">
                            {grievance.submitted_by}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span className="text-xs sm:text-sm text-slate-600">
                            {new Date(grievance.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={grievance.status} />
                            {escalationMap[grievance.id] && (() => {
                              const maxLevel = Math.max(...escalationMap[grievance.id].map((e: any) => e.escalation_level));
                              const levelStyles: Record<number, string> = {
                                1: 'bg-amber-100 text-amber-700 border-amber-200',
                                2: 'bg-orange-100 text-orange-700 border-orange-200',
                                3: 'bg-red-100 text-red-700 border-red-200',
                              };
                              const levelLabels: Record<number, string> = {
                                1: 'L1',
                                2: 'L2',
                                3: 'L3',
                              };
                              return (
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${levelStyles[maxLevel] || levelStyles[1]}`}>
                                  <AlertTriangle className="size-3" />
                                  {levelLabels[maxLevel] || 'L1'}
                                </span>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                                onClick={() => handleViewDetails(grievance)}
                              >
                                <Eye className="size-4" />
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-8 px-2"
                                onClick={() => handleViewDetails(grievance)}
                              >
                                <MessageSquare className="size-4" />
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
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isAdmin={true}
        onStatusChange={handleStatusChange}
        onAddComment={handleAddComment}
      />
    </DashboardLayout>
  );
}