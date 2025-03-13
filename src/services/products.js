import axios from "axios";

const API_URL = "http://localhost:5294/api/Product";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Fetch a single product by ID
export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error.response?.data || error.message);
        throw error;
    }
};

// Fetch all products
export const fetchProducts = async (limit) => {
    try {
        const response = await axios.get(`${API_URL}?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw error;
    }
};



// Upload image to the server (assuming backend supports image upload)
export const uploadImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axios.post("http://localhost:5294/api/Upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.imageUrl; // Assuming backend returns the image URL
    } catch (error) {
        console.error("Error uploading image:", error.response?.data || error.message);
        throw error;
    }
};

// Add a new product
export const addProduct = async (formData) => {
    try {
        const response = await api.post('/', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error adding product:", error.response?.data || error.message);
        throw error;
    }
};


export const updateProduct = async (id, updatedFields) => {
    try {
        const formData = new FormData();

        // Add only the fields that are updated
        Object.keys(updatedFields).forEach((key) => {
            if (updatedFields[key] !== null && updatedFields[key] !== undefined && updatedFields[key] !== "") {
                formData.append(key, updatedFields[key]);
            }
        });

        const response = await axios.put(`http://localhost:5294/api/Product/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating product:", error.response?.data || error.message);
        if (error.response?.data?.errors) {
            console.error("Validation Errors:", error.response.data.errors);
        }
        throw error;
    }
};




// Delete a product
export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchOfferProducts = async () => {
    try {
        const response = await api.get(`/offers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Offer prodcucts:", error.response?.data || error.message);
    }
}