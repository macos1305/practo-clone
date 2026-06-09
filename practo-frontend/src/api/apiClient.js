
import axios from "axios";

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
      window.location.href = "/login";
    }

    // Forbidden
    if (error.response?.status === 403) {
      alert("Access denied");
    }

    // Server error
    if (error.response?.status >= 500) {
      alert("Server error. Please try again later.");
    }

    // Network error
    if (!error.response) {
      alert("Network error. Check your internet connection.");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
