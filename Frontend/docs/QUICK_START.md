# GramAlert – Quick Start Guide 🚀

## 1. Prerequisites
- **Node.js**: v18 or higher
- **PostgreSQL**: Running instance for the backend

## 2. Clone the Project
```bash
git clone https://github.com/yourusername/gramalert.git
cd gramalert
```

## 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend server will start at `http://localhost:8080`.

## 4. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

---

# Application Access

### Default Credentials
- **SuperAdmin**: `superadmin / GramAlert@2026`
- **Admin**: `admin / password`
- **Villager**: `villager / password` (or register a new account)

### Role-Based Portals

| Role | Dashboard Route |
| --- | --- |
| **Villager** | `/villager` |
| **Administrator** | `/admin` |
| **Super Administrator** | `/superadmin` |

---

# Next Steps
- Read **[`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)** for architecture details.
- Check **[`BACKEND_GUIDE.md`](../../backend/docs/BACKEND_GUIDE.md)** for API documentation.
- See **[`FRONTEND_GUIDE.md`](FRONTEND_GUIDE.md)** for UI implementation details.