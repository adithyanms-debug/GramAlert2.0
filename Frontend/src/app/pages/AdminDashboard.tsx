import { useState } from "react";
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

const mockGrievances = [
  {
    id: "GRV-001",
    title: "Broken Street Light on Main Road",
    category: "Infrastructure",
    status: "In Progress",
    date: "Feb 25, 2026",
    submittedBy: "Rajesh Kumar",
    priority: "medium",
  },
  {
    id: "GRV-002",
    title: "Water Logging Issue near School",
    category: "Drainage",
    status: "Received",
    date: "Feb 26, 2026",
    submittedBy: "Priya Sharma",
    priority: "high",
  },
  {
    id: "GRV-003",
    title: "Garbage Collection Delayed",
    category: "Sanitation",
    status: "Resolved",
    date: "Feb 20, 2026",
    submittedBy: "Amit Patel",
    priority: "low",
  },
  {
    id: "GRV-004",
    title: "Pothole on Village Road",
    category: "Road Maintenance",
    status: "Received",
    date: "Feb 27, 2026",
    submittedBy: "Sunita Devi",
    priority: "high",
  },
  {
    id: "GRV-005",
    title: "Water Supply Interruption",
    category: "Water Supply",
    status: "In Progress",
    date: "Feb 24, 2026",
    submittedBy: "Vijay Singh",
    priority: "high",
  },
];

export default function AdminDashboard() {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              icon: FileText,
              label: "Total Grievances",
              value: "156",
              color: "from-blue-500 to-cyan-500",
              change: "+12 this week",
            },
            {
              icon: Clock,
              label: "Pending Review",
              value: "23",
              color: "from-amber-500 to-orange-500",
              change: "Needs attention",
            },
            {
              icon: AlertCircle,
              label: "In Progress",
              value: "48",
              color: "from-purple-500 to-pink-500",
              change: "Being resolved",
            },
            {
              icon: CheckCircle2,
              label: "Resolved",
              value: "85",
              color: "from-emerald-500 to-teal-500",
              change: "54% success rate",
            },
          ].map((stat, index) => (
            <motion.button
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all text-left cursor-pointer"
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
            </motion.button>
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
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
                Alert Management
              </h3>
              <p className="text-sm text-slate-600">
                Broadcast important announcements to villagers
              </p>
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
                  <DialogDescription>
                    Broadcast an important message to all villagers
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-4">
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
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAlertModalOpen(false);
                    }}
                  >
                    <Bell className="size-4 mr-2" />
                    Publish Alert
                  </Button>
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
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
              Recent Grievances
            </h3>
            <p className="text-sm text-slate-600">
              Manage and update grievance statuses
            </p>
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
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden lg:table-cell">
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
                  {mockGrievances.map((grievance, index) => (
                    <motion.tr
                      key={grievance.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs sm:text-sm text-slate-600">
                          {grievance.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-xs sm:text-sm text-slate-800 line-clamp-2">
                          {grievance.title}
                        </p>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {grievance.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {grievance.submittedBy}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {grievance.date}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Select defaultValue={grievance.status.toLowerCase().replace(" ", "-")}>
                          <SelectTrigger className="w-24 sm:w-36 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-8 px-2">
                              <Eye className="size-4" />
                              <span className="hidden sm:inline ml-1">View</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2">
                              <MessageSquare className="size-4 mr-1" />
                              Comment
                            </Button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
