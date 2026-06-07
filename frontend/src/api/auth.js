import { api } from "./axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
export const requestEmailOtp = async (email) => {
    console.log(email);
    try {
        const response = await api.post(
            `/api/auth/superadmin/sendotp`,
            { "emailId": email }
        );

        return response.data;
    } catch (error) {
        throw error
    }
}


export const verifyOtpAndRegister = async (userRegisterRequest) => {
    try {
        const response = await api.post(
            `/api/auth/superadmin/validateotp`,
            userRegisterRequest
        )
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
    try {
        await api.post(
            `/api/auth/logout   `
        )
    } catch (error) {
        throw error;
    } finally {
        window.location.href = '\login';
    }
};


export const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`
}


export const loginSuperAdmin = async (requestData) => {
    try {
        const response = await api.post("/api/auth/superadmin/login", requestData);
        console.log(response);
        return response.data;

    } catch (error) {
        throw error;
    }
}