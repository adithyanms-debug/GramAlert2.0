# GramAlert 🏛️

> A modern civic grievance management system connecting villagers and local administrators.

📚 Full Documentation: **[`/docs`](docs)**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)

---

# ✨ Overview

**GramAlert** is a civic engagement platform that enables villagers to report local issues and allows administrators to manage and resolve them efficiently.

The system provides a **role-based dashboard** for villagers, administrators, and super administrators, enabling transparent communication and grievance tracking.

---

# 👥 User Roles

### Villagers

* Submit grievances
* Track grievance status
* Receive official alerts
* View grievance history

### Administrators

* Manage village grievances
* Update grievance status
* Manage villagers
* Broadcast alerts

### Super Administrators

* Manage administrators
* Monitor all grievances
* Oversee system activity

---

# 🚀 Quick Start

### Run the Frontend

```bash
cd Frontend
npm install
npm run dev
```

App will start at:

```
http://localhost:3000
```

### Example Routes

| Role        | Route         |
| ----------- | ------------- |
| Villager    | `/villager`   |
| Admin       | `/admin`      |
| Super Admin | `/superadmin` |

---

# 🛠 Technology Stack

**Frontend**

* React 18
* TypeScript
* React Router
* Tailwind CSS v4
* Radix UI

**Libraries**

* Motion (animations)
* Leaflet + React-Leaflet (maps)
* React Hook Form
* Sonner (notifications)
* Lucide React (icons)

---

# 📁 Project Structure

```
Gramalert2.0/
│
├── Frontend/
│   └── src/app/
│       ├── components/
│       ├── pages/
│       ├── types/
│       ├── constants/
│       ├── data/
│       ├── utils/
│       ├── App.tsx
│       └── routes.ts
│
├── docs/
│   ├── QUICK_START.md
│   ├── PROJECT_STRUCTURE.md
│   ├── CHANGELOG.md
│   └── IMPROVEMENTS_SUMMARY.md
│
└── README.md
```

For detailed architecture see:

🧱 **[Project Structure](docs/PROJECT_STRUCTURE.md)**

---

# 🎨 Key Features

* Role-based dashboards
* Grievance submission & tracking
* Location selection using maps
* Alert broadcasting system
* Responsive mobile-first design
* Glassmorphism UI
* Toast notification system
* Error boundary & 404 handling

---

# 📚 Documentation

Detailed documentation is available in the **docs** folder.

* 📘 **[Quick Start Guide](docs/QUICK_START.md)**
* 🧱 **[Project Structure](docs/PROJECT_STRUCTURE.md)**
* 📜 **[Changelog](docs/CHANGELOG.md)**
* ⚡ **[Improvements Summary](docs/IMPROVEMENTS_SUMMARY.md)**

---

# 🚀 Future Enhancements

Planned improvements:

* Backend API integration
* Real-time notifications
* Image upload support
* Advanced search and filtering
* Data export (CSV/PDF)
* Multi-language support
* Dark mode
* Mobile app version

---

# 🤝 Contributing

Contributions are welcome.

Before contributing:

1. Review the documentation in `/docs`
2. Follow the existing project structure
3. Maintain TypeScript type safety
4. Use existing constants and utilities

---



---

**Made with ❤️ for better civic engagement**
