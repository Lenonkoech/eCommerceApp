import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserWishlist, removeItemFromWishlist } from "../services/wishlistService";
import { addItemToCart } from "../services/cart";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import { BASE_IMAGE_URL } from "../components/products";
import '../Assets/css/wishlist.css';
import { useNotification } from "../context/NotificationContext";

const WishList = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userIdString =
                    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                const userId = parseInt(userIdString, 10);

                if (!isNaN(userId)) {
                    setUser({ userId });
                } else {
                    console.error("Invalid user ID format:", userIdString);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        if (user?.userId) {
            fetchWishlistItems(user.userId);
        }
    }, [user]);

    const fetchWishlistItems = async (userId) => {
        try {
            setLoading(true);
            const wishlist = await fetchUserWishlist(userId);
            console.log("Fetched Wishlist Data:", wishlist);

            if (!wishlist || wishlist.length === 0) {
                setWishlistItems([]);
                return;
            }

            setWishlistItems(wishlist);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            setError("Failed to fetch wishlist items.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId, wishlistId) => {
        if (!wishlistId) {
            console.error("Error: wishlistId is undefined for product", productId);
            showNotification("Error: Wishlist ID is missing", "error");
            return;
        }

        if (!user?.userId) return;

        try {
            await addItemToCart({
                productId: productId,
                userId: user.userId,
                quantity: 1,
            });

            console.log(`Removing wishlist item with ID: ${wishlistId}`);
            await removeItemFromWishlist(wishlistId);
            showNotification("Item added to cart and removed from wishlist");

            fetchWishlistItems(user.userId);
        } catch (err) {
            console.error("Failed to add item to cart:", err);
            showNotification("Failed to add item to cart", "error");
        }
    };

    if (loading) return <p className="loading">Loading wishlist...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <>
            <HeaderComponent />
            <div className="wishlist-container">
                <h2 className="wishlist-title">Your Wishlist ({wishlistItems.length} items)</h2>

                {wishlistItems.length === 0 ? (
                    <p className="empty-wishlist-message">Your wishlist is empty. Start adding products!</p>
                ) : (
                    <div className="wishlist-items">
                        {wishlistItems.map((item) => (
                            <div key={item.wishlistId} className="wishlist-item">
                                <img src={`${BASE_IMAGE_URL}${item.imageUrl}`} alt={item.name} className="wishlist-image" />
                                <div className="wishlist-details">
                                    <p className="wishlist-item-name">{item.name}</p>
                                    <p className="wishlist-item-price">KES {item.price?.toLocaleString()}</p>
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(item.productId, item.wishlistId)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default WishList;
