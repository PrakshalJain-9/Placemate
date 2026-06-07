import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthContext = createContext(null);

export const Authprovider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // /api/user/me is authorised for STUDENT, ADMIN and SUPERADMIN alike.
        // A valid cookie (any role) will be accepted and the principal returned.
        api.get('/api/user/me')
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const loginUser = (userData) => setUser(userData);

    const logoutUser = async () => {
        const isSuperAdmin =
            user?.role === 'SUPERADMIN' || user?.role === 'INSTITUTION';

        setUser(null);

        try {
            await api.post('/api/auth/logout');
        } catch {
            // Ignore — clear client session regardless
        }

        // Send each role back to their own login page
        window.location.href = isSuperAdmin ? '/admin/login' : '/login';
    };

    if (loading) {
        return <LoadingSpinner message="Authenticating..." />;
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login: loginUser,
            logout: logoutUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}