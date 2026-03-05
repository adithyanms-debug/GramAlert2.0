import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import VillagerDashboard from "./pages/VillagerDashboard";
import SubmitGrievance from "./pages/SubmitGrievance";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGrievances from "./pages/AdminGrievances";
import AdminVillagers from "./pages/AdminVillagers";
import AdminAlerts from "./pages/AdminAlerts";
import MyGrievances from "./pages/MyGrievances";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";

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
    Component: Profile,
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
    Component: Profile,
  },
]);