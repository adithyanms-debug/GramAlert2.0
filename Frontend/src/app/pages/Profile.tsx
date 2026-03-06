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
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useLocation } from "react-router";
import { useEffect } from "react";
import api from "../api";

export default function Profile() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Real user data state
  const [userData, setUserData] = useState({
    name: isAdmin ? "Administrator" : "Loading...",
    email: "",
    phone: "",
    address: "",
    role: isAdmin ? "Administrator" : "Villager",
    joinedDate: "",
    userId: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoadingItems(false);
      }
    };

    // In a real app, you might not fetch if there's no token or if it's purely mock for admin
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/users/profile', userData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully.");
    } catch (error) {
      console.error("Failed to change password", error);
      alert("Failed to change password. Please check your current password and try again.");
    }
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
            My Profile
          </h2>
          <p className="text-slate-600">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="size-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {userData.name.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 size-10 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center shadow-lg hover:bg-teal-50 transition-colors">
                    <Camera className="size-5 text-teal-600" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-4">
                  {userData.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="size-4 text-teal-600" />
                  <span className="text-sm font-medium text-slate-600">
                    {userData.role}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">User ID</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {userData.userId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Member Since</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {userData.joinedDate}
                  </span>
                </div>
                {!isAdmin && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Grievances</span>
                      <span className="text-sm font-semibold text-teal-600">
                        12 Total
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Resolved</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        8 Completed
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Password Change Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
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
            </motion.div>
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
                  <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
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
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
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

                {/* Address */}
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-slate-700 mb-2 block">
                    <MapPin className="size-4 inline mr-1" />
                    Address
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
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 bg-white/80 border-slate-200"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-slate-700">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 bg-white/80 border-slate-200"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-slate-700">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 bg-white/80 border-slate-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                    >
                      Update Password
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordChange(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Account Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                  <Calendar className="size-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                {isAdmin ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-600">
                        Submitted new grievance
                      </span>
                      <span className="text-xs text-slate-500">1 day ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-600">
                        Viewed community alerts
                      </span>
                      <span className="text-xs text-slate-500">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <span className="text-sm text-slate-600">
                        Updated profile information
                      </span>
                      <span className="text-xs text-slate-500">1 week ago</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
