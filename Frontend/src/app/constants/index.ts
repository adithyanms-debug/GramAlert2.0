// Shared constants and configuration for GramAlert

import { Shield, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Grievance categories
export const GRIEVANCE_CATEGORIES = [
  "Infrastructure",
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Drainage",
  "Road Maintenance",
  "Street Lights",
  "Healthcare",
  "Education",
  "Other",
] as const;

// Status color configurations
export const STATUS_COLORS = {
  Received: "bg-amber-100 text-amber-700 border-amber-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  Resolved: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Rejected: "bg-red-100 text-red-700 border-red-300",
} as const;

// Priority configurations
export const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-300",
  },
  medium: {
    label: "Medium",
    color: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-300",
  },
  high: {
    label: "High",
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-300",
  },
} as const;

// Theme configurations for each role
export interface ThemeConfig {
  bg: string;
  logo: string;
  logoText: string;
  active: string;
  icon: LucideIcon;
}

export const ROLE_THEMES: Record<string, ThemeConfig> = {
  villager: {
    bg: "from-slate-50 via-teal-50 to-emerald-50",
    logo: "from-teal-600 to-emerald-600",
    logoText: "from-teal-700 to-emerald-700",
    active: "from-teal-600 to-emerald-600",
    icon: Shield,
  },
  admin: {
    bg: "from-blue-50 via-indigo-50 to-blue-100",
    logo: "from-blue-600 to-indigo-600",
    logoText: "from-blue-700 to-indigo-700",
    active: "from-blue-600 to-indigo-600",
    icon: Shield,
  },
  superadmin: {
    bg: "from-purple-50 via-violet-50 to-purple-100",
    logo: "from-purple-600 to-violet-600",
    logoText: "from-purple-700 to-violet-700",
    active: "from-purple-600 to-violet-600",
    icon: Crown,
  },
} as const;

// Default map center (Mysore, Karnataka)
export const DEFAULT_MAP_CENTER: [number, number] = [12.2958, 76.6394];

// Image upload configuration
export const IMAGE_UPLOAD_CONFIG = {
  maxSizeMB: 5,
  acceptedFormats: ["image/jpeg", "image/png", "image/gif"],
  acceptString: "image/*",
  maxFiles: 10,
} as const;

// API endpoints (mock)
export const API_ENDPOINTS = {
  grievances: "/api/grievances",
  alerts: "/api/alerts",
  users: "/api/users",
  admins: "/api/admins",
} as const;

// Notification settings
export const NOTIFICATION_REFRESH_INTERVAL = 30000; // 30 seconds

// Toast configuration
export const TOAST_DURATION = 3000; // 3 seconds
