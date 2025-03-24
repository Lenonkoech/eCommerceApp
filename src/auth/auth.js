import React, { useState, useEffect } from 'react';
import { loginUser, registerUser, googleLogin, facebookLogin } from '../services/authenthication';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF } from 'react-icons/fa6';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNotification } from '../context/NotificationContext';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Config } from '../services/application';
import '../Assets/css/auth.css';

const GOOGLE_CLIENT_ID = Config.Authentication.Google.ClientId;
const FACEBOOK_APP_ID = Config.Authentication.Facebook.AppId;

const Login = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification(); // Use global notification
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (!window.FB) {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: FACEBOOK_APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: "v18.0",
                });
            };

            const script = document.createElement("script");
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignup) {
                await registerUser(formData);
                showNotification("Registration successful. Please log in.");
                setIsSignup(false);
            } else {
                await loginUser({ email: formData.email, password: formData.password });
                showNotification("Login Successful");
                navigate('/'); // Move to Home, but keep notification
            }
        } catch (error) {
            showNotification(`${error.message}`);
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const token = response.credential;
            await googleLogin(token);
            showNotification("Google Login Successful");
            navigate('/');
        } catch (error) {
            showNotification("Google Login failed: " + error.message);
        }
    };

    const handleFacebookLogin = () => {
        window.FB.login((response) => {
            if (response.authResponse) {
                facebookLogin(response.authResponse.accessToken)
                    .then(() => {
                        showNotification("Facebook Login Successful");
                        navigate('/');
                    })
                    .catch((error) => {
                        showNotification("Facebook Login failed: " + error.message);
                    });
            } else {
                showNotification("User canceled Facebook login.");
            }
        }, { scope: "email,public_profile" });
    };

    return (
        <div className={`cont ${isSignup ? "s--signup" : ""}`}>
            <form className={`form ${isSignup ? "sign-up" : "sign-in"}`} onSubmit={handleSubmit}>
                <h2>{isSignup ? "Create your Account" : "Welcome Back"}</h2>
                <p className="switch-text">
                    {isSignup
                        ? "Already have an account?"
                        : "Don't have an account?"}
                    <span onClick={() => setIsSignup(!isSignup)} className="switch-link">
                        {isSignup ? "Sign In" : "Sign Up"}
                    </span>
                </p>

                {isSignup && (
                    <>
                        <label>
                            <span>First Name</span>
                            <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
                        </label>
                        <label>
                            <span>Last Name</span>
                            <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
                        </label>
                        <label>
                            <span>Phone</span>
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
                        </label>
                    </>
                )}

                <label>
                    <span>Email</span>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                </label>
                <label>
                    <span>Password</span>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                            {showPassword ? <HiEyeOff /> : <HiEye />}
                        </button>
                    </div>
                </label>

                <button type="submit" className="submit">{isSignup ? "Sign Up" : "Sign In"}</button>

                {!isSignup && <p className="forgot-pass">Forgot password?</p>}
                {!isSignup &&
                    <div className="socials">
                        <button className="fb-login-btn" type="button" onClick={handleFacebookLogin}>
                            <FaFacebookF className="fb-icon" /> Login with Facebook
                        </button>
                        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                            <div className="google-login-btn">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => showNotification("Google Login Failed")}
                                    theme="gray"
                                    size="medium"
                                />
                            </div>
                        </GoogleOAuthProvider>
                    </div>}
            </form>
        </div>
    );
};

export default Login;
