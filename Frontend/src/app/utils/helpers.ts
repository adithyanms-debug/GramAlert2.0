// Utility helper functions for GramAlert

import type { GrievanceStatus, GrievancePriority } from "../types";

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    }
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get status badge color classes
 */
export function getStatusColor(status: GrievanceStatus): string {
  const statusColors = {
    Received: "bg-amber-100 text-amber-700 border-amber-300",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
    Resolved: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Rejected: "bg-red-100 text-red-700 border-red-300",
  };

  return statusColors[status] || statusColors.Received;
}

/**
 * Get priority badge color classes
 */
export function getPriorityConfig(priority: GrievancePriority) {
  const configs = {
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
  };

  return configs[priority] || configs.low;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as +91 XXXXX XXXXX
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return `+91 ${cleaned.substring(2, 7)} ${cleaned.substring(7)}`;
  }

  // Format as +91 XXXXX XXXXX if 10 digits
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }

  return phone;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || (cleaned.startsWith("91") && cleaned.length === 12);
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = "ID"): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}${randomStr}`.toUpperCase();
}

/**
 * Calculate statistics from grievances
 */
export function calculateGrievanceStats(grievances: Array<{ status: GrievanceStatus }>) {
  return {
    total: grievances.length,
    pending: grievances.filter((g) => g.status === "Received").length,
    inProgress: grievances.filter((g) => g.status === "In Progress").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
  };
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
