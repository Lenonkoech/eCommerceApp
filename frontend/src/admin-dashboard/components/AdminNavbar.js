import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX, HiOutlineHome, HiOutlineShoppingCart, HiOutlineUsers, HiOutlineClipboardList, HiOutlineChat, HiOutlineLogout } from 'react-icons/hi';
import "../../Assets/css/style.css";
import { jwtDecode } from 'jwt-decode';
import { logoutAdmin } from '../service/service';

const AdminNavbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('adminToken');
        // console.log("Token from sessionStorage:", token); // Debugging
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // console.log("Decoded token:", decoded);
                // Debugging

                // console.log("Decoded token name:", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
                // console.log("Decoded token email:", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]);
                const decName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                const decEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
                setAdmin({ name: decName || decEmail });
            } catch (error) {
                console.error('Invalid token:', error);
                setAdmin(null);
            }
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handlelogout = () => {
        logoutAdmin();
        setAdmin(null);
        window.location.href = '/admin';
    }

    return (
        <>
            {/* Header */}
            <header className="admin-header">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    {isSidebarOpen ? <HiX /> : <HiMenu />}
                </button>

                {/* Centered Admin Logo */}
                <div className="admin-logo-container">
                    Admin Dashboard
                </div>

                {/* Admin Name (Right Side) */}
                <div className="admin-name">
                    {admin ? admin.name : 'Admin'}
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to="/admin" onClick={toggleSidebar}>
                                <HiOutlineHome /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/products" onClick={toggleSidebar}>
                                <HiOutlineShoppingCart /> Manage Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/users" onClick={toggleSidebar}>
                                <HiOutlineUsers /> Manage Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/orders" onClick={toggleSidebar}>
                                <HiOutlineClipboardList /> Manage Orders
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/inquiries" onClick={toggleSidebar}>
                                <HiOutlineChat /> View Inquiries
                            </Link>
                        </li>
                        <li>
                            <Link to="/logout" onClick={handlelogout}>
                                <HiOutlineLogout /> Logout
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default AdminNavbar;
