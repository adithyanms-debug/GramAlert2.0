# GramAlert 🏛️

GramAlert is a **community grievance reporting and civic alert platform** that allows villagers to report local issues while enabling administrators to manage grievances and broadcast important alerts.

The platform provides:
* **Grievance submission** with image and location data
* **Map-based issue reporting** for spatial visualization
* **Community discussion** via internal and external comments
* **Administrative alert broadcasting** for critical announcements
* **Hierarchical governance** management across three defined tiers

---

## 📖 Project Overview

GramAlert is designed to bridge the communication gap between citizens and local governance. It provides a transparent and efficient system for:
- Reporting civic problems with visual evidence.
- Tracking resolution progress in real-time.
- Enabling community participation through feedback.
- Improving administrative response times.

The platform helps local governments monitor community issues while keeping citizens informed through real-time alerts and status updates.

---

## ✨ Current Features

### 👤 User Features (Villagers)
*   **Submit Grievance**: Report issues with title, description, category, image upload, and interactive map location pin.
*   **Edit/Delete Grievance**: Users can manage their submitted grievances until the issue moves to "In Progress".
*   **Comment on Grievances**: Participate in discussions about reported problems.
*   **View Grievance Status**: Track grievance progress in real-time.
*   **Map-based Visualization**: View reported community issues on an interactive map.

### 🛡️ Admin Features
*   **Manage Grievances**: Review and organize community complaints efficiently.
*   **Update Status**: Workflow management: `Received` → `In Progress` → `Resolved` / `Rejected`.
*   **Broadcast Alerts**: Send announcements related to emergencies, water, electricity, or health updates.
*   **Edit/Delete Alerts**: Maintain accuracy of broadcasted alerts.
*   **Dashboard Analytics**: Overview of grievance statistics and system activity.

### 👑 SuperAdmin Features
*   **Create Administrators**: Recruit and manage administrative users.
*   **System Overview**: Monitor system activity and grievance metrics at scale.
*   **Access Control**: Oversee administrator roles and permissions.

---

## 🏗️ System Architecture

-   **Frontend**: React + TypeScript + Tailwind CSS
-   **Backend**: Node.js + Express
-   **Database**: PostgreSQL
-   **Key Technologies**:
    -   **JWT Authentication**: Secure role-based access control.
    -   **Axios**: Promise-based HTTP client for API communication.
    -   **Leaflet / MapLibre**: Interactive map visualization.
    -   **Sonner**: Real-time user feedback and toast notifications.

---

## 📁 Project Structure

```bash
GramAlert/
│
├── Frontend/              # React application
│   ├── src/               # Components, pages, and application logic
│   ├── docs/              # Frontend documentation & guides
│   └── package.json
│
├── backend/               # Express server
│   ├── src/               # Controllers, routes, and middleware
│   ├── docs/              # Backend API documentation
│   └── server.js          # Entry point
│
└── README.md              # Main project documentation
```

---

## 📚 Documentation

Detailed documentation for the system can be found in the following locations:

### [Frontend Documentation](Frontend/docs/)
*   📘 **[Frontend Guide](Frontend/docs/FRONTEND_GUIDE.md)**: UI components and interaction details.
*   🧱 **[Project Structure](Frontend/docs/PROJECT_STRUCTURE.md)**: Directory layout and architectural patterns.
*   🚀 **[Quick Start Guide](Frontend/docs/QUICK_START.md)**: Installation and running instructions.
*   📜 **[Changelog](Frontend/docs/CHANGELOG.md)**: Version history and recent updates.
*   ⚖️ **[Attributions](Frontend/docs/ATTRIBUTIONS.md)**: Third-party licenses and credits.

### [Backend Documentation](backend/docs/)
*   📙 **[Backend Guide](backend/docs/BACKEND_GUIDE.md)**: API endpoints, authentication, and database schema.

---

## 🚀 Running the Project

### Prerequisites
*   Node.js v18+
*   PostgreSQL database

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 🔮 Planned Features
*   **Priority Scoring Algorithm**: Automatically rank grievances based on severity and community impact.
*   **Community Upvote System**: Allow villagers to indicate the importance of existing grievances.
*   **Automatic Escalation**: Escalate unresolved issues to higher authorities after a defined time period.
*   **AI Duplicate Detection**: Detect similar complaints and group related issues automatically.
*   **AI-Generated Alerts**: Automated generation of alerts based on system events or external data.

---

### ❤️ Civic Technology Initiative
*Made with ❤️ to improve civic engagement, transparency, and public service efficiency.*