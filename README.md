# GramAlert


GramAlert is a community grievance reporting and civic alert platform designed to bridge the communication gap between citizens and local governance. It enables villagers to report local issues, allows administrators to manage grievances, and facilitates the broadcasting of critical alerts.

---

## Latest Major Updates

### Multi-level Auto-Escalation System
A robust escalation infrastructure has been implemented, allowing grievances to be automatically or manually escalated through three tiers of governance: Panchayat, Block, and District. This includes a detailed history timeline and status indicators for administrative oversight.

### Dedicated Rankings and Insights
The Panchayat Leaderboard has been moved to a dedicated Rankings page, providing a centralized view of performance metrics and community impact across different regions.

### Real-time Profile Integration
Villager profiles now synchronize directly with the backend database, ensuring that user information and activity history are always accurate and up-to-date.

---

## Core Features

### For Villagers
*   Submit Grievances: Report issues with detailed descriptions, categories, image uploads, and precise map locations.
*   Track Progress: Real-time monitoring of grievance status from submission to resolution.
*   Community Interaction: Participate in discussions through internal and external commenting systems.
*   Personalized Dashboard: Manage personal reports and profile information.

### For Administrators
*   Grievance Management: Efficiently review, categorize, and prioritize community reports.
*   Resolution Workflow: Structured status transitions: Received, In Progress, Resolved, or Rejected.
*   Broadcast Alerts: Issue critical announcements regarding public services, health, or emergencies.
*   Escalation Control: Manage and monitor escalated issues across different governance levels.

### For Super Administrators
*   System Oversight: Monitor system-wide activity, grievance trends, and administrative performance.
*   User Management: Create and manage administrative accounts and role-based permissions.
*   Global Configuration: Maintain system settings and global alert standards.

---

## Technology Stack

### Frontend
*   Core: React 18 with TypeScript
*   Build Tool: Vite 6
*   Styling: Tailwind CSS 4
*   UI Components: Radix UI, Lucide React
*   Interactivity: Framer Motion (motion), Sonner (Notifications)
*   Maps: Leaflet, MapLibre GL

### Backend
*   Runtime: Node.js (v18+)
*   Framework: Express 5
*   Database: PostgreSQL
*   Authentication: JWT (JSON Web Tokens), BcryptJS
*   Communication: Axios

---

## Project Structure

```text
GramAlert/
├── Frontend/              # React application source and assets
│   ├── src/               # Application logic, components, and pages
│   └── docs/              # Frontend-specific documentation
├── backend/               # Express server and database logic
│   ├── src/               # Controllers, routes, and services
│   └── docs/              # API documentation and schema guides
└── README.md              # Main project documentation
```

---

## Getting Started

### Prerequisites
*   Node.js v18 or higher
*   PostgreSQL instance

### Backend Installation
1.  Navigate to the backend directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

### Frontend Installation
1.  Navigate to the Frontend directory: `cd Frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

---

## Documentation
Additional detailed documentation is available in the respective directories:
*   Frontend Guides: [Frontend/docs/](Frontend/docs/)
*   API Reference: [backend/docs/](backend/docs/)

---

### Civic Technology Initiative
Focused on improving engagement, transparency, and public service efficiency.