import axios from "axios";

const API_URL = "http://localhost:5294/api/Product";

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetchng product", error.response?.data || error.message);
        throw error;
    }
}

export const fetchAllProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error("Error fetchng product", error.response?.data || error.message);
        throw error;
    }
}