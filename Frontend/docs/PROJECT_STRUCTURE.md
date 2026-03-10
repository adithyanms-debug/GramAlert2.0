# GramAlert - Project Structure

## Overview
GramAlert is a futuristic civic grievance management system that connects villagers and local administrators through structured issue reporting and alert broadcasting.

## Technology Stack
- **Frontend Framework**: React 18.3.1
- **Routing**: React Router 7
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI
- **Maps**: Leaflet & React-Leaflet
- **Forms**: React Hook Form
- **Notifications**: Sonner (Toast)
- **Icons**: Lucide React

## Project Structure

```
/src/app/
├── App.tsx                      # Main app component with error boundary
├── routes.ts                    # React Router configuration
│
├── components/                  # Reusable components
│   ├── DashboardLayout.tsx      # Main layout with sidebar and navigation
│   ├── ErrorBoundary.tsx        # Error boundary component
│   ├── GrievanceDetailsDialog.tsx  # Grievance details modal
│   ├── LocationPicker.tsx       # Interactive map location picker
│   ├── NotificationsDropdown.tsx   # Notifications dropdown
│   ├── ProfileDropdown.tsx      # User profile dropdown
│   └── ui/                      # Shadcn UI components
│
├── pages/                       # Page components
│   ├── Landing.tsx              # Landing page
│   ├── Auth.tsx                 # Villager authentication
│   ├── AdminAuth.tsx            # Admin authentication
│   ├── SuperAdminAuth.tsx       # Super admin authentication
│   ├── VillagerDashboard.tsx    # Villager dashboard
│   ├── SubmitGrievance.tsx      # Grievance submission form
│   ├── MyGrievances.tsx         # Villager's grievances list
│   ├── Alerts.tsx               # Villager alerts page
│   ├── VillagerProfile.tsx      # Villager profile page
│   ├── AdminDashboard.tsx       # Admin dashboard
│   ├── AdminGrievances.tsx      # Admin grievances management
│   ├── AdminVillagers.tsx       # Villager management
│   ├── AdminAlerts.tsx          # Alert broadcasting
│   ├── AdminProfile.tsx         # Admin profile page
│   ├── SuperAdminDashboard.tsx  # Super admin dashboard
│   ├── SuperAdminProfile.tsx    # Super admin profile page
│   ├── Settings.tsx             # Settings page (all roles)
│   └── NotFound.tsx             # 404 page
│
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Shared interfaces and types
│
├── constants/                   # Application constants
│   └── index.ts                 # Theme configs, categories, etc.
│
├── data/                        # Mock data
│   └── mockData.ts              # Sample grievances, alerts, users
│
└── utils/                       # Utility functions
    └── helpers.ts               # Helper functions (formatting, validation)
```

## Key Features

### Role-Based Access
- **Villagers**: Submit grievances, track status, view alerts
- **Administrators**: Manage grievances, villagers, broadcast alerts
- **Super Administrators**: Manage admins, oversee all grievances and alerts

### Design System
- **Color Themes**:
  - Villagers: Teal/Emerald gradient
  - Admins: Blue/Indigo gradient
  - Super Admins: Purple/Violet gradient
- **Styling**: Glassmorphism with backdrop blur effects
- **Typography**: Clean sans-serif with gradient text accents
- **Icons**: Outline-based minimal icons from Lucide

### Core Components

#### LocationPicker
- Interactive Leaflet map
- Search functionality (OpenStreetMap Nominatim API)
- Current location detection
- Click-to-pin location selection
- Toast notifications for feedback

#### DashboardLayout
- Responsive sidebar navigation
- Role-based theming
- Mobile-friendly with overlay
- Profile and notifications dropdowns

#### ErrorBoundary
- Global error catching
- Graceful error display
- Development mode error details

## Data Flow
Currently, all data is managed in local component state. The project includes:
- Mock data in `/src/app/data/mockData.ts`
- TypeScript interfaces in `/src/app/types/index.ts`
- Ready for backend integration (Supabase, REST API, GraphQL, etc.)

## Routing Structure

### Public Routes
- `/` - Landing page

### Villager Routes
- `/villager` - Dashboard
- `/villager/submit` - Submit grievance
- `/villager/grievances` - My grievances
- `/villager/alerts` - Alerts
- `/villager/profile` - Profile
- `/villager/settings` - Settings

### Admin Routes
- `/admin` - Dashboard
- `/admin/grievances` - All grievances
- `/admin/villagers` - Villager management
- `/admin/alerts` - Broadcast alerts
- `/admin/profile` - Profile
- `/admin/settings` - Settings

### Super Admin Routes
- `/superadmin` - Dashboard
- `/superadmin/admins` - Admin management
- `/superadmin/grievances` - All grievances
- `/superadmin/alerts` - All alerts
- `/superadmin/profile` - Profile
- `/superadmin/settings` - Settings

### Error Routes
- `*` - 404 Not Found page

## State Management
The application uses React hooks for state management:
- `useState` for local component state
- `useLocation` for route-based logic
- `useNavigate` for programmatic navigation
- `useEffect` for side effects and lifecycle

## Styling Approach
- Tailwind CSS v4 for utility-first styling
- Custom theme tokens in `/src/styles/theme.css`
- Glassmorphism: `bg-white/70 backdrop-blur-sm`
- Consistent spacing and border radius
- Responsive design with mobile-first approach

## Best Practices
- ✅ TypeScript for type safety
- ✅ Component composition and reusability
- ✅ Centralized constants and configurations
- ✅ Error boundary for error handling
- ✅ Toast notifications for user feedback
- ✅ Responsive design
- ✅ Accessible UI components (Radix UI)
- ✅ Clean code structure with separation of concerns

## Development Notes
- All forms use controlled components
- LocationPicker avoids nested forms (React best practice)
- react-leaflet uses proper hooks (useMap, useMapEvents)
- Consistent animation delays for staggered effects
- Mobile-responsive with hamburger menu
- Proper TypeScript typing throughout

## Future Enhancements
- Backend integration (Supabase/API)
- Real-time notifications
- Image upload to cloud storage
- Advanced filtering and search
- Data export functionality
- Multi-language support
- Dark mode theme
- Email notifications
- SMS alerts
- Analytics dashboard
