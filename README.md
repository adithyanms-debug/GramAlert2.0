GramAlert 🏛️

GramAlert is a community grievance reporting and civic alert platform that allows villagers to report local issues while enabling administrators to manage grievances and broadcast important alerts.

The platform provides:

Grievance submission

Map-based issue reporting

Community discussion via comments

Administrative alert broadcasting

Hierarchical governance management

Project Overview

GramAlert is designed to bridge the communication gap between citizens and local governance.

It provides a transparent and efficient system for:

reporting civic problems

tracking resolution progress

enabling community participation

improving administrative response

The platform helps local governments monitor community issues while keeping citizens informed through real-time alerts and status updates.

Current Features
User Features (Villagers)

Submit grievance
Report issues with title, description, category, image upload, and interactive map location pin.

Edit/Delete grievance
Users can manage their submitted grievances until the issue moves to In Progress.

Comment on grievances
Participate in discussions about reported problems.

View grievance status
Track grievance progress in real-time.

Map-based visualization
View reported community issues on an interactive map.

Admin Features

Manage grievances
Review and organize community complaints.

Update grievance status
Workflow management:
Received → In Progress → Resolved / Rejected

Broadcast alerts
Send announcements related to emergencies, water, electricity, or health updates.

Edit/Delete alerts
Maintain accuracy of broadcasted alerts.

Dashboard analytics
Overview of grievance statistics and system activity.

SuperAdmin Features

Create administrators
Recruit and manage administrative users.

System overview dashboard
Monitor system activity and grievance metrics.

Manage administrators
Control access and oversee administrator roles.

System Architecture
Frontend
React + TypeScript + Tailwind CSS
Backend
Node.js + Express
Database
PostgreSQL
Other Technologies

JWT Authentication — Secure role-based access control

Axios API Client — Promise-based HTTP client for API communication

Leaflet / MapLibre — Interactive map visualization

Sonner Toast Notifications — Real-time user feedback and alerts

Project Structure
GramAlert/
│
├── Frontend/              # React application
│   ├── src/               # Components, pages, assets
│   ├── docs/              # Frontend documentation
│   └── package.json
│
├── backend/               # Express server
│   ├── src/               # Controllers, routes, middleware
│   ├── docs/              # Backend documentation
│   └── server.js
│
└── README.md              # Main project documentation
Documentation

Detailed documentation for the system can be found in the following folders.

Frontend Documentation

Frontend Guide

Project Structure

Quick Start Guide

Changelog

Attributions

Backend Documentation

Backend Guide

Running the Project
Prerequisites

Node.js v18+

PostgreSQL database

Backend Setup
cd backend
npm install
npm run dev
Frontend Setup
cd Frontend
npm install
npm run dev
Planned Features

Future upgrades planned for GramAlert:

Priority scoring algorithm
Automatically rank grievances based on severity and community impact.

Community upvote system
Allow villagers to upvote grievances to indicate importance.

Automatic grievance escalation
Escalate unresolved grievances to higher authorities after a defined time period.

AI-assisted duplicate detection
Detect similar complaints and group related issues.

AI-generated alerts
Automatically generate alerts based on system events and environmental data.

❤️ Civic Technology Initiative

Made with ❤️ to improve civic engagement, transparency, and public service efficiency.