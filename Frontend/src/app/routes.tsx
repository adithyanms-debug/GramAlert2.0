import { createBrowserRouter, Navigate } from "react-router";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import SuperAdminAuth from "./pages/SuperAdminAuth";
import VillagerDashboard from "./pages/VillagerDashboard";
import SubmitGrievance from "./pages/SubmitGrievance";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGrievances from "./pages/AdminGrievances";
import AdminVillagers from "./pages/AdminVillagers";
import AdminAlerts from "./pages/AdminAlerts";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import MyGrievances from "./pages/MyGrievances";
import Alerts from "./pages/Alerts";
import VillagerProfile from "./pages/VillagerProfile";
import AdminProfile from "./pages/AdminProfile";
import SuperAdminProfile from "./pages/SuperAdminProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/auth",
    Component: Auth,
  },
  {
    path: "/admin-auth",
    Component: AdminAuth,
  },
  {
    path: "/superadmin-auth",
    Component: SuperAdminAuth,
  },

  // Villager Routes
  {
    path: "/villager",
    element: (
      <ProtectedRoute allowedRoles={["VILLAGER"]}>
        <VillagerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/villager/submit",
    element: (
      <ProtectedRoute allowedRoles={["VILLAGER"]}>
        <SubmitGrievance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/villager/grievances",
    element: (
      <ProtectedRoute allowedRoles={["VILLAGER"]}>
        <MyGrievances />
      </ProtectedRoute>
    ),
  },
  {
    path: "/villager/alerts",
    element: (
      <ProtectedRoute allowedRoles={["VILLAGER"]}>
        <Alerts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/villager/profile",
    element: (
      <ProtectedRoute allowedRoles={["VILLAGER"]}>
        <VillagerProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/villager/settings",
    element: (
      <ProtectedRoute allowedRoles={["VILLAGER"]}>
        <Settings />
      </ProtectedRoute>
    ),
  },

  // Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/grievances",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
        <AdminGrievances />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/villagers",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
        <AdminVillagers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/alerts",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
        <AdminAlerts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
        <AdminProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
        <Settings />
      </ProtectedRoute>
    ),
  },

  // Super Admin Routes
  {
    path: "/superadmin",
    element: (
      <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/admins",
    element: (
      <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/grievances",
    element: (
      <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
        <AdminGrievances />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/alerts",
    element: (
      <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
        <AdminAlerts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/profile",
    element: (
      <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
        <SuperAdminProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/settings",
    element: (
      <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
        <Settings />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    Component: NotFound,
  },
]);
