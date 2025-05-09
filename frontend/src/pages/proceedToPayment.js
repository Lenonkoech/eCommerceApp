import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderComponent from "../components/header";
import Footer from "../components/footer";
import '../Assets/css/notification.css';
import '../Assets/css/payment.css';

const ProceedToPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalAmount, userPhone } = location.state || {};  // Get data from CheckoutPage

    const [phoneNumber, setPhoneNumber] = useState(userPhone || "");
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!totalAmount) {
            alert("No payment amount provided.");
            navigate("/checkout");
        }
    }, [totalAmount, navigate]);

    const handlePayment = async () => {
        if (!phoneNumber) {
            setErrorMessage("Please enter your phone number.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/mpesa/stkpush", {
                phoneNumber,
                amount: totalAmount
            });

            if (response.data && response.data.ResponseCode === "0") {
                setPaymentStatus("Pending");
                checkPaymentStatus();
            } else {
                setPaymentStatus("Failed");
                setErrorMessage("Payment initiation failed. Try again.");
            }
        } catch (error) {
            console.error("Error initiating payment:", error);
            setPaymentStatus("Failed");
            setErrorMessage("Failed to connect to payment gateway. Check your network.");
        }
        setIsLoading(false);
    };

    const checkPaymentStatus = async () => {
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/mpesa/payment-status/${phoneNumber}`);

                if (response.data.status === "Success") {
                    clearInterval(interval);
                    setPaymentStatus("Success");
                    alert("Payment successful! Your order has been placed.");
                    clearUserCart();
                    navigate("/order-confirmation");
                } else if (response.data.status === "Failed") {
                    clearInterval(interval);
                    setPaymentStatus("Failed");
                    setErrorMessage("Payment failed. Please try again.");
                }
            } catch (error) {
                console.error("Error checking payment status:", error);
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                setPaymentStatus("Failed");
                setErrorMessage("Payment took too long. Try again.");
            }
        }, 5000);
    };

    const clearUserCart = async () => {
        try {
            await axios.post(`http://localhost:5000/api/cart/clear`, { phoneNumber });
        } catch (error) {
            console.error("Failed to clear cart:", error);
        }
    };

    return (
        <>
            <HeaderComponent />
            <div className="payment-container">
                <h2 className="payment-title">Proceed to Payment</h2>
                <p><strong>Total Amount:</strong> KES {totalAmount?.toLocaleString()}</p>

                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your M-Pesa number"
                    disabled={isLoading}
                />

                <button onClick={handlePayment} disabled={isLoading} className="payment-btn">
                    {isLoading ? "Processing..." : "Pay with M-Pesa"}
                </button>

                {paymentStatus === "Pending" && <p className="pending-msg">Waiting for M-Pesa confirmation...</p>}
                {paymentStatus === "Success" && <p className="success-msg">Payment Successful! Redirecting...</p>}
                {paymentStatus === "Failed" && <p className="error-msg">{errorMessage}</p>}
            </div>
            <Footer />
        </>
    );
};

export default ProceedToPayment;
