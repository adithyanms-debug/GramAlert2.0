// Shared TypeScript interfaces and types for GramAlert

export type GrievanceStatus = "Received" | "In Progress" | "Resolved" | "Rejected";
export type GrievancePriority = "low" | "medium" | "high";
export type AlertSeverity = "info" | "warning" | "urgent" | "success";
export type UserRole = "Villager" | "Administrator" | "Super Administrator";

export interface Location {
  lat: number;
  lng: number;
}

export interface GrievanceUpdate {
  date: string;
  message: string;
  author: string;
}

export interface GrievanceComment {
  id: number;
  user: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  status: GrievanceStatus;
  date: string;
  priority: GrievancePriority;
  submittedBy: string;
  location?: string | Location;
  coordinates?: Location;
  image?: string;
  images?: string[];
  comments?: GrievanceComment[];
  updates?: GrievanceUpdate[];
}

export interface Alert {
  id: number;
  title: string;
  message: string;
  severity: AlertSeverity;
  time: string;
  date?: string;
  recipients?: number;
}

export interface Villager {
  id: string;
  name: string;
  phone: string;
  village: string;
  grievances: number;
  status: "Active" | "Inactive";
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  village: string;
  assigned: number;
  status: "Active" | "Suspended";
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}
