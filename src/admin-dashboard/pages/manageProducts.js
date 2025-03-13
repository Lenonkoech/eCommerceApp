import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlusCircle } from "react-icons/hi";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../../services/products";
import { fetchCategories, fetchCategoryById } from "../../services/categories";
import "../../Assets/css/style.css";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        stock: "",
        categoryId: "",
        description: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchAllProducts();
        fetchCategoryList();
    }, []);

    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const response = await fetchProducts(9);
            const productsWithCategories = await Promise.all(
                response.map(async (product) => {
                    try {
                        const categoryRes = await fetchCategoryById(product.categoryId);
                        return { ...product, categoryName: categoryRes.categoryName };
                    } catch {
                        return { ...product, categoryName: "Unknown" };
                    }
                })
            );
            setProducts(productsWithCategories);
        } catch (error) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryList = async () => {
        try {
            const res = await fetchCategories();
            setCategories(res);
        } catch (error) {
            setError("Error fetching categories: " + (error.response?.data || error.message));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || newProduct.price <= 0 || newProduct.stock < 0 || !newProduct.categoryId) {
            setError("Please provide valid inputs for all fields.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("price", Number(newProduct.price));
            formData.append("stock", Number(newProduct.stock));
            formData.append("categoryId", Number(newProduct.categoryId));
            formData.append("description", newProduct.description);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await addProduct(formData);
            setProducts([...products, response]);
            resetForm();
        } catch (error) {
            setError("Failed to add product: " + (error.response?.data || error.message));
        }
    };

    const handleSaveEdit = async () => {
        if (!editingProduct) return;
    
        try {
            const updatedFields = {};
    
            if (newProduct.name !== editingProduct.name) updatedFields.name = newProduct.name;
            if (newProduct.price !== editingProduct.price) updatedFields.price = newProduct.price;
            if (newProduct.stock !== editingProduct.stock) updatedFields.stock = newProduct.stock;
            if (newProduct.category !== editingProduct.category) updatedFields.categoryId = newProduct.category;
            if (newProduct.description !== editingProduct.description) updatedFields.description = newProduct.description;
            if (imageFile) updatedFields.image = imageFile; 
    
            await updateProduct(editingProduct.productId, updatedFields);
    
            setProducts(products.map((p) =>
                p.productId === editingProduct.productId ? { ...p, ...updatedFields } : p
            ));
    
            resetForm();
        } catch (error) {
            setError("Error updating product: " + (error.response?.data?.message || error.message));
        }
    };
    

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            description: product.description,
        });
        setImagePreview(product.imageUrl);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter((p) => p.productId !== id));
        } catch (error) {
            setError("Failed to delete product: " + (error.response?.data || error.message));
        }
    };

    const resetForm = () => {
        setNewProduct({ name: "", price: "", stock: "", categoryId: "", description: "" });
        setImageFile(null);
        setImagePreview(null);
        setEditingProduct(null);
        setError("");
    };

    return (
        <div className="manage-products">
            <div className="page-header">
                <h2>Manage Products</h2>
                <Link to="/admin" className="back-link">⬅ Back to Dashboard</Link>
            </div>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div className="table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Price (KES)</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>KES {Number(product.price).toLocaleString()}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.categoryName}</td>
                                    <td className="actions">
                                        <button onClick={() => handleEditProduct(product)} className="edit-btn"><HiOutlinePencilAlt /></button>
                                        <button onClick={() => handleDeleteProduct(product.productId)} className="delete-btn"><HiOutlineTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="form-container">
                <div className="product-form">
                    <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                    <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleChange} />
                    <input type="number" name="price" placeholder="Price (KES)" value={newProduct.price} onChange={handleChange} />
                    <input type="number" name="stock" placeholder="Stock Quantity" value={newProduct.stock} onChange={handleChange} />
                    <select name="categoryId" value={newProduct.categoryId} onChange={handleChange}>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                        ))}
                    </select>
                    <textarea className="styled-textarea" name="description" placeholder="Enter product description..." value={newProduct.description} onChange={handleChange} />
                    <input type="file" name="image" onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                    {editingProduct ? <button className="save-btn" onClick={handleSaveEdit}>Save Changes</button> : <button className="add-btn" onClick={handleAddProduct}><HiPlusCircle /> Add Product</button>}
                </div>
            </div>
        </div>
    );
};

export default ManageProducts;
