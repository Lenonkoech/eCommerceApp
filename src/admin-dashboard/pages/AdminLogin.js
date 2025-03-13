import React, { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import "../../Assets/css/style.css";
import { useNotification } from '../../context/NotificationContext';
import { loginAdmin } from "../service/service";


const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { showNotification } = useNotification();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const result = await loginAdmin(email, password);

        if (result.success) {
            showNotification("Login successful!");
            window.location.href = "/admin"; // Redirect after login
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-box">
                <h2>Admin Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Admin Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
