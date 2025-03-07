import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi';
import '../../style.css';

const ManageProducts = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Laptop", price: 75000, stock: 15 },
        { id: 2, name: "Smartphone", price: 30000, stock: 30 },
        { id: 3, name: "Headphones", price: 5000, stock: 50 },
    ]);

    const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        const fetchAllProducts = async() =>{
            
        }
        fetchAllProducts();
    }, []);

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
        setProducts([...products, { id: Date.now(), ...newProduct }]);
        setNewProduct({ name: "", price: "", stock: "" });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct(product);
    };

    const handleSaveEdit = () => {
        setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
        setEditingProduct(null);
        setNewProduct({ name: "", price: "", stock: "" });
    };

    const handleDeleteProduct = (id) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    return (
        <div className="manage-products">
            <div className="page-header">
                <h2>Manage Products</h2>
                <Link to="/admin" className="back-link">⬅ Back to Dashboard</Link>
            </div>

            {/* Centered Product Table */}
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price (KES)</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>KES {product.price.toLocaleString()}</td>
                                <td>{product.stock}</td>
                                <td className="actions">
                                    <button onClick={() => handleEditProduct(product)} className="edit-btn"><HiOutlinePencilAlt /></button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn"><HiOutlineTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Centered Add Product Form */}
            <div className="form-container">
                <div className="product-form">
                    <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                    <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price (KES)" value={newProduct.price} onChange={handleChange} />
                    <input type="number" name="stock" placeholder="Stock Quantity" value={newProduct.stock} onChange={handleChange} />
                    {editingProduct ? (
                        <button onClick={handleSaveEdit} className="save-btn">Save Changes</button>
                    ) : (
                        <button onClick={handleAddProduct} className="add-btn"><HiPlusCircle /> Add Product</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
