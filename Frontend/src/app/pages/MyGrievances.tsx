import { useState, useEffect } from "react";
import api from "../api";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Filter, Search, ArrowUpCircle } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";
import { EditGrievanceDialog } from "../components/EditGrievanceDialog";
import { toast } from "sonner";
import StatusBadge from "../components/StatusBadge";
import { Pencil, Trash2 } from "lucide-react";

export default function MyGrievances() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [userName, setUserName] = useState("Loading...");
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [grievanceToEdit, setGrievanceToEdit] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [escalationMap, setEscalationMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchData();
  }, []);

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

        // Fetch escalation data for each grievance
        try {
          const escalationPromises = grievRes.data.map((g: any) =>
            api.get(`escalations/grievance/${g.id}`).catch(() => ({ data: [] }))
          );
          const escalationResults = await Promise.all(escalationPromises);
          const map: Record<string, any[]> = {};
          grievRes.data.forEach((g: any, idx: number) => {
            const escalations = escalationResults[idx].data;
            if (escalations && escalations.length > 0) {
              map[g.id] = escalations;
            }
          });
          setEscalationMap(map);
        } catch {
          // Silently ignore escalation fetch errors
        }
      }
    } catch (error) {
      console.error("Failed to fetch grievances", error);
      if (userName === "Loading...") setUserName("Villager");
    }
  };



  const handleViewDetails = async (grievance: any) => {
    try {
      const res = await api.get(`grievances/${grievance.id}`);
      setSelectedGrievance(res.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch grievance details", error);
    }
  };

  const handleAddComment = async (id: number | string) => {
    try {
      const res = await api.get(`grievances/${id}`);
      setSelectedGrievance(res.data);
    } catch (error) {
      console.error("Failed to refresh grievance after comment", error);
    }
  };

  const handleEditGrievance = (grievance: any) => {
    setGrievanceToEdit(grievance);
    setIsEditOpen(true);
  };

  const handleDeleteGrievance = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this grievance? This action cannot be undone.")) return;

    try {
      await api.delete(`grievances/${id}`);
      toast.success("Grievance deleted successfully");
      fetchData();
    } catch (error: any) {
      console.error("Failed to delete grievance:", error);
      toast.error(error.response?.data?.message || "Failed to delete grievance");
    }
  };

  return (
    <DashboardLayout userName={userName}>
      <div className="space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <Input
                placeholder="Search grievances..."
                className="pl-11 bg-white/80 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-white/80">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              More Filters
            </Button>
          </div>
        </motion.div>

        {/* Grievances List */}
        <div className="grid gap-4">
          {(() => {
            const currentUserId = (() => {
              try {
                const token = localStorage.getItem('villager_token') || localStorage.getItem('token');
                if (!token) return null;
                return JSON.parse(atob(token.split('.')[1])).id;
              } catch (e) {
                return null;
              }
            })();

            const filtered = grievances.filter(g => {
              const matchesSearch =
                g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.description?.toLowerCase().includes(searchQuery.toLowerCase());

              const matchesStatus = filterStatus === "all" ||
                (g.status || "Received").toLowerCase().replace(" ", "-") === filterStatus;

              const matchesUser = g.user_id === currentUserId;

              return matchesSearch && matchesStatus && matchesUser;
            });

            if (filtered.length === 0) {
              return (
                <div className="text-center p-12 bg-white/50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500">No grievances found matching your criteria.</p>
                </div>
              );
            }

            return filtered.map((grievance, index) => {
              const gStatus = grievance.status || "Received";
              return (
                <motion.div
                  key={grievance.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-slate-500">
                          GRV-{grievance.id}
                        </span>
                        <StatusBadge status={gStatus} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {grievance.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-3">
                        {grievance.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="font-medium capitalize">{grievance.category}</span>
                        <span>•</span>
                        <span>{new Date(grievance.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">Priority: {grievance.priority}</span>
                      </div>

                      {/* Escalation indicator for villager */}
                      {escalationMap[grievance.id] && (() => {
                        const escalations = escalationMap[grievance.id];
                        const maxEsc = escalations.reduce((prev: any, curr: any) =>
                          curr.escalation_level > prev.escalation_level ? curr : prev
                        );
                        const levelStyles: Record<number, { bg: string; border: string; text: string }> = {
                          1: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                          2: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
                          3: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
                        };
                        const style = levelStyles[maxEsc.escalation_level] || levelStyles[1];
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 p-3 rounded-lg ${style.bg} border ${style.border} flex items-start gap-2`}
                          >
                            <ArrowUpCircle className={`size-4 mt-0.5 flex-shrink-0 ${style.text}`} />
                            <div>
                              <p className={`text-xs font-bold ${style.text}`}>
                                Escalated to {maxEsc.escalated_to}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5">
                                Your complaint has been escalated to a higher authority for faster resolution.
                              </p>
                            </div>
                          </motion.div>
                        );
                      })()}
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        onClick={() => handleViewDetails(grievance)}
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                      >
                        View Details
                      </Button>
                      <div className="flex gap-2">
                        {['Pending', 'Received'].includes(gStatus) && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditGrievance(grievance)}
                            className="border-teal-200 text-teal-600 hover:bg-teal-50"
                            title="Edit Grievance"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        )}
                        {gStatus === 'Pending' && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteGrievance(grievance.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            title="Delete Grievance"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="size-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-600">Submitted</span>
                      </div>
                      {gStatus !== "Received" && (
                        <>
                          <div className="h-px flex-1 bg-slate-200" />
                          <div className="flex items-center gap-2 text-sm">
                            <div className="size-2 rounded-full bg-blue-500" />
                            <span className="text-slate-600">Under Review</span>
                          </div>
                        </>
                      )}
                      {gStatus === "Resolved" && (
                        <>
                          <div className="h-px flex-1 bg-slate-200" />
                          <div className="flex items-center gap-2 text-sm">
                            <div className="size-2 rounded-full bg-emerald-500" />
                            <span className="text-slate-600">Resolved</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            });
          })()}
        </div>
      </div>

      <GrievanceDetailsDialog
        grievance={selectedGrievance}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAddComment={handleAddComment}
      />

      <EditGrievanceDialog
        grievance={grievanceToEdit}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchData}
      />
    </DashboardLayout>
  );
}