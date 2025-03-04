import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../Assets/css/main.css";
import HeaderComponent from "./header";
import Footer from "./footer";
import { Link } from "react-router-dom";
import Loader from "./loader";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = "http://localhost:5294/api/Product";
    const IMAGE_URL = "https://localhost:3000/"; // Ensure this is your correct backend image path

    // Get categoryId from the URL query params
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("categoryId");

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryId) {
                setError("Invalid category. Please select a valid category.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
                if (response.data.length === 0) {
                    setError("Category Empty"); // Display "Category Empty" if no products
                } else {
                    setProducts(response.data);
                }
            } catch (error) {
                setError("Failed to fetch products.");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    useEffect(() => {
        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
        },);
    }, []);
    if (error) return <div className="error">{error}</div>;
    return loading ? (
        <Loader />
    ) : (
        <>
            <HeaderComponent />
            <div className="product-list-container">
                <h2 className="category-title">Products in this Category</h2>
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.productId} className="product-card">
                            <Link to={`/productDetails/${product.productId}`}>
                                <img
                                    src={`${IMAGE_URL}${product.imageUrl}`}
                                    alt={product.name}
                                    className="product-image-cat"
                                    onError={(e) => (e.target.src = "/fallback-image.jpg")}
                                />
                            </Link>
                            <Link className="link" to={`/productDetails/${product.productId}`}>
                                <h3 className="product-name">{product.name}</h3>
                            </Link>
                            <p className="product-price">KES {product.price.toLocaleString()}</p>
                            <Link to={`/productDetails/${product.productId}`}>
                                <button className="btn">Shop Now</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductList;
