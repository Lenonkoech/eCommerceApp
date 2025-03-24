import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/Assets/css/main.css";
import { jwtDecode } from "jwt-decode";
import { editUserProfile, fetchUserById } from "../services/users";
import { useNotification } from "../context/NotificationContext";
import '../Assets/css/notification.css';
import HeaderComponent from '../components/header';
import Footer from '../components/footer';


const EditProfile = ({ user }) => {
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "254",
        location: "",
    });
    const [userId, setUserId] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    // Get User ID from Token
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const decUserid = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                setUserId(decUserid);
            } catch (error) {
                console.error("Invalid token:", error);
                setUserId(null);
            }
        }
    }, []);

    // Fetch user details when userId is set
    useEffect(() => {
        if (userId) {
            fetchUserDetails(userId);
        }
    }, [userId]);

    const fetchUserDetails = async (userId) => {
        try {
            const data = await fetchUserById(userId);
            setProfile(data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    // Calculate profile completion when profile changes
    useEffect(() => {
        calculateCompletion();
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === "phone") {
            updatedValue = value.replace(/\D/g, "");
            if (!updatedValue.startsWith("254")) {
                updatedValue = "254"; // Enforce 254 prefix
            }
            if (updatedValue.length > 12) {
                updatedValue = updatedValue.slice(0, 12);
            }
        }

        setProfile((prev) => ({ ...prev, [name]: updatedValue }));
    };

    const calculateCompletion = () => {
        const fields = ["firstName", "lastName", "email", "phone", "location"];
        const filledFields = fields.filter((field) => profile[field] && profile[field] !== "");
        const completion = Math.round((filledFields.length / fields.length) * 100);
        setProfileCompletion(completion);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!userId) {
                showNotification("User ID is missing. Please log in again.");
                return;
            }

            await editUserProfile(userId, profile);
            showNotification("Profile updated successfully");
            navigate("/editprofile");
        } catch (error) {
            console.error("Error updating profile:", error);
            showNotification("Failed to update profile.");
        }
    };

    return (<>
        <HeaderComponent />
        <div className="edit-profile-container">
            <h2 className="editprofile-header">Edit Profile</h2>
            <p>Profile Completion: {profileCompletion}%</p>
            <progress value={profileCompletion} max="100"></progress>

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleChange} required maxLength={12} />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input type="text" name="location" value={profile.location} onChange={handleChange} required />
                </div>

                <button type="submit" className="save-btn">Save Changes</button>
            </form>
        </div>
        <Footer />
    </>
    );
};

export default EditProfile;
