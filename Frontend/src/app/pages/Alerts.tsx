import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Bell, AlertCircle, Info, AlertTriangle } from "lucide-react";

const mockAlerts = [
  {
    id: 1,
    title: "Water Supply Maintenance",
    message: "Water supply will be interrupted tomorrow from 10 AM to 2 PM for maintenance work in sector C. Please store water accordingly.",
    severity: "warning",
    time: "2 hours ago",
    date: "Feb 28, 2026",
  },
  {
    id: 2,
    title: "Community Meeting",
    message: "Monthly village meeting scheduled for this Sunday at 5 PM at the community center. All residents are encouraged to attend.",
    severity: "info",
    time: "5 hours ago",
    date: "Feb 28, 2026",
  },
  {
    id: 3,
    title: "Road Work Completed",
    message: "Main road repair work has been successfully completed. Traffic is now normal on all routes.",
    severity: "success",
    time: "1 day ago",
    date: "Feb 27, 2026",
  },
  {
    id: 4,
    title: "Heavy Rain Alert",
    message: "Meteorological department has issued a heavy rain warning for the next 48 hours. Please take necessary precautions.",
    severity: "urgent",
    time: "2 days ago",
    date: "Feb 26, 2026",
  },
  {
    id: 5,
    title: "Health Camp Announcement",
    message: "Free health check-up camp will be organized on March 5th at the primary health center from 9 AM to 4 PM.",
    severity: "info",
    time: "3 days ago",
    date: "Feb 25, 2026",
  },
  {
    id: 6,
    title: "Electricity Maintenance",
    message: "Scheduled power cut on March 1st from 6 AM to 10 AM for transformer maintenance in zones A and B.",
    severity: "warning",
    time: "4 days ago",
    date: "Feb 24, 2026",
  },
];

export default function Alerts() {
  const getAlertConfig = (severity: string) => {
    const configs = {
      urgent: {
        icon: AlertCircle,
        bgColor: "from-red-500 to-rose-500",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        bgLight: "bg-red-50",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "from-amber-500 to-orange-500",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        bgLight: "bg-amber-50",
      },
      info: {
        icon: Info,
        bgColor: "from-blue-500 to-cyan-500",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        bgLight: "bg-blue-50",
      },
      success: {
        icon: Bell,
        bgColor: "from-emerald-500 to-teal-500",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        bgLight: "bg-emerald-50",
      },
    };
    return configs[severity as keyof typeof configs] || configs.info;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bell className="size-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Community Alerts</h2>
                <p className="text-teal-50">Stay informed about important announcements</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-4">
          {mockAlerts.map((alert, index) => {
            const config = getAlertConfig(alert.severity);
            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ x: 4 }}
                className={`p-6 rounded-xl bg-white/70 backdrop-blur-sm border ${config.borderColor} shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`size-14 rounded-xl bg-gradient-to-br ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="size-7 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-800">
                        {alert.title}
                      </h3>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm text-slate-500">{alert.time}</p>
                        <p className="text-xs text-slate-400">{alert.date}</p>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-3">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgLight} ${config.textColor} capitalize`}
                      >
                        <div className="size-1.5 rounded-full bg-current" />
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-xl bg-teal-50 border border-teal-100"
        >
          <p className="text-sm text-slate-600">
            <strong className="text-teal-700">Note:</strong> You will receive notifications
            for urgent alerts. Make sure to enable notifications in your device settings.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
