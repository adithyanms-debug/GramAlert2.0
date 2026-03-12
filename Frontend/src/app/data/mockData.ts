// Mock data for development and testing
import type { Grievance, Alert, Villager, Admin } from "../types";

// Mock grievances data
export const mockGrievances: Grievance[] = [
  {
    id: "GRV-001",
    title: "Broken Street Light on Main Road",
    description: "The street light near the grocery store on Main Road has been non-functional for the past week. This has created safety concerns for pedestrians during nighttime. Immediate repair is needed.",
    category: "Infrastructure",
    status: "In Progress",
    date: "Feb 25, 2026",
    priority: "medium",
    submittedBy: "Rajesh Kumar",
    location: "Main Road, Sector 5",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    updates: [
      { date: "Feb 25, 2026", message: "Grievance submitted and registered", author: "System" },
      { date: "Feb 26, 2026", message: "Assigned to maintenance team for inspection", author: "Admin Kumar" },
    ],
  },
  {
    id: "GRV-002",
    title: "Water Logging Issue near School",
    description: "Heavy water logging occurs near the primary school after every rainfall. This poses a health hazard and makes it difficult for children to access the school premises. Drainage system needs urgent attention.",
    category: "Drainage",
    status: "Received",
    date: "Feb 26, 2026",
    submittedBy: "Priya Sharma",
    priority: "high",
    location: "School Area, Sector 2",
    coordinates: { lat: 28.6129, lng: 77.2295 },
    updates: [
      { date: "Feb 26, 2026", message: "Grievance received and under review", author: "System" },
    ],
  },
  {
    id: "GRV-003",
    title: "Garbage Collection Delayed",
    description: "Garbage collection was delayed by 2 days last week causing bad smell and unhygienic conditions in the residential area.",
    category: "Sanitation",
    status: "Resolved",
    date: "Feb 20, 2026",
    submittedBy: "Amit Patel",
    priority: "low",
    location: "Residential Block A",
    coordinates: { lat: 28.6149, lng: 77.2170 },
    updates: [
      { date: "Feb 20, 2026", message: "Grievance submitted", author: "System" },
      { date: "Feb 21, 2026", message: "Issue escalated to sanitation department", author: "Admin Sharma" },
      { date: "Feb 22, 2026", message: "Resolved - Regular schedule restored", author: "Admin Sharma" },
    ],
  },
  {
    id: "GRV-004",
    title: "Pothole on Village Road",
    description: "Large pothole causing accidents near the temple. Multiple vehicles have been damaged and it poses a serious safety risk.",
    category: "Road Maintenance",
    status: "Received",
    date: "Feb 27, 2026",
    submittedBy: "Sunita Devi",
    priority: "high",
    location: "Village Road, Sector 3",
    coordinates: { lat: 28.6119, lng: 77.2210 },
  },
  {
    id: "GRV-005",
    title: "Water Supply Interruption",
    description: "No water supply for 2 days in sector B affecting over 200 families. This is causing severe hardship.",
    category: "Water Supply",
    status: "In Progress",
    date: "Feb 24, 2026",
    submittedBy: "Vijay Singh",
    priority: "high",
    location: "Sector 7, Zone A",
    coordinates: { lat: 28.6159, lng: 77.2150 },
    updates: [
      { date: "Feb 24, 2026", message: "Grievance registered", author: "System" },
      { date: "Feb 25, 2026", message: "Water department inspecting pipeline", author: "Admin Patel" },
    ],
  },
];

// Mock alerts data
export const mockAlerts: Alert[] = [
  {
    id: 1,
    title: "Water Supply Maintenance",
    message: "Water supply will be interrupted tomorrow from 10 AM to 2 PM for maintenance work in Sector 5.",
    severity: "warning",
    time: "2 hours ago",
    date: "Mar 10, 2026",
    recipients: 450,
  },
  {
    id: 2,
    title: "Community Meeting",
    message: "Monthly village meeting scheduled for this Sunday at 5 PM in the community hall.",
    severity: "info",
    time: "5 hours ago",
    date: "Mar 9, 2026",
    recipients: 1200,
  },
  {
    id: 3,
    title: "Road Work Completed",
    message: "Main road repair work has been successfully completed. Thank you for your patience.",
    severity: "success",
    time: "1 day ago",
    date: "Mar 9, 2026",
    recipients: 890,
  },
  {
    id: 4,
    title: "Emergency: Power Outage",
    message: "Unexpected power outage in Sector 3 and 4. Repair teams are working to restore electricity.",
    severity: "urgent",
    time: "3 hours ago",
    date: "Mar 10, 2026",
    recipients: 320,
  },
];

// Mock villagers data
export const mockVillagers: Villager[] = [
  {
    id: "V001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    village: "Sector 5, Ward 3",
    grievances: 5,
    status: "Active",
  },
  {
    id: "V002",
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    village: "Sector 2, Ward 1",
    grievances: 3,
    status: "Active",
  },
  {
    id: "V003",
    name: "Amit Patel",
    phone: "+91 98765 43212",
    village: "Sector 6, Ward 2",
    grievances: 8,
    status: "Active",
  },
  {
    id: "V004",
    name: "Sunita Devi",
    phone: "+91 98765 43213",
    village: "Sector 3, Ward 1",
    grievances: 2,
    status: "Inactive",
  },
];

// Mock admins data
export const mockAdmins: Admin[] = [
  {
    id: "A001",
    name: "Kumar Verma",
    email: "kumar.verma@gramalert.gov",
    village: "Ward 1 & 2",
    assigned: 45,
    status: "Active",
  },
  {
    id: "A002",
    name: "Ravi Sharma",
    email: "ravi.sharma@gramalert.gov",
    village: "Ward 3 & 4",
    assigned: 38,
    status: "Active",
  },
  {
    id: "A003",
    name: "Anjali Patel",
    email: "anjali.patel@gramalert.gov",
    village: "Ward 5 & 6",
    assigned: 52,
    status: "Suspended",
  },
];
