import { useState, useEffect } from "react";
import api from "../api";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Filter, Search } from "lucide-react";
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