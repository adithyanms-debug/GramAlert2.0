import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import api from "../api";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const getValidToken = () => {
                const superadminToken = localStorage.getItem("superadmin_token");
                const adminToken = localStorage.getItem("admin_token");
                const villagerToken = localStorage.getItem("villager_token") || localStorage.getItem("token");

                if (allowedRoles.includes("SUPERADMIN") && superadminToken) return superadminToken;
                if (allowedRoles.includes("ADMIN") && adminToken) return adminToken;
                if (allowedRoles.includes("VILLAGER") && villagerToken) return villagerToken;

                // Fallback: Return any available token if role is satisfied
                return superadminToken || adminToken || villagerToken;
            };

            const token = getValidToken();
            if (!token) {
                setIsAuthorized(false);
                return;
            }

            try {
                const response = await api.get("users/me", {
                    headers: { Authorization: `Bearer ${token}`, 'X-Auth-Check': 'true' },
                });
                const userRole = response.data.role;

                if (allowedRoles.includes(userRole)) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, [allowedRoles]);

    if (isAuthorized === null) {
        // Show a minimal loading state while checking auth
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="size-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        // If not authorized, redirect to the appropriate auth page
        if (allowedRoles.includes("ADMIN")) return <Navigate to="/admin-auth" state={{ from: location }} />;
        if (allowedRoles.includes("SUPERADMIN")) return <Navigate to="/superadmin-auth" state={{ from: location }} />;
        return <Navigate to="/auth" state={{ from: location }} />;
    }

    return <>{children}</>;
}
