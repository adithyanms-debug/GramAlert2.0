import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import api from "../api";
import {
  Bell,
  Plus,
  Trash2,
  Pencil,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
  type LucideIcon,
} from "lucide-react";
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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

const severityConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  low: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  medium: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  high: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
};

export default function AdminAlerts() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    severity: "info"
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("alerts");
      setAlerts(res.data);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
      toast.error("Could not load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.title || !newAlert.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsCreating(true);

    try {
      await api.post("alerts", newAlert);
      toast.success("Alert broadcast successfully!");
      setIsAlertModalOpen(false);
      setNewAlert({ title: "", message: "", severity: "info" });
      fetchAlerts();
    } catch (error) {
      console.error("Failed to create alert", error);
      toast.error("Failed to publish alert");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlert.title || !editingAlert.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsEditing(true);

    try {
      await api.put(`alerts/${editingAlert.id}`, {
        title: editingAlert.title,
        message: editingAlert.message,
        severity: editingAlert.severity
      });
      toast.success("Alert updated successfully!");
      setIsEditModalOpen(false);
      setEditingAlert(null);
      fetchAlerts();
    } catch (error) {
      console.error("Failed to update alert", error);
      toast.error("Failed to update alert");
    } finally {
      setIsEditing(false);
    }
  };

  const openEditModal = (alert: any) => {
    setEditingAlert({
      id: alert.id,
      title: alert.title,
      message: alert.message,
      severity: alert.severity || "info"
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteAlert = async (id: number | string) => {
    try {
      await api.delete(`alerts/${id}`);
      toast.success("Alert deleted successfully");
      fetchAlerts();
    } catch (error) {
      console.error("Failed to delete alert", error);
      toast.error("Failed to delete alert");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Create Alert Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                Broadcast Alerts
              </h3>
              <p className="text-sm text-slate-600">
                Send important announcements to all villagers
              </p>
            </div>
            <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto">
                  <Plus className="size-5 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/60">
                <DialogHeader>
                  <DialogTitle>Create New Alert</DialogTitle>
                  <DialogDescription>
                    Broadcast an important message to all villagers
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-4" onSubmit={handleCreateAlert}>
                  <div className="space-y-2">
                    <Label htmlFor="alert-title">Alert Title</Label>
                    <Input
                      id="alert-title"
                      placeholder="Enter alert title"
                      className="bg-white/80"
                      value={newAlert.title}
                      onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-message">Message</Label>
                    <Textarea
                      id="alert-message"
                      placeholder="Enter alert message"
                      rows={4}
                      className="bg-white/80 resize-none"
                      value={newAlert.message}
                      onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select
                      value={newAlert.severity}
                      onValueChange={(val) => setNewAlert({ ...newAlert, severity: val })}
                    >
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isCreating ? (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    ) : (
                      <Bell className="size-4 mr-2" />
                    )}
                    {isCreating ? "Publishing..." : "Publish Alert"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Edit Alert Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/60">
            <DialogHeader>
              <DialogTitle>Edit Alert</DialogTitle>
              <DialogDescription>
                Update the message for broadcast alert ALT-{editingAlert?.id}
              </DialogDescription>
            </DialogHeader>
            {editingAlert && (
              <form className="space-y-4 mt-4" onSubmit={handleEditAlert}>
                <div className="space-y-2">
                  <Label htmlFor="edit-alert-title">Alert Title</Label>
                  <Input
                    id="edit-alert-title"
                    placeholder="Enter alert title"
                    className="bg-white/80"
                    value={editingAlert.title}
                    onChange={(e) => setEditingAlert({ ...editingAlert, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-alert-message">Message</Label>
                  <Textarea
                    id="edit-alert-message"
                    placeholder="Enter alert message"
                    rows={4}
                    className="bg-white/80 resize-none"
                    value={editingAlert.message}
                    onChange={(e) => setEditingAlert({ ...editingAlert, message: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-severity">Severity Level</Label>
                  <Select
                    value={editingAlert.severity}
                    onValueChange={(val) => setEditingAlert({ ...editingAlert, severity: val })}
                  >
                    <SelectTrigger className="bg-white/80">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={isEditing}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isEditing ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Bell className="size-4 mr-2" />
                  )}
                  {isEditing ? "Updating..." : "Update Alert"}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Alert History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
        >
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
              Alert History
            </h3>
            <p className="text-sm text-slate-600">
              Showing {alerts.length} previously sent alerts
            </p>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-center py-8 text-slate-500">No alert history found.</p>
            ) : (
              alerts.map((alert, index) => {
                const severityKey = (alert.severity || "info").toLowerCase();
                const config = severityConfig[severityKey] || severityConfig.info;
                const SeverityIcon = config.icon;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-xl bg-white/60 border border-white/60 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`size-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <SeverityIcon className={`size-6 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 mb-1">{alert.title}</h4>
                            <p className="text-sm text-slate-600 mb-2">{alert.message}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Bell className="size-3" />
                                {alert.recipients || 'All'} recipients
                              </span>
                              <span>•</span>
                              <span>{new Date(alert.created_at).toLocaleDateString()} at {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span>•</span>
                              <span className="font-mono">ALT-{alert.id}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                              onClick={() => openEditModal(alert)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                              onClick={() => handleDeleteAlert(alert.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}