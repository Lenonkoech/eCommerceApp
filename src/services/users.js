import axios from "axios";

const API_URL = "http://localhost:5294/api/User";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

export const fetchUser = async (id) => {
    try {
        const response = await api.get(id);
        return response.data;
    } catch (error) {

    }
}
export const fetchUserById = async (id) => {
    try {
        const response = await api.get(id);
        return response.data;
    } catch (error) {
        console.error("Cannot fetch userdetails", error.response?.data || error.message);
        throw error; 
    }
}
export const editUserProfile = async (id, payload) => {
    try {
        const response = await api.put(id, payload);
        return response.data;
    } catch (error) {
        console.error("Error upadting userDatils:", error.response?.data || error.message);
        throw error;
    }
}