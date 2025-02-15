import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/authenthication';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    // Toggle sign-in and sign-up
    const [isSignup, setIsSignup] = useState(false);
    const toggleSignup = () => setIsSignup(prev => !prev);

    // User state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser({ email, password });
            navigate('/'); // Redirect after successful login
        } catch (error) {
            alert("Login failed: " + error.response?.data || error.message);
        }
    };

    // Handle Register
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ name, email, phone, password });
            alert("Registration successful! Please log in.");
            setIsSignup(false);
        } catch (error) {
            alert("Registration failed: " + error.response?.data || error.message);
        }
    };

    return (
        <>
            <br />
            <br />

            <div className={`cont ${isSignup ? "s--signup" : ""}`}>
                <form className="form sign-in" onSubmit={handleLogin}>
                    <h2>Welcome</h2>
                    <label>
                        <span>Email</span>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <p className="forgot-pass">Forgot password?</p>
                    <button type="submit" className="submit">Sign In</button>
                </form>

                <div className="sub-cont">
                    <div className="img">
                        <div className="img__text m--up">
                            <h3>Don't have an account? Please Sign up!</h3>
                        </div>
                        <div className="img__text m--in">
                            <h3>If you already have an account, just sign in.</h3>
                        </div>
                        <div className="img__btn" onClick={toggleSignup}>
                            <span className="m--up">Sign Up</span>
                            <span className="m--in">Sign In</span>
                        </div>
                    </div>

                    <form className="form sign-up" onSubmit={handleRegister}>
                        <h2>Create your Account</h2>
                        <label>
                            <span>Name</span>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>
                            <span>Email</span>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            <span>Phone</span>
                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </label>
                        <label>
                            <span>Password</span>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <button type="submit" className="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
