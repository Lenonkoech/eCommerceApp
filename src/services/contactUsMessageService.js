import axios from "axios";

const BASE_URL = "http://localhost:5294/api/MessageQueries";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

export const postMessage = async (data) => {
    try {
        const response = await api.post("/", data); // Ensure data is included in the request
        return response.data;
    } catch (error) {
        console.error("Message not sent", error.response?.data || error.message);
        throw error;
    }
};
