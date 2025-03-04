import React, { useEffect, useState } from "react";
import { addQuantity, reduceQuantity, clearCart, removeItemFromCart } from "../services/cart";
import axios from "axios";
import "../../src/Assets/css/main.css";
import { fetchProductById } from "../services/products";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";

const API_URL = "http://localhost:5294/api/ShoppingCart";
const IMAGE_URL = "https://localhost:3000/";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);

            // Fetch product details in parallel
            const products = await Promise.all(
                response.data.map(async (item) => {
                    const product = await fetchProductById(item.productId);
                    return { ...item, product };
                })
            );

            setCartItems(products);
        } catch (err) {
            setError("Failed to fetch cart items.");
        } finally {
            setLoading(false);
        }
    };

    const handleIncrease = async (cartItemId) => {
        await addQuantity(cartItemId);
        fetchCartItems();
    };

    const handleDecrease = async (cartItemId, quantity) => {
        if (quantity === 1) {
            await removeItemFromCart(cartItemId);
        } else {
            await reduceQuantity(cartItemId);
        }
        fetchCartItems();
    };

    const handleClearCart = async () => {
        await clearCart();
        fetchCartItems();
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const salesTax = subtotal * 0.1; // Assume 10% sales tax
    const totalPrice = subtotal + salesTax;

    if (loading) return <p className="loading">Loading cart...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <>
            <HeaderComponent />
            <div className="cart-container">
                <h2 className="cart-title">Your Cart ({cartItems.length} items)</h2>
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.cartItemId} className="cart-item">
                            <img src={`${IMAGE_URL}${item.product?.imageUrl}` || "placeholder.jpg"} alt={item.product?.name} className="cart-image" />
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
                    <p>Coupon Code: <span className="coupon-code">Add Coupon</span></p>
                    <h3>Grand Total: <span>KES {totalPrice.toFixed(2)}</span></h3>
                    <p className="free-shipping">Congrats, you're eligible for Free Shipping .</p>
                    <button className="checkout-btn">Check Out</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CartPage;
