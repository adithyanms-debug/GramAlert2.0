import { useState } from "react";
import { motion } from "motion/react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  Camera,
  Key,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [userData, setUserData] = useState({
    name: "Administrator",
    email: "admin@gramalert.gov.in",
    phone: "+91 98765 43210",
    address: "District Administrative Office, Mysore, Karnataka",
    role: "Administrator",
    joinedDate: "November 10, 2024",
    userId: "ADMIN-001",
    department: "Civic Services",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords don't match!");
      return;
    }
    if (passwordData.new.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    setShowPasswordChange(false);
    setPasswordData({ current: "", new: "", confirm: "" });
    toast.success("Password changed successfully!");
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Administrator Profile
          </h2>
          <p className="text-slate-600">
            Manage your administrative account and settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Profile Picture Card */}
            <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="size-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {userData.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 size-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors">
                    <Camera className="size-5 text-blue-600" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4">
                  {userData.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="size-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">
                    {userData.role}
                  </span>
                </div>
                <div className="mt-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                  <span className="text-xs font-medium text-blue-700">
                    {userData.department}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Admin ID</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {userData.userId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Since</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {userData.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <BarChart3 className="size-5 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800">Performance</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <span className="text-sm text-slate-600">Grievances Handled</span>
                  <span className="text-lg font-bold text-blue-600">156</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50">
                  <span className="text-sm text-slate-600">Resolved</span>
                  <span className="text-lg font-bold text-emerald-600">142</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50">
                  <span className="text-sm text-slate-600">In Progress</span>
                  <span className="text-lg font-bold text-amber-600">14</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50">
                  <span className="text-sm text-slate-600">Alerts Sent</span>
                  <span className="text-lg font-bold text-purple-600">23</span>
                </div>
              </div>
            </div>

            {/* Password Change Card */}
            <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Key className="size-5 text-white" />
                </div>
                <h4 className="font-semibold text-slate-800">Security</h4>
              </div>
              <Button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                variant="outline"
                className="w-full"
              >
                Change Password
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <User className="size-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Personal Information
                  </h3>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit2 className="size-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Save className="size-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="name" className="text-slate-700 mb-2 block">
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="bg-white/80 border-slate-200"
                    />
                  ) : (
                    <p className="text-slate-800 font-medium">{userData.name}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <Label htmlFor="department" className="text-slate-700 mb-2 block">
                    Department
                  </Label>
                  {isEditing ? (
                    <Input
                      id="department"
                      value={userData.department}
                      onChange={(e) =>
                        setUserData({ ...userData, department: e.target.value })
                      }
                      className="bg-white/80 border-slate-200"
                    />
                  ) : (
                    <p className="text-slate-800 font-medium">{userData.department}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-slate-700 mb-2 block">
                    <Mail className="size-4 inline mr-1" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="bg-white/80 border-slate-200"
                    />
                  ) : (
                    <p className="text-slate-800 font-medium">{userData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-slate-700 mb-2 block">
                    <Phone className="size-4 inline mr-1" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      className="bg-white/80 border-slate-200"
                    />
                  ) : (
                    <p className="text-slate-800 font-medium">{userData.phone}</p>
                  )}
                </div>

                {/* Role (Read-only) */}
                <div>
                  <Label className="text-slate-700 mb-2 block">
                    <Shield className="size-4 inline mr-1" />
                    Role
                  </Label>
                  <p className="text-slate-800 font-medium">{userData.role}</p>
                </div>

                {/* Admin ID (Read-only) */}
                <div>
                  <Label className="text-slate-700 mb-2 block">
                    Admin ID
                  </Label>
                  <p className="text-slate-800 font-medium">{userData.userId}</p>
                </div>

                {/* Office Address */}
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-slate-700 mb-2 block">
                    <MapPin className="size-4 inline mr-1" />
                    Office Address
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={userData.address}
                      onChange={(e) =>
                        setUserData({ ...userData, address: e.target.value })
                      }
                      rows={2}
                      className="bg-white/80 border-slate-200 resize-none"
                    />
                  ) : (
                    <p className="text-slate-800 font-medium">
                      {userData.address}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Password Change Form */}
            {showPasswordChange && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-slate-700">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.current}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, current: e.target.value })
                      }
                      className="mt-1 bg-white/80 border-slate-200"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-slate-700">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.new}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, new: e.target.value })
                      }
                      className="mt-1 bg-white/80 border-slate-200"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-slate-700">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirm: e.target.value })
                      }
                      className="mt-1 bg-white/80 border-slate-200"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Update Password
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordData({ current: "", new: "", confirm: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Calendar className="size-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-600">
                    Created new alert
                  </span>
                  <span className="text-xs text-slate-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-600">
                    Resolved 3 grievances
                  </span>
                  <span className="text-xs text-slate-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-600">
                    Updated profile information
                  </span>
                  <span className="text-xs text-slate-500">3 days ago</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-600">
                    Assigned grievance to team member
                  </span>
                  <span className="text-xs text-slate-500">5 days ago</span>
                </div>
              </div>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
            >
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="size-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">
                    Exceptional Performance
                  </h4>
                  <p className="text-sm text-slate-600">
                    You've resolved 142 grievances with a 91% satisfaction rate. Great work!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
