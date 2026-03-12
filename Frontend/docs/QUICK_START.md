# GramAlert – Quick Start Guide 🚀

## 1. Clone the Project

git clone https://github.com/yourusername/gramalert.git
cd gramalert

## 2. Install Dependencies

npm install

## 3. Start Development Server

npm run dev

Open in browser:

http://localhost:5173

---

# Application Routes

## Villager

Dashboard
/villager

Submit Grievance
/villager/submit

My Grievances
/villager/grievances

Alerts
/villager/alerts

---

## Administrator

Dashboard
/admin

Manage Grievances
/admin/grievances

Manage Villagers
/admin/villagers

Broadcast Alerts
/admin/alerts

---

## Super Administrator

Dashboard
/superadmin

Manage Admins
/superadmin/admins

All Grievances
/superadmin/grievances

All Alerts
/superadmin/alerts

---

## Key Files

src/app/pages → All application pages  
src/app/components → Reusable components  
src/app/types → TypeScript interfaces  
src/app/constants → Shared constants  
src/app/utils → Helper functions  
src/app/data → Mock data

---

## Next Steps

Read the full documentation:

PROJECT_STRUCTURE.md → architecture explanation  
CHANGELOG.md → version history