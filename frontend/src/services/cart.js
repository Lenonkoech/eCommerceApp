import axios from "axios";
import { useNotification } from "../context/NotificationContext";

const API_URL = "http://localhost:5294/api/ShoppingCart";


const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});
export const fetchUserCart = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:5294/api/ShoppingCart/user/${userId}`);
        return response.data; // Ensure you return the data, not the full response
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error; // Rethrow error for better debugging
    }
};


export const addItemToCart = async ({ productId, userId, quantity }) => {
    try {
        const payload = {
            // cartItemId: 0,
            userId: parseInt(userId, 10),
            productId: parseInt(productId, 10),
            quantity: parseInt(quantity, 10),
            addedAt: new Date().toISOString(),
        };
        // console.log(payload);

        // console.log("Sending request to add item:", payload) ;

        const response = await api.post("/", payload);

        // console.log("Item added successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding item:", error.response?.data || error.message);
        throw new Error(error.response?.data?.title || "Failed to add item to cart.");
    }
};

//  INCREASE QUANTITY
export const addQuantity = async (cartItemId) => {
    try {
        // console.log(`Increasing quantity for: ${cartItemId}`);
        const response = await api.patch(`/increase/${cartItemId}`);
        // console.log("Quantity increased:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error increasing quantity:", error.response?.data || error.message);
        throw error;
    }
};

//  DECREASE QUANTITY

export const reduceQuantity = async (cartItemId, quantity, showNotification) => {
    try {
        if (quantity === 1) {
            await removeItemFromCart(cartItemId);
            showNotification("Item removed from cart");
            return;
        }

        const response = await api.patch(`/decrease/${cartItemId}`);
        return response.data;
    } catch (error) {
        console.error("Error decreasing quantity:", error.response?.data || error.message);
        throw error;
    }
};


//  REMOVE ITEM FROM CART
export const removeItemFromCart = async (cartItemId) => {
    try {
        // console.log(`Removing cart item: ${cartItemId}`);
        const response = await api.delete(`/${cartItemId}`);
        // console.log("Item removed:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error removing item:", error.response?.data || error.message);
        throw error;
    }
};

//  CLEAR ENTIRE CART
export const clearCart = async () => {
    try {
        console.log("Clearing cart...");
        const response = await api.delete("");
        console.log("Cart cleared:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error.response?.data || error.message);
        throw error;
    }
};