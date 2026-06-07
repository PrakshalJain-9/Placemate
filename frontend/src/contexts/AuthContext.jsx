import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";
import { logout } from "../api/auth";

const AuthContext = createContext(null);

export const Authprovider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.get('/api/user/me')
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuthStatus();
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
    }

    const logoutUser = async () => {
        setUser(null);
        await logout();
    }

    if (loading) {
        return <h1>"Please wait while we are loading"</h1>
    }
    return <AuthContext.Provider value={{
        user,
        isAuthenticated: !!user,
        login: loginUser,
        logout: logoutUser
    }}>
        {children}
    </AuthContext.Provider>
}

export default function useAuth() {
    return useContext(AuthContext);
}