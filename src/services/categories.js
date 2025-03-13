import axios from "axios";

const BASE_URL = "http://localhost:5294/api/Category";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// fetching all categories
export const fetchCategories = async () => {
    try {
        const response = await api.get();
        return response.data;
    } catch (error) {
        console.error("Error fetching categories", error.response?.data || error.message);
    }
}

// Fetching categories by Id
export const fetchCategoryById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category:", error.response?.data || error.message);
        throw error;
    }
}
// Adding new category
export const addCategory = async () => {
    try {
        const payload = {
            categoryName: "",
        }
        const response = await api.post('/', payload);
        return response.data;
    } catch (error) {
        console.error("Error adding new Category:", error.response?.data || error.message);
        throw error;
    }

}
// editing existing categoryName
export const editCategory = async () => {
    try {
        const payload = {
            categoryName: '',
        }
        const response = await api.put('/', payload);
        return response.data;
    } catch (error) {
        console.error("Error updating categoryName", error.response?.data || error.message);
        throw error;
    }

}
// deleting category
export const deleteCategory = async (id) => {
    try {
        const response = await api.delete('/', id);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error.response?.data || error.message);
        throw error;
    }
}