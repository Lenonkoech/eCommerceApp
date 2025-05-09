import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencilAlt, HiSearch } from "react-icons/hi";
import "../../Assets/css/style.css";

const ManageOrders = () => {
    const [orders, setOrders] = useState([
        { id: "ORD001", customer: "John Doe", date: "2025-02-20", status: "Pending", total: "$120.00" },
        { id: "ORD002", customer: "Jane Smith", date: "2025-02-21", status: "Shipped", total: "$250.00" },
        { id: "ORD003", customer: "Michael Johnson", date: "2025-02-22", status: "Delivered", total: "$75.00" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(() => {
        // Fetch orders from API (future implementation)
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOrders = orders.filter((order) =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditOrder = (order) => {
        setEditingOrder(order);
    };

    const handleStatusChange = (e) => {
        setEditingOrder({ ...editingOrder, status: e.target.value });
    };

    const handleSaveStatus = () => {
        setOrders(orders.map((o) => (o.id === editingOrder.id ? editingOrder : o)));
        setEditingOrder(null);
    };

    return (
        <div className="manage-orders">
            <div className="page-header">
                <h2>Manage Orders</h2>
                <Link to="/admin" className="back-link">⬅ Back to Dashboard</Link>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <HiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search orders by customer or ID..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Orders Table */}
            <div className="table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.date}</td>
                                <td>{order.status}</td>
                                <td>{order.total}</td>
                                <td>
                                    <button onClick={() => handleEditOrder(order)} className="edit-btn">
                                        <HiOutlinePencilAlt /> Edit Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Order Status Modal */}
            {editingOrder && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Order Status</h3>
                        <select value={editingOrder.status} onChange={handleStatusChange}>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button onClick={handleSaveStatus} className="save-btn">Save</button>
                        <button onClick={() => setEditingOrder(null)} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
