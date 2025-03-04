import axios from "axios";

const API_URL = "http://localhost:5294/api/User";

// Create Axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

export const fetchUser=async (id)=>{
try {
    const response = await api.get(id);
} catch (error) {
    
}
}