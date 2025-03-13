import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiSearch } from "react-icons/hi";
import "../../Assets/css/style.css";

const ViewInquiries = () => {
    const [inquiries, setInquiries] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", message: "I need help with my order.", date: "2025-02-22" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", message: "Do you offer bulk discounts?", date: "2025-02-21" },
        { id: 3, name: "Michael Johnson", email: "michael@example.com", message: "How do I reset my password?", date: "2025-02-20" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch inquiries from API (future implementation)
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredInquiries = inquiries.filter(
        (inquiry) =>
            inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="view-inquiries">
            <div className="page-header">
                <h2>View Inquiries</h2>
                <Link to="/admin" className="back-link">⬅ Back to Dashboard</Link>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <HiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search inquiries by name or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Inquiries Table */}
            <div className="table-container">
                <table className="inquiries-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Reply</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInquiries.map((inquiry) => (
                            <tr key={inquiry.id}>
                                <td>{inquiry.name}</td>
                                <td>
                                    <a href={`mailto:${inquiry.email}`} className="email-link">
                                        {inquiry.email}
                                    </a>
                                </td>
                                <td>{inquiry.message}</td>
                                <td>{inquiry.date}</td>
                                <td>
                                    <a href={`mailto:${inquiry.email}`} className="reply-btn">
                                        <HiOutlineMail /> Reply
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewInquiries;
