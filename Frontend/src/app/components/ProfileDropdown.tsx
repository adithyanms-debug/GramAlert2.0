import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { User, Settings, LogOut, ChevronDown, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { motion } from "motion/react";

interface ProfileDropdownProps {
  userName?: string;
  userRole?: string;
}

// Avatar colors for different roles
const avatarColors: Record<string, string> = {
  villager: "from-teal-500 to-emerald-500",
  admin: "from-blue-500 to-indigo-500",
  superadmin: "from-purple-500 to-violet-500",
};

export function ProfileDropdown({
  userName = "User",
  userRole = "Villager",
}: ProfileDropdownProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Determine role based on current path
  const isSuperAdmin = location.pathname.startsWith("/superadmin");
  const isAdminUser = location.pathname.startsWith("/admin") && !isSuperAdmin;

  let profilePath = "/villager/profile";
  let settingsPath = "/villager/settings";
  let avatarColor = avatarColors.villager;

  if (isSuperAdmin) {
    profilePath = "/superadmin/profile";
    settingsPath = "/superadmin/settings";
    avatarColor = avatarColors.superadmin;
  } else if (isAdminUser) {
    profilePath = "/admin/profile";
    settingsPath = "/admin/settings";
    avatarColor = avatarColors.admin;
  }

  const handleLogout = () => {
    if (isSuperAdmin) {
      localStorage.removeItem("superadmin_token");
    } else if (isAdminUser) {
      localStorage.removeItem("admin_token");
    } else {
      localStorage.removeItem("villager_token");
      localStorage.removeItem("token");
    }
    navigate("/");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/60 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500">
          <div className={`size-9 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-semibold relative`}>
            {userName.charAt(0)}
            {isSuperAdmin && (
              <Crown className="size-3 absolute -top-1 -right-1 text-yellow-300" />
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-slate-600" />
          </motion.div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white/95 backdrop-blur-xl border-white/60"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userRole}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to={profilePath}>
            <User className="mr-2 size-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to={settingsPath}>
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}