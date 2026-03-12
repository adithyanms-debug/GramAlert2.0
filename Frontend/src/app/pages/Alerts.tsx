import { useState, useEffect } from "react";
import api from "../api";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Bell, AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('users/me');
        if (userRes.data && userRes.data.username) {
          const name = userRes.data.username;
          const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
          setUserName(capitalized);
        }

        const alertsRes = await api.get('alerts');
        if (alertsRes.data) {
          setAlerts(alertsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch alerts", error);
        if (userName === "Loading...") setUserName("Villager");
      }
    };
    fetchData();
  }, []);

  const getAlertConfig = (severity: string) => {
    const configs = {
      high: {
        icon: AlertCircle,
        bgColor: "from-red-500 to-rose-500",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        bgLight: "bg-red-50",
      },
      urgent: {
        icon: AlertCircle,
        bgColor: "from-red-500 to-rose-500",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        bgLight: "bg-red-50",
      },
      medium: {
        icon: AlertTriangle,
        bgColor: "from-amber-500 to-orange-500",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        bgLight: "bg-amber-50",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "from-amber-500 to-orange-500",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        bgLight: "bg-amber-50",
      },
      low: {
        icon: Info,
        bgColor: "from-blue-500 to-cyan-500",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        bgLight: "bg-blue-50",
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
    <DashboardLayout userName={userName}>
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
          {alerts.length === 0 ? (
            <div className="text-center p-12 bg-white/50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No community alerts found.</p>
            </div>
          ) : (
            alerts.map((alert, index) => {
              const severity = (alert.severity || "info").toLowerCase();
              const config = getAlertConfig(severity);
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
                          <p className="text-sm text-slate-500">{new Date(alert.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-slate-400 capitalize">{severity}</p>
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed mb-3">
                        {alert.description}
                      </p>

                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.bgLight} ${config.textColor} capitalize`}
                        >
                          <div className="size-1.5 rounded-full bg-current" />
                          {severity}
                        </span>
                        <span className="text-xs text-slate-500">
                          Category: {alert.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Info Card */}
        <motion.div
          // ... (Info card code)
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
