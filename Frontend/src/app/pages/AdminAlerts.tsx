import { useState } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  Bell,
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  Info,
  AlertTriangle,
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

const mockAlerts = [
  {
    id: "ALT-001",
    title: "Water Supply Maintenance",
    message: "Water supply will be interrupted from 10 AM to 2 PM tomorrow for maintenance work.",
    severity: "warning",
    date: "Mar 6, 2026",
    time: "09:30 AM",
    recipients: 234,
  },
  {
    id: "ALT-002",
    title: "Community Meeting Announcement",
    message: "Monthly community meeting scheduled for March 10th at 6 PM in the community hall.",
    severity: "info",
    date: "Mar 5, 2026",
    time: "03:15 PM",
    recipients: 456,
  },
  {
    id: "ALT-003",
    title: "Road Closure Notice",
    message: "Main Road will be closed for repairs from March 8-10. Please use alternative routes.",
    severity: "urgent",
    date: "Mar 4, 2026",
    time: "11:00 AM",
    recipients: 789,
  },
  {
    id: "ALT-004",
    title: "Vaccination Drive",
    message: "Free vaccination drive for children under 5 years on March 12th at the health center.",
    severity: "info",
    date: "Mar 3, 2026",
    time: "02:45 PM",
    recipients: 567,
  },
  {
    id: "ALT-005",
    title: "Heavy Rain Alert",
    message: "Heavy rainfall expected in the next 48 hours. Residents in low-lying areas should take precautions.",
    severity: "urgent",
    date: "Mar 2, 2026",
    time: "08:20 AM",
    recipients: 890,
  },
];

const severityConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  urgent: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
};

export default function AdminAlerts() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Alert broadcast successfully!");
    setIsAlertModalOpen(false);
  };

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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-message">Message</Label>
                    <Textarea
                      id="alert-message"
                      placeholder="Enter alert message"
                      rows={4}
                      className="bg-white/80 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Bell className="size-4 mr-2" />
                    Publish Alert
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

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
              View all previously sent alerts
            </p>
          </div>

          <div className="space-y-4">
            {mockAlerts.map((alert, index) => {
              const config = severityConfig[alert.severity];
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
                              {alert.recipients} recipients
                            </span>
                            <span>•</span>
                            <span>{alert.date} at {alert.time}</span>
                            <span>•</span>
                            <span className="font-mono">{alert.id}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2">
                              <Eye className="size-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2">
                              <Trash2 className="size-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}