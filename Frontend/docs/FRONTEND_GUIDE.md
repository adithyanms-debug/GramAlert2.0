# Frontend Documentation - GramAlert

## Overview
This directory contains documentation for the GramAlert frontend application, built with React, TypeScript, and Tailwind CSS.

## Key Interfaces

### Grievance Submission UI
The grievance submission interface (`SubmitGrievance.tsx`) allows villagers to:
- Provide a clear **Title** and detailed **Description**.
- Select a valid **Category** (e.g., Water, Electricity, Road).
- **Upload Images**: Attach a photo to provide visual evidence.
- **Location Picker**: Use an interactive map to pin the exact coordinates of the issue.

### Alert Broadcasting Interface
The administrative alert system (`AdminAlerts.tsx`) provides:
- **Title and Message**: Clear communication of the alert.
- **Severity Levels**: Staging alerts as Info, Low, Medium, or High (Emergency).
- **Real-time Broadcast**: Instant visibility for all villagers upon publication.

### Toast Notification System
The application uses **Sonner** for non-intrusive, interactive notifications.
- **Success Toasts**: Feedback for successful actions (e.g., "Grievance submitted successfully!").
- **Error Toasts**: Clear error messaging with actionable feedback.
- **Role-based Styling**: Consistent with the dashboard theme.

### Map-Based Reporting
**MapLibre** is integrated to provide:
- **Location Picker**: Villagers can search for locations or click to pin coordinates.
- **Community Map**: A global view of all grievances, helping administrators visualize problem clusters.

### Role-Based Dashboards
- **Villager Dashboard**: Focused on reporting and monitoring personal grievances.
- **Admin Dashboard**: Focused on management, status updates, and broadcasting.
- **SuperAdmin Dashboard**: Focused on administrator management and system oversight.

---

## Technical Details

### State Management
- Local component state via `useState`.
- Route-based navigation with `react-router-dom`.
- Global API client via `Axios` with interceptors for JWT handling.

### Styling
- **Tailwind CSS v4**: Utility-first styling.
- **Motion**: Framer Motion for smooth transitions and staggered animations.
- **Glassmorphism**: Consistent use of semi-transparent backgrounds and backdrop blurs (`bg-white/70 backdrop-blur-sm`).
