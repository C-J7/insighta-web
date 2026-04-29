import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true, 
});

// Handle 401s for silent refresh or logout
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Attempt to refresh token or redirect to login
            console.error("Session expired or unauthorized");
        }
        return Promise.reject(error);
    }
);

export default api;