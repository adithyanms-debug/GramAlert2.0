import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

interface Notification {
  id: number;
  title: string;
  message: string;
  severity: "warning" | "info" | "success";
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Water Supply Maintenance",
    message: "Water supply will be interrupted tomorrow from 10 AM to 2 PM",
    severity: "warning",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Community Meeting",
    message: "Monthly village meeting scheduled for this Sunday at 5 PM",
    severity: "info",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Road Work Completed",
    message: "Main road repair work has been successfully completed",
    severity: "success",
    time: "1 day ago",
    read: true,
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const severityConfig = {
    warning: {
      icon: AlertCircle,
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    info: {
      icon: Info,
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    success: {
      icon: CheckCircle,
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-white/60 transition-colors"
      >
        <Bell className="size-6 text-slate-600" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <p className="text-xs text-slate-500">{unreadCount} unread</p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-teal-600 hover:text-teal-700"
                    >
                      Mark all read
                    </Button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="size-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Bell className="size-12 mx-auto mb-2 opacity-30" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notification, index) => {
                      const config = severityConfig[notification.severity];
                      const Icon = config.icon;
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !notification.read ? "bg-teal-50/30" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`size-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`size-5 ${config.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-slate-800">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="size-2 rounded-full bg-teal-600 flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-400">{notification.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  >
                    View All Notifications
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
