# GramAlert 🏛️

GramAlert is a **community grievance reporting and civic alert platform** that allows villagers to report issues and enables administrators to manage and broadcast important alerts.

The platform provides:
* grievance submission
* map-based issue reporting
* community discussion via comments
* administrative alert broadcasting
* hierarchical governance management

---

## Project Overview

GramAlert is designed to bridge the communication gap between citizens and local governance. It provides a transparent, efficient, and reactive system for monitoring and resolving local grievances while keeping the community informed through real-time alerts.

---

## Current Features

### User Features (Villagers)
* **Submit grievance**: Complete with title, description, category, image upload, and interactive map location pin.
* **Edit/Delete grievance**: Maintain control over submitted issues until they transition to "In Progress".
* **Comment on grievances**: Engage in discussions on specific reported issues.
* **View grievance status**: Real-time tracking of resolution progress.
* **Map-based visualization**: See all reported issues in the community on an interactive map.

### Admin Features
* **Manage grievances**: Review, categorize, and prioritize community complaints.
* **Update grievance status**: Move grievances through the workflow (Received → In Progress → Resolved/Rejected).
* **Broadcast alerts**: Send critical information (emergency, water, electricity, health) to all villagers.
* **Edit/Delete alerts**: Maintain the accuracy of community broadcasts.
* **Dashboard analytics**: High-level overview of grievance metrics and status distribution.

### SuperAdmin Features
* **Create administrators**: Recruit and manage the administrative team.
* **System overview dashboard**: Monitor entire system activity at a glance.
* **Manage administrators**: Control access and oversee administrative performance.

---

## System Architecture

### Frontend
```
React + TypeScript + Tailwind CSS
```

### Backend
```
Node.js + Express
```

### Database
```
PostgreSQL
```

### Other Technologies
```
JWT Authentication: Secure role-based access control.
Axios API Client: Promise-based HTTP client for data fetching.
Leaflet / MapLibre Integration: Interactive map visualization.
Toast Notifications (Sonner): Real-time feedback and alerts.
```

---

## Project Structure

```
GramAlert/
│
├── Frontend/           # React application
│   ├── src/            # Components, pages, assets
│   ├── docs/           # Frontend-specific documentation
│   └── package.json    # Frontend dependencies
│
├── backend/            # Express server
│   ├── src/            # Controllers, routes, middleware, services
│   ├── docs/           # API documentation
│   └── server.js       # Entry point
│
└── README.md           # Main project documentation
```

---

## Running the Project

### Prerequisites
* Node.js (v18+)
* PostgreSQL database

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

## Planned Features

Future upgrades planned for GramAlert:
* **Priority scoring algorithm**: Automatically rank grievances based on severity and impact.
* **Community upvote system**: Allow villagers to upvote existing issues to indicate priority.
* **Automatic grievance escalation**: Escalate unresolved issues to higher authorities after a set duration.
* **AI-assisted detection**: Identify duplicate complaints and categorize issues automatically.
* **AI-generated alerts**: Automated alerts based on system events and weather data.

---

**Made with ❤️ for better civic engagement**
