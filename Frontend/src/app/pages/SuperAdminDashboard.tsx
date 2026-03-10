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
  Users,
  Bell,
  UserPlus,
  Crown,
  Eye,
  Trash2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const mockAdmins = [
  {
    id: "ADM-001",
    name: "Rajiv Sharma",
    email: "rajiv@gramalert.com",
    zone: "North District",
    status: "Active",
    created: "Jan 15, 2026",
  },
  {
    id: "ADM-002",
    name: "Priya Mehta",
    email: "priya@gramalert.com",
    zone: "South District",
    status: "Active",
    created: "Feb 1, 2026",
  },
  {
    id: "ADM-003",
    name: "Amit Kumar",
    email: "amit@gramalert.com",
    zone: "East District",
    status: "Active",
    created: "Feb 10, 2026",
  },
];

const mockGrievanceStats = [
  { category: "Infrastructure", total: 45, pending: 12, resolved: 33 },
  { category: "Water Supply", total: 32, pending: 8, resolved: 24 },
  { category: "Sanitation", total: 28, pending: 5, resolved: 23 },
  { category: "Road Maintenance", total: 51, pending: 15, resolved: 36 },
];

export default function SuperAdminDashboard() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              icon: Users,
              label: "Total Admins",
              value: "12",
              color: "from-purple-500 to-violet-500",
              change: "+2 this month",
            },
            {
              icon: FileText,
              label: "All Grievances",
              value: "156",
              color: "from-blue-500 to-indigo-500",
              change: "+12 this week",
            },
            {
              icon: Clock,
              label: "System Uptime",
              value: "99.9%",
              color: "from-emerald-500 to-teal-500",
              change: "Last 30 days",
            },
            {
              icon: Bell,
              label: "Active Alerts",
              value: "8",
              color: "from-amber-500 to-orange-500",
              change: "Across all zones",
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
                <form className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Full Name</Label>
                    <Input
                      id="admin-name"
                      placeholder="Enter administrator name"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@gramalert.com"
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-zone">Assigned Zone</Label>
                    <Select>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North District</SelectItem>
                        <SelectItem value="south">South District</SelectItem>
                        <SelectItem value="east">East District</SelectItem>
                        <SelectItem value="west">West District</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Initial Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter temporary password"
                      className="bg-white/80"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAdminModalOpen(false);
                    }}
                  >
                    <UserPlus className="size-4 mr-2" />
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
                      Zone
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700 hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockAdmins.map((admin, index) => (
                    <motion.tr
                      key={admin.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs sm:text-sm text-slate-600">
                          {admin.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-xs sm:text-sm text-slate-800">
                          {admin.name}
                        </p>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {admin.email}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className="text-xs sm:text-sm text-slate-600">
                          {admin.zone}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          {admin.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-8 px-2">
                              <Eye className="size-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2">
                              <Trash2 className="size-4" />
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
            {mockGrievanceStats.map((stat, index) => (
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
                <h4 className="font-semibold text-slate-800 mb-2">{stat.category}</h4>
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
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
