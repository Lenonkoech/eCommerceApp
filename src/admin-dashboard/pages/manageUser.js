import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlusCircle, HiSearch } from "react-icons/hi";
import "../../style.css";

const ManageUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 3, name: "Michael Johnson", email: "michael@example.com", role: "User" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "User" });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        // Fetch users from API (future implementation)
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) return;
        setUsers([...users, { id: Date.now(), ...newUser }]);
        setNewUser({ name: "", email: "", role: "User" });
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setNewUser(user);
    };

    const handleSaveEdit = () => {
        setUsers(users.map((u) => (u.id === editingUser.id ? newUser : u)));
        setEditingUser(null);
        setNewUser({ name: "", email: "", role: "User" });
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    return (
        <div className="manage-users">
            <div className="page-header">
                <h2>Manage Users</h2>
                <Link to="/admin" className="back-link">⬅ Back to Dashboard</Link>
            </div>

            {/* Search Bar */}
            <div className="search-container">
                <HiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Users Table */}
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td className="actions">
                                    <button onClick={() => handleEditUser(user)} className="edit-btn"><HiOutlinePencilAlt /></button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="delete-btn"><HiOutlineTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit User Form */}
            <div className="form-container">
                <div className="user-form">
                    <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
                    <input type="text" name="name" placeholder="Full Name" value={newUser.name} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email Address" value={newUser.email} onChange={handleChange} />
                    <select name="role" value={newUser.role} onChange={handleChange}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {editingUser ? (
                        <button onClick={handleSaveEdit} className="save-btn">Save Changes</button>
                    ) : (
                        <button onClick={handleAddUser} className="add-btn"><HiPlusCircle /> Add User</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
    