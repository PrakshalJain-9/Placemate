import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        // Send each role type back to their own login page
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user) {
        if (!allowedRoles.includes(user.role)) {
            // User is authenticated but doesn't have the right role for this route —
            // bounce them to their correct dashboard.
            if (user.role === 'SUPERADMIN' || user.role === 'INSTITUTION') {
                return <Navigate to="/admin/dashboard" replace />;
            }
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children ? children : <Outlet />;
};