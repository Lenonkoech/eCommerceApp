import axios from "axios";

const BASE_URL = "http://localhost:5294/api/WishList";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Fetch wishlist items for a user
export const fetchUserWishlist = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/details/user/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch wishlist items");
        }
        const data = await response.json();

        // Extract product details from the response
        return data.map(item => ({
            wishlistId: item.wishListId,
            userId: item.userId,
            productId: item.product.productId,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            imageUrl: item.product.imageUrl,
        }));
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

// Remove an item from the wishlist
export const removeItemFromWishlist = async (wishlistId) => {
    try {
        const response = await fetch(`${BASE_URL}/${wishlistId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to remove item from wishlist");
        }

        return true;
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        return false;
    }
};
export const addToWishlist = async ({userId, productId}) => {
    try {
        const payload = {
            userId: parseInt(userId),
            productId: parseInt(productId),
            addedAt: new Date().toISOString()
        };

        const response = await api.post('/', payload);
        return response.data;
    } catch (error) {
        console.error("Error adding item to wishlist", error.response?.data || error.message);
        throw error;
    }
};


