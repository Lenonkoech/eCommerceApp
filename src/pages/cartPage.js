import React, { useEffect, useState } from "react";
import { addQuantity, reduceQuantity, clearCart, removeItemFromCart, fetchUserCart } from "../services/cart";
import axios from "axios";
import "../../src/Assets/css/main.css";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import { jwtDecode } from "jwt-decode";

const IMAGE_URL = "https://localhost:3000/";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            fetchCartItems(user.userId);
        }
    }, [user]);

    const fetchCartItems = async (userId) => {
        if (!userId) return;
        try {
            setLoading(true);
            const response = await fetchUserCart(userId);
            setCartItems(response || []); // Ensure it defaults to an empty array
        } catch (err) {
            setError("Failed to fetch cart items.");
        } finally {
            setLoading(false);
        }
    };

    const handleIncrease = async (cartItemId) => {
        if (!user?.userId) return;
        await addQuantity(cartItemId);
        fetchCartItems(user.userId);
    };

    const handleDecrease = async (cartItemId, quantity) => {
        if (!user?.userId) return;
        if (quantity === 1) {
            await removeItemFromCart(cartItemId);
        } else {
            await reduceQuantity(cartItemId);
        }
        fetchCartItems(user.userId);
    };

    const handleClearCart = async () => {
        if (!user?.userId) return;
        await clearCart(user.userId);
        fetchCartItems(user.userId);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const salesTax = subtotal * 0.1;
    const totalPrice = subtotal + salesTax;

    if (loading) return <p className="loading">Loading cart...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <>
            <HeaderComponent />
            <div className="cart-container">
                <h2 className="cart-title">Your Cart ({cartItems.length} items)</h2>

                {cartItems.length === 0 ? (
                    <p className="empty-cart-message">Your cart is empty. Start shopping now!</p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.cartItemId} className="cart-item">
                                    <img src={`${IMAGE_URL}${item.product?.imageUrl}`} alt={item.product?.name} className="cart-image" />
                                    <div className="cart-details">
                                        <p className="cart-item-name">{item.product?.name}</p>
                                        <p className="cart-item-price">KES {item.product?.price?.toLocaleString()}</p>
                                        <div className="cart-quantity">
                                            <button onClick={() => handleDecrease(item.cartItemId, item.quantity)} className="quantity-btn">-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleIncrease(item.cartItemId)} className="quantity-btn">+</button>
                                        </div>
                                    </div>
                                    <p className="cart-total">KES {(item.product?.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <p>Subtotal: <span>KES {subtotal.toFixed(2)}</span></p>
                            <p>Sales Tax: <span>KES {salesTax.toFixed(2)}</span></p>
                            <h3>Grand Total: <span>KES {totalPrice.toFixed(2)}</span></h3>
                            <button className="checkout-btn">Check Out</button>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CartPage;
