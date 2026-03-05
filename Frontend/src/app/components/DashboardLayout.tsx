import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FileText,
  List,
  Bell,
  Shield,
  Menu,
  X,
  Users,
} from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";

interface DashboardLayoutProps {
  children: ReactNode;
  userName?: string;
  notifications?: number;
}

const villagerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/villager" },
  { icon: FileText, label: "Submit Grievance", path: "/villager/submit" },
  { icon: List, label: "My Grievances", path: "/villager/grievances" },
  { icon: Bell, label: "Alerts", path: "/villager/alerts" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: FileText, label: "All Grievances", path: "/admin/grievances" },
  { icon: Users, label: "Villagers", path: "/admin/villagers" },
  { icon: Bell, label: "Broadcast Alerts", path: "/admin/alerts" },
];

export function DashboardLayout({
  children,
  userName = "Rajesh Kumar",
  notifications = 3,
}: DashboardLayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Determine if current page is admin or villager
  const isAdmin = location.pathname.startsWith("/admin");
  const navItems = isAdmin ? adminNavItems : villagerNavItems;
  const userRole = isAdmin ? "Administrator" : "Villager";
  const displayName = isAdmin ? "Administrator" : userName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 p-6 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <X className="size-5" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8" onClick={() => setIsSidebarOpen(false)}>
          <div className="size-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
            <Shield className="size-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
            GramAlert
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  <item.icon className="size-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="pt-6 border-t border-slate-200">
          <ProfileDropdown userName={displayName} userRole={userRole} isAdmin={isAdmin} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-white/60">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/60 transition-colors"
              >
                <Menu className="size-6 text-slate-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                {navItems.find((item) => item.path === location.pathname)?.label ||
                  "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-white/60 transition-colors">
                <Bell className="size-6 text-slate-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}