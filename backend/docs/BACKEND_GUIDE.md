# Backend Documentation - GramAlert

## API Endpoints

### Authentication
- `POST /api/auth/login`: Authenticate users and receive a JWT. Supports Villager, Admin, and SuperAdmin roles.
- `GET /api/users/me`: Retrieve current authenticated user profile.

### Grievances
- `GET /api/grievances`: List all grievances (Admin/SuperAdmin) or personal grievances (Villager).
- `POST /api/grievances`: Submit a new grievance. Supports multipart/form-data for image uploads.
- `PATCH /api/grievances/:id/status`: Update the status of a grievance (Admin only).
- `PUT /api/grievances/:id`: Edit a personal grievance (Villager only, conditional on status).
- `DELETE /api/grievances/:id`: Delete a personal grievance (Villager only, conditional on status).

### Comments
- `GET /api/grievances/:id/comments`: List all comments for a specific grievance.
- `POST /api/grievances/:id/comments`: Post a new comment. Supports internal/external visibility.

### Alerts
- `GET /api/alerts`: List all active broadcasts.
- `POST /api/alerts`: Create a new alert broadcast (Admin/SuperAdmin).
- `PUT /api/alerts/:id`: Update an existing alert.
- `DELETE /api/alerts/:id`: Remove an alert.

### SuperAdmin
- `POST /api/superadmin/admins`: Create new administrative accounts.
- `GET /api/superadmin/dashboard`: Global system metrics and activity logs.

---

## Authentication System
GramAlert uses **JSON Web Tokens (JWT)** for stateless authentication.
- Tokens are stored in the client's `localStorage` with role-specific keys (`villager_token`, `admin_token`, `superadmin_token`).
- Tokens are sent in the `Authorization: Bearer <token>` header for all protected requests.

## Role-Based Authorization
Access control is enforced via middleware:
- `auth`: Verifies the JWT and attaches the user object to the request.
- `roleGuard`: Ensures the user possesses the required role (Villager, Admin, or SuperAdmin) for the requested resource.

## Database Schema Overview
The system uses **PostgreSQL** with the following primary tables:
- `users`: Stores villager profiles and credentials.
- `admins` / `super_admins`: Separate tables for high-privileged accounts.
- `grievances`: Core table for tracking community issues, locations, and images.
- `alerts`: Stores community-wide broadcasts.
- `comments`: Tracks discussions on grievances.

## Escalation Service
The backend includes an **Escalation Cron Job** that runs periodically:
- It monitors grievances that remain in "Received" status for too long.
- Automatically flags or escalates issues to ensure timely resolution by administrators.
