import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { AlertCircle, Clock, CheckCircle2, TrendingUp, FileText, Bell } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { GrievanceDetailsDialog } from "../components/GrievanceDetailsDialog";

const mockAlerts = [
  {
    id: 1,
    title: "Water Supply Maintenance",
    message: "Water supply will be interrupted tomorrow from 10 AM to 2 PM",
    severity: "warning",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Community Meeting",
    message: "Monthly village meeting scheduled for this Sunday at 5 PM",
    severity: "info",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Road Work Completed",
    message: "Main road repair work has been successfully completed",
    severity: "success",
    time: "1 day ago",
  },
];

const mockGrievances = [
  {
    id: "GRV-001",
    title: "Broken Street Light on Main Road",
    description: "The street light near the grocery store on Main Road has been non-functional for the past week. This has created safety concerns for pedestrians during nighttime. Immediate repair is needed.",
    category: "Infrastructure",
    status: "In Progress",
    date: "Feb 25, 2026",
    priority: "medium",
    submittedBy: "Rajesh Kumar",
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: "GRV-002",
    title: "Water Logging Issue near School",
    description: "Heavy water logging occurs near the primary school after every rainfall. This poses a health hazard and makes it difficult for children to access the school premises. Drainage system needs urgent attention.",
    category: "Drainage",
    status: "Received",
    date: "Feb 26, 2026",
    priority: "high",
    submittedBy: "Rajesh Kumar",
    location: { lat: 28.6149, lng: 77.2095 }
  },
  {
    id: "GRV-003",
    title: "Garbage Collection Delayed",
    description: "Garbage collection in our locality has been irregular for the past two weeks. This has led to accumulation of waste and unpleasant odors. Regular collection schedule needs to be maintained.",
    category: "Sanitation",
    status: "Resolved",
    date: "Feb 20, 2026",
    priority: "low",
    submittedBy: "Rajesh Kumar",
  },
];

export default function VillagerDashboard() {
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Rajesh!</h2>
            <p className="text-teal-50 mb-4 text-sm sm:text-base">
              Stay updated with your grievances and community alerts
            </p>
            <Button asChild className="bg-white text-teal-700 hover:bg-teal-50 w-full sm:w-auto">
              <Link to="/villager/submit">Submit New Grievance</Link>
            </Button>
          </div>
        </motion.div>

        {/* Alerts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="size-6 text-teal-600" />
              Recent Alerts
            </h3>
            <Link to="/villager/alerts" className="text-sm text-teal-600 hover:text-teal-700">
              View All
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
            {mockAlerts.map((alert, index) => {
              const colors = {
                warning: "from-amber-500 to-orange-500",
                info: "from-blue-500 to-cyan-500",
                success: "from-emerald-500 to-teal-500",
              };

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-80 p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`size-10 rounded-lg bg-gradient-to-br ${colors[alert.severity as keyof typeof colors]} flex items-center justify-center`}>
                      <Bell className="size-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{alert.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {alert.message}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              label: "Total Grievances",
              value: "8",
              color: "from-blue-500 to-cyan-500",
              change: "+2 this week",
            },
            {
              icon: Clock,
              label: "In Progress",
              value: "3",
              color: "from-amber-500 to-orange-500",
              change: "Average 3 days",
            },
            {
              icon: CheckCircle2,
              label: "Resolved",
              value: "5",
              color: "from-emerald-500 to-teal-500",
              change: "62% success rate",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Grievances */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800">Recent Grievances</h3>
            <Link to="/villager/grievances" className="text-sm text-teal-600 hover:text-teal-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {mockGrievances.map((grievance, index) => {
              const statusColors = {
                Received: "bg-amber-100 text-amber-700 border-amber-200",
                "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
                Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
              };

              return (
                <motion.div
                  key={grievance.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="p-4 sm:p-5 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <span className="text-xs sm:text-sm font-mono text-slate-500">
                          {grievance.id}
                        </span>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[grievance.status as keyof typeof statusColors]
                          }`}
                        >
                          {grievance.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1 text-sm sm:text-base">
                        {grievance.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                        <span>{grievance.category}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{grievance.date}</span>
                      </div>
                    </div>
                    <button
                      className="text-teal-600 hover:text-teal-700 font-medium text-xs sm:text-sm self-start sm:self-center"
                      onClick={() => setSelectedGrievance(grievance)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <GrievanceDetailsDialog
        grievance={selectedGrievance}
        isOpen={!!selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
      />
    </DashboardLayout>
  );
}