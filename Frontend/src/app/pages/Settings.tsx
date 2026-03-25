import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useLocation } from "react-router";
import {
  Bell,
  Globe,
  Shield,
  Moon,
  Sun,
  Monitor,
  Lock,
  Mail,
  Smartphone,
  Eye,
  AlertCircle,
  Check,
  Database,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

const SETTINGS_KEY = "gramalert_settings";

const defaultSettings = {
  emailNotifications: true,
  pushNotifications: true,
  grievanceUpdates: true,
  alertNotifications: true,
  weeklyDigest: false,
  profileVisibility: "public",
  showEmail: false,
  showPhone: false,
  dataCollection: true,
  theme: "system",
  language: "english",
  adminAlerts: true,
  systemNotifications: true,
};

export default function Settings() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isSuperAdmin = location.pathname.startsWith("/superadmin");

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Theme logic is preserved via state but disabled visually to prevent UI breakage
  useEffect(() => {
    /*
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
    */
  }, [settings.theme]);

  const handleToggle = (key: string) => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success("Settings saved");
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings((prev: typeof defaultSettings) => ({ ...prev, [key]: value }));
    toast.success("Settings saved");
  };

  const handleExportData = () => {
    toast.success("Data export initiated. You'll receive a download link via email.");
  };

  const handleDeleteAccount = () => {
    toast.error("Please contact support to delete your account.");
  };


  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Settings
          </h2>
          <p className="text-slate-600">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Bell className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Notifications
                </h3>
                <p className="text-sm text-slate-600">
                  Manage how you receive updates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-slate-400" />
                  <div>
                    <Label className="text-slate-700 font-medium">Email Notifications</Label>
                    <p className="text-xs text-slate-500">Receive updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Smartphone className="size-5 text-slate-400" />
                  <div>
                    <Label className="text-slate-700 font-medium">Push Notifications</Label>
                    <p className="text-xs text-slate-500">Get instant push alerts</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle("pushNotifications")}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <AlertCircle className="size-5 text-slate-400" />
                  <div>
                    <Label className="text-slate-700 font-medium">
                      {isAdmin || isSuperAdmin ? "Grievance Alerts" : "Grievance Updates"}
                    </Label>
                    <p className="text-xs text-slate-500">
                      {isAdmin || isSuperAdmin 
                        ? "New grievance submissions"
                        : "Updates on your grievances"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.grievanceUpdates}
                  onCheckedChange={() => handleToggle("grievanceUpdates")}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Bell className="size-5 text-slate-400" />
                  <div>
                    <Label className="text-slate-700 font-medium">Community Alerts</Label>
                    <p className="text-xs text-slate-500">Important community announcements</p>
                  </div>
                </div>
                <Switch
                  checked={settings.alertNotifications}
                  onCheckedChange={() => handleToggle("alertNotifications")}
                />
              </div>

              {(isAdmin || isSuperAdmin) && (
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-slate-400" />
                    <div>
                      <Label className="text-slate-700 font-medium">System Notifications</Label>
                      <p className="text-xs text-slate-500">Critical system updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.systemNotifications}
                    onCheckedChange={() => handleToggle("systemNotifications")}
                  />
                </div>
              )}

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-slate-400" />
                  <div>
                    <Label className="text-slate-700 font-medium">Weekly Digest</Label>
                    <p className="text-xs text-slate-500">Summary email every week</p>
                  </div>
                </div>
                <Switch
                  checked={settings.weeklyDigest}
                  onCheckedChange={() => handleToggle("weeklyDigest")}
                />
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Monitor className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Appearance
                </h3>
                <p className="text-sm text-slate-600">
                  Customize how GramAlert looks
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-slate-700 mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSelectChange("theme", "light")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === "light"
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Sun className="size-6 mx-auto mb-2 text-amber-500" />
                    <p className="text-sm font-medium text-slate-700">Light</p>
                    {settings.theme === "light" && (
                      <Check className="size-4 text-teal-600 mx-auto mt-1" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSelectChange("theme", "dark")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === "dark"
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Moon className="size-6 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-700">Dark</p>
                    {settings.theme === "dark" && (
                      <Check className="size-4 text-teal-600 mx-auto mt-1" />
                    )}
                  </button>
                  <button
                    onClick={() => handleSelectChange("theme", "system")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === "system"
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Monitor className="size-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium text-slate-700">System</p>
                    {settings.theme === "system" && (
                      <Check className="size-4 text-teal-600 mx-auto mt-1" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="language" className="text-slate-700 mb-2 block">
                  <Globe className="size-4 inline mr-1" />
                  Language
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger className="h-12 bg-white/80 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                    <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                <Lock className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Privacy & Security
                </h3>
                <p className="text-sm text-slate-600">
                  Control your data and privacy
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {!isAdmin && !isSuperAdmin && (
                <>
                  <div>
                    <Label htmlFor="visibility" className="text-slate-700 mb-2 block">
                      <Eye className="size-4 inline mr-1" />
                      Profile Visibility
                    </Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) => handleSelectChange("profileVisibility", value)}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <Label className="text-slate-700 font-medium">Show Email Address</Label>
                      <p className="text-xs text-slate-500">Visible to administrators</p>
                    </div>
                    <Switch
                      checked={settings.showEmail}
                      onCheckedChange={() => handleToggle("showEmail")}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <Label className="text-slate-700 font-medium">Show Phone Number</Label>
                      <p className="text-xs text-slate-500">Visible to administrators</p>
                    </div>
                    <Switch
                      checked={settings.showPhone}
                      onCheckedChange={() => handleToggle("showPhone")}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label className="text-slate-700 font-medium">Analytics & Data Collection</Label>
                  <p className="text-xs text-slate-500">Help us improve GramAlert</p>
                </div>
                <Switch
                  checked={settings.dataCollection}
                  onCheckedChange={() => handleToggle("dataCollection")}
                />
              </div>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Database className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Data Management
                </h3>
                <p className="text-sm text-slate-600">
                  Export or delete your data
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Download className="size-5 text-teal-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">
                        Export Your Data
                      </h4>
                      <p className="text-sm text-slate-600">
                        Download a copy of all your data from GramAlert
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    size="sm"
                  >
                    Export
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Trash2 className="size-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">
                        Delete Account
                      </h4>
                      <p className="text-sm text-slate-600">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-xl bg-teal-50 border border-teal-100"
          >
            <p className="text-sm text-slate-600">
              <strong className="text-teal-700">Note:</strong> Some settings may require you to log out and log back in to take effect. Your privacy and security are our top priorities.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
