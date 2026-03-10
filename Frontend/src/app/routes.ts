import { createBrowserRouter } from "react-router";
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
  {
    path: "/villager",
    Component: VillagerDashboard,
  },
  {
    path: "/villager/submit",
    Component: SubmitGrievance,
  },
  {
    path: "/villager/grievances",
    Component: MyGrievances,
  },
  {
    path: "/villager/alerts",
    Component: Alerts,
  },
  {
    path: "/villager/profile",
    Component: VillagerProfile,
  },
  {
    path: "/villager/settings",
    Component: Settings,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/grievances",
    Component: AdminGrievances,
  },
  {
    path: "/admin/villagers",
    Component: AdminVillagers,
  },
  {
    path: "/admin/alerts",
    Component: AdminAlerts,
  },
  {
    path: "/admin/profile",
    Component: AdminProfile,
  },
  {
    path: "/admin/settings",
    Component: Settings,
  },
  {
    path: "/superadmin",
    Component: SuperAdminDashboard,
  },
  {
    path: "/superadmin/admins",
    Component: SuperAdminDashboard,
  },
  {
    path: "/superadmin/grievances",
    Component: AdminGrievances,
  },
  {
    path: "/superadmin/alerts",
    Component: AdminAlerts,
  },
  {
    path: "/superadmin/profile",
    Component: SuperAdminProfile,
  },
  {
    path: "/superadmin/settings",
    Component: Settings,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);