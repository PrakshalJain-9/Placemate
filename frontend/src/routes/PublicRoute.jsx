import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../contexts/AuthContext";

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        // Redirect based on role if possible, otherwise default to a reasonable dashboard
        if (user?.role === "SUPERADMIN" || user?.role === "INSTITUTION") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return children ? children : <Outlet />;
};
