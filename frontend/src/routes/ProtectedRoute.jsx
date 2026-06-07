import { Children } from "react";
import { Navigate, Outlet, useActionData } from "react-router-dom";
import useAuth from "../contexts/AuthContext";


export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/student/login" replace />;
    }

    return children ? children : <Outlet />
}   