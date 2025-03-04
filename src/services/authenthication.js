import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5294/api/User";

// Create Axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Add request interceptor with token validation and refresh
api.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    // Token expired, attempt refresh
                    const refreshToken = sessionStorage.getItem("refreshToken");
                    if (refreshToken) {
                        try {
                            const refreshResponse = await api.post("/refresh-token", { refreshToken }); // Assuming a /refresh-token endpoint
                            const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;
                            sessionStorage.setItem("token", newToken);
                            sessionStorage.setItem("refreshToken", newRefreshToken);
                            config.headers["Authorization"] = `Bearer ${newToken}`;
                            console.log("Token refreshed successfully.");
                        } catch (refreshError) {
                            console.warn("Token refresh failed:", refreshError);
                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("refreshToken");
                            // Optionally, redirect to login or clear user data
                            window.location.href = "/login";
                            throw new Error("Token refresh failed. Please login again."); // Or a more user-friendly message.
                        }
                    } else {
                        sessionStorage.removeItem("token");
                        throw new Error("Token expired and no refresh token found.");
                    }
                } else {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
            } catch (error) {
                console.warn("Invalid token:", error.message);
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("refreshToken");
                throw error;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors more gracefully
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loops
            const refreshToken = sessionStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const refreshResponse = await api.post("/refresh-token", { refreshToken }); // Assuming a /refresh-token endpoint
                    const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;

                    sessionStorage.setItem("token", newToken);
                    sessionStorage.setItem("refreshToken", newRefreshToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return api(originalRequest); // Retry the original request
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("refreshToken");
                    // Optionally, redirect to login or clear user data
                    window.location.href = "/";
                }
            }
        }
        return Promise.reject(error);
    }
);

// Login User
export const loginUser = async (credentials) => {
    try {
        const response = await api.post(`/login`, credentials);
        // console.log("Login response", response.data.token);
        sessionStorage.setItem("token", response.data.token);
        if (response.data?.token && response.data?.refreshToken) {
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
        }

        return response.data;
    } catch (error) {
        let errorMessage = "Login failed.";
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    errorMessage = "Invalid username or password.";
                    break;
                case 400:
                    errorMessage = error.response.data?.message || "Bad request. Please check your input.";
                    break;
                default:
                    errorMessage = `Login failed: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
            }
        } else if (error.request) {
            errorMessage = "Network error. Please check your internet connection.";
        } else {
            errorMessage = error.message || "Login failed.";
        }
        console.error("Login error:", errorMessage);
        throw new Error(errorMessage);
    }
};

// Register User
export const registerUser = async (userData) => {
    try {
        const response = await api.post(`/register`, userData);
        return response.data;
    } catch (error) {
        let errorMessage = "Registration failed. Try again.";
        if (error.response) {
            errorMessage = error.response.data?.message || errorMessage;
        } else {
            errorMessage = error.message || errorMessage;
        }
        console.error("Registration error:", errorMessage);
        throw new Error(errorMessage);
    }
};

// Google Login
export const googleLogin = async (googleToken) => {
    try {
        // Decode and validate Google token
        const decodedToken = jwtDecode(googleToken);
        if (!decodedToken.email || !decodedToken.sub) {
            throw new Error("Invalid Google token: missing required fields.");
        }
        let email = decodedToken?.email;

        const payload = {
            accessToken: googleToken,
            email: email
        };
        const jsonString = JSON.stringify(payload);
        // console.log(jsonString);

        // console.log(jsonString);

        const response = await api.post(`/google-login`, jsonString);

        // console.log("Google login response:", response.data);
        sessionStorage.setItem("token", response.data.token);
        if (response.data?.token && response.data?.refreshToken) {
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
        }

        return response.data;
    } catch (error) {
        let errorMessage = "Google authentication failed.";
        if (error.response) {
            errorMessage = error.response.data?.message || errorMessage;
        } else {
            errorMessage = error.message || errorMessage;
        }
        console.error("Google Login error:", errorMessage);
        throw new Error(errorMessage);
    }
};

// Facebook Login (Updated to match Google structure, and includes email fetch as fallback)
export const facebookLogin = async (facebookToken) => {
    try {
        let decodedToken;
        try {
            decodedToken = jwtDecode(facebookToken); // Try to decode as JWT
        } catch (decodeError) {
            console.warn("Failed to decode Facebook token as JWT, assuming it's an access token.");
            decodedToken = { email: null };
        }

        let email = decodedToken?.email;
        if (!email) {
            // Fallback: Fetch email from Facebook Graph API (if it's an access token)
            try {
                const graphApiUrl = `https://graph.facebook.com/me?fields=email&access_token=${facebookToken}`;
                const graphApiResponse = await axios.get(graphApiUrl);
                email = graphApiResponse.data.email;
            } catch (graphApiError) {
                console.error("Error fetching email from Facebook Graph API:", graphApiError);
                throw new Error("Facebook authentication failed: could not retrieve email.");
            }
        }

        if (!email) {
            throw new Error("Invalid Facebook token: missing email. You may need to fetch user data from Facebook API.");
        }

        const payload = {
            accessToken: facebookToken,
            email: email
        };

        const jsonString = JSON.stringify(payload);
        // console.log(jsonString);

        // console.log("Facebook Login Payload:", jsonString);

        const response = await api.post(`/facebook-login`, jsonString);

        // console.log("Facebook login response:", response.data);
        sessionStorage.setItem("token", response.data.token);
        if (response.data?.token && response.data?.refreshToken) {
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
        }

        return response.data;
    } catch (error) {
        let errorMessage = "Facebook authentication failed.";
        if (error.response) {
            errorMessage = error.response.data?.message || errorMessage;
        } else {
            errorMessage = error.message || errorMessage;
        }
        console.error("Facebook Login error:", errorMessage);
        throw new Error(errorMessage);
    }
};

// Logout User
export const logoutUser = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    // console.log("User logged out");
};