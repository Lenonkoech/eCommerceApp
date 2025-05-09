import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiSearch } from "react-icons/hi";
import "../../Assets/css/style.css";

const ViewInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const response = await fetch("http://localhost:5294/api/MessageQueries", {
                    method: "GET",
                    headers: { "Accept": "text/plain" },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // Sort messages from latest to oldest
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setInquiries(sortedData);
            } catch (err) {
                console.error("Failed to fetch inquiries:", err);
                setError("Failed to load inquiries.");
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
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

            {/* Display Loading or Error Message */}
            {loading ? (
                <p className="loading">Loading inquiries...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
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
                            {filteredInquiries.length > 0 ? (
                                filteredInquiries.map((inquiry) => (
                                    <tr key={inquiry.queryId}>
                                        <td>{inquiry.name}</td>
                                        <td>
                                            <a href={`mailto:${inquiry.email}`} className="email-link">
                                                {inquiry.email}
                                            </a>
                                        </td>
                                        <td>{inquiry.message}</td>
                                        <td>{new Date(inquiry.createdAt).toLocaleString()}</td>
                                        <td>
                                            <a href={`mailto:${inquiry.email}`} className="reply-btn">
                                                <HiOutlineMail /> Reply
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-results">No inquiries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewInquiries;
