# GramAlert - Project Structure

## Overview
GramAlert is a full-stack civic grievance management system connecting villagers and local administrators through structured issue reporting, real-time alerts, and community engagement.

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Motion (Animations)
- **Backend**: Node.js, Express, PostgreSQL
- **Key Libraries**: Sonner (Toasts), MapLibre (Maps), Axios (API), JWT (Auth)

## Repository Layout

```
GramAlert/
├── Frontend/           # React frontend application
│   ├── src/app/        # Core application logic
│   │   ├── components/ # UI components (Layouts, Dialogs, etc.)
│   │   ├── pages/      # Feature-specific pages (Dashboards, Auth)
│   │   ├── api.ts      # Axios instance and interceptors
│   │   ├── types/      # TypeScript interfaces
│   │   └── constants/  # Shared application constants
│   └── docs/           # Frontend-specific documentation
│
└── backend/            # Express backend application
    ├── src/            # Server-side logic
    │   ├── controllers/# Business logic (Alerts, Grievances, Users)
    │   ├── routes/     # API route definitions
    │   ├── middleware/ # Auth and role validation
    │   └── db/         # PostgreSQL schema and configuration
    └── docs/           # Backend API documentation
```

## Key Architectural Features

### 1. Role-Based Access Control (RBAC)
- **Villagers**: Report issues, track status, interact with community comments.
- **Administrators**: Moderate grievances, broadcast alerts, manage villagers.
- **SuperAdmins**: System oversight and administrator account management.

### 2. Integrated Alert System
- Admins can broadcast time-sensitive alerts (Emergency, Health, Utilities).
- System-wide consistency ensures alerts are visible to all villagers instantly.
- Verified field synchronization (`title`, `message`, `severity`) across all layers.

### 3. Map-Centric Reporting
- Interactive map allows precise location pinning for grievances.
- Geospatial visualization helps administrators identify hotspots and trends.

### 4. Robust Notification System
- Native browser alerts replaced with a premium toast system (Sonner).
- Real-time feedback for all user actions (Submission, Login, Updates).

## Data Flow
The application follows a standard RESTful architecture:
1. **Frontend** makes authenticated requests via Axios.
2. **Backend Interceptors** verify JWTs and enforce role-based permissions.
3. **Controllers** interact with the **PostgreSQL** database via parameterized queries.
4. **Services** (like Escalation) run background tasks to maintain system SLAs.

---

## Documentation Links
- 🚀 **[Quick Start](QUICK_START.md)**
- 📘 **[Frontend Guide](FRONTEND_GUIDE.md)**
- 📙 **[Backend Guide](../../backend/docs/BACKEND_GUIDE.md)**
