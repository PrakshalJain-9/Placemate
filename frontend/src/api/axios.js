import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }

});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error)
        else prom.resolve();
    });

    failedQueue = [];
}

api.interceptors.response.use((response) => { return response; },
    async (error) => {
        // console.log(error);
        const config = error.config;

        if (config.url.includes('/login') || config.url.includes('/refresh-token')) {
            return Promise.reject(error);
        }

        if (error.response?.status == 401 && !config._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(config);
                }).catch(err => Promise.reject(err))
            }

            isRefreshing = true;
            config._retry = true;

            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/superadmin/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                processQueue(null);
                return api(config);
            } catch (refreshError) {
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }


        return Promise.reject(error);
    })