# GramAlert Backend API

GramAlert is a full-stack rural governance platform designed to connect villagers with their local panchayat for utility alerts and grievance management.

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

## Setup & Run

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Database Setup**
   Ensure PostgreSQL is running. Create a database named `gramalert_db` (or your preferred name).
   
   Execute the schema and seed scripts:
   ```bash
   psql -U postgres -d gramalert_db -f src/db/schema.sql
   psql -U postgres -d gramalert_db -f src/db/seed.sql
   ```

3. **Environment Configuration**
   Copy `.env.example` to `.env` and fill out the database credentials and JWT secret.
   ```bash
   cp .env.example .env
   ```

4. **Start the Server**
   ```bash
   npm run dev
   # Or for production:
   npm start
   ```

## Folder Structure
```
backend/
├── src/
│   ├── config/                  # Database and JWT configurations
│   ├── controllers/             # Request handlers for API routes
│   ├── db/                      # PostgreSQL Schema and Seed files
│   ├── middleware/              # Auth, Role guards, Error handling
│   ├── routes/                  # Express route definitions
│   ├── services/                # Escalations, Notifications
│   └── utils/                   # Priority calculation logic
├── uploads/                     # Multer storage for uploaded grievance photos
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── server.js                    # Express Application Entry Point
```

## How Triggers and Stored Procedures Work
- **`updated_at` Triggers:** Automatically updates the `updated_at` column when a row in `users` or `grievances` is modified.
- **`deadline` Trigger:** Upon inserting a new grievance, it computes a functional resolution deadline based on the category (e.g. `water` gives 2 days limit, `roads` gives 7 days limit).
- **`escalate_overdue_grievances()` Stored Procedure:** Finds grievances passing their deadline without being resolved. It flags them `is_overdue = true` and records an escalation task under the `escalations` table.

## Escalation Cron Job
The file `src/services/escalation.service.js` initializes a `node-cron` job. Every midnight, it invokes the `escalate_overdue_grievances()` stored procedure to ensure compliance limits are properly logged.

## API Endpoints Overview

*Note: Endpoints prefixed with `[AUTH]` require the header `Authorization: Bearer <TOKEN>`. Endpoints prefixed with `[ADMIN]` require auth and `role = 'ADMIN'`.*

### 1. Auth
- **`POST /api/auth/register`** 
  - Register a new villager.
  - Request: `{ "username": "...", "email": "...", "phone": "...", "password": "..." }`
- **`POST /api/auth/login`** 
  - Login to the system.
  - Request: `{ "username": "...", "password": "..." }`
  - Response: `{ "message": "...", "token": "...", "user": {...} }`

### 2. Grievances
- **`[AUTH] GET /api/grievances`** — Retrieve standard grievances (Admins see all, Villagers see own).
- **`[AUTH] GET /api/grievances/:id`** — Retrieve a single grievance by ID alongside its comments.
- **`[AUTH] POST /api/grievances`** — Submit a new grievance. Accepts `multipart/form-data` with `photo` file attach. Needs `title`, `description`, `category`.
- **`[ADMIN] PATCH /api/grievances/:id/status`** — Change grievance status (e.g. `{ "status": "Resolved" }`).
- **`[ADMIN] DELETE /api/grievances/:id`** — Delete grievance.
- **`[ADMIN] GET /api/grievances/admin/overdue`** — Output grievances where `is_overdue = TRUE`.

### 3. Alerts
- **`GET /api/alerts`** — Public endpoint to pull system alerts.
- **`[ADMIN] POST /api/alerts`** — Create community alert. `{ "title": "...", "description": "...", "category": "..." }`
- **`[ADMIN] PATCH /api/alerts/:id`** — Update an existing alert.
- **`[ADMIN] DELETE /api/alerts/:id`** — Destroy community alert.

### 4. Comments
- **`[AUTH] GET /api/grievances/:id/comments`** — Load comments mapped to a grievance.
- **`[AUTH] POST /api/grievances/:id/comments`** — Append a new textual comment. `{ "comment": "Working on it now." }`

### 5. Users (Profiles)
- **`[AUTH] GET /api/users/me`** — Retrieve my own profile.
- **`[AUTH] PATCH /api/users/me`** — Adjust phone or email of the authenticated user. `{ "phone": "999999999" }`

---
> **Frontend Note:** Ensure your frontend URL fetch logic targets `http://localhost:8080/api/` as built in this repository.
