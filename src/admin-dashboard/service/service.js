import axios from "axios";

const API_URL = "http://localhost:5294/api/Admin/login"; // Replace with your actual API URL

export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });

    if (response.data.token) {
      // Store token in sessionStorage
      sessionStorage.setItem("adminToken", response.data.token);
      return { success: true, token: response.data.token };
    } else {
      throw new Error("Invalid login response");
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

export const logoutAdmin = () => {
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("refreshToken");
};
