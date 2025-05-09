import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import { fetchUserCart } from "../services/cart";
import { jwtDecode } from "jwt-decode";
import { BASE_IMAGE_URL } from "../components/products";
import "../../src/Assets/css/main.css";
import '../Assets/css/notification.css';
import { useNotification } from "../context/NotificationContext";

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name: "",
        phone: "",
        address: "",
        paymentMethod: "mpesa",
    });
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userIdString = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                const userId = parseInt(userIdString, 10);
                if (!isNaN(userId)) setUser({ userId });
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        if (user?.userId) fetchCartItems(user.userId);
    }, [user]);

    const fetchCartItems = async (userId) => {
        try {
            setLoading(true);
            const response = await fetchUserCart(userId);
            setCartItems(response || []);
        } catch (err) {
            setError("Failed to fetch cart items.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            showNotification("Geolocation is not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserDetails({ ...userDetails, address: `Lat: ${latitude}, Lng: ${longitude}` });
            },
            () => {
                showNotification("Location access denied. Please enter your address manually.");
            }
        );
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((acc, item) => {
            const price = item.product?.price || 0;
            const discount = item.product?.discount || 0;
            const discountedPrice = price - (price * discount) / 100;
            return acc + discountedPrice * item.quantity;
        }, 0);
        const tax = subtotal * 0.1;
        return { subtotal, tax, total: subtotal + tax };
    };

    const handleCheckout = () => {
        if (!userDetails.name || !userDetails.phone || !userDetails.address) {
            showNotification("Please fill in all details");
            return;
        }

        const totalAmount = calculateTotal().total;

        navigate('/payment', { state: { totalAmount, userPhone: userDetails.phone } });
    };
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

        // Ensure it starts with "254"
        if (!value.startsWith("254")) {
            value = "254" + value.replace(/^254/, ""); // Avoid duplicate "254"
        }

        // Limit to exactly 12 digits (2547xxxxxxxx)
        if (value.length > 12) {
            value = value.slice(0, 12);
        }

        setUserDetails({ ...userDetails, phone: value });
    };


    if (loading) return <p className="loading">Loading cart...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <>
            <HeaderComponent />
            <div className="checkout-container">
                <h2 className="checkout-title">Checkout</h2>
                <div className="checkout-content">
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        {cartItems.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.cartItemId} className="cart-item">
                                    <img src={`${BASE_IMAGE_URL}${item.product?.imageUrl}`} alt={item.product?.name} className="cart-image" />
                                    <div className="cart-details">
                                        <p>{item.product?.name}</p>
                                        <p>KES {item.product?.price.toLocaleString()} x {item.quantity}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        <hr />
                        <p><strong>Subtotal:</strong> KES {calculateTotal().subtotal.toFixed(2)}</p>
                        <p><strong>Tax:</strong> KES {calculateTotal().tax.toFixed(2)}</p>
                        <p><strong>Total:</strong> KES {calculateTotal().total.toFixed(2)}</p>
                    </div>

                    <div className="user-details">
                        <h3>Shipping Details</h3>
                        <input type="text" name="name" placeholder="Full Name" value={userDetails.name} onChange={handleChange} required />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="2547XXXXXXXX"
                            value={userDetails.phone}
                            onChange={handlePhoneChange}
                            maxLength={12}
                            pattern="2547[0-9]{8}"
                            required
                        />

                        <input type="text" name="address" placeholder="Shipping Address" value={userDetails.address} onChange={handleChange} required />
                        <button onClick={requestLocation} className="location-btn">Use My Current Location</button>
                        <button onClick={handleCheckout} className="checkout-btn">Proceed to Payment</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;
