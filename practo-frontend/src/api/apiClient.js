import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    console.error("API Error:", error.response || error.message);

    // Unauthorized
    if (error.response?.status === 401) {
      toast.error("Please login first");

      window.location.href = "/login";
    }

    // Forbidden
    if (error.response?.status === 403) {
      toast.error("Access denied");
    }

    // Server Error
    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    // Network Error
    if (!error.response) {
      toast.error("Network error. Check your internet connection.");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
