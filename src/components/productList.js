import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../Assets/css/main.css";
import HeaderComponent from "./header";
import Footer from "./footer";
import { Link } from "react-router-dom";
import Loader from "./loader";
import { BASE_IMAGE_URL } from "./products";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Search term state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 16;
    const searchTimeout = useRef(null); // Reference for timeout

    const BASE_URL = "http://localhost:5294/api/Product";

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("categoryId");

    // Function to fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const url = categoryId
                ? `${BASE_URL}/category/${categoryId}?page=${currentPage}&limit=${productsPerPage}&search=${encodeURIComponent(searchTerm)}`
                : `${BASE_URL}/all?page=${currentPage}&limit=${productsPerPage}&search=${encodeURIComponent(searchTerm)}`;

            const response = await axios.get(url, { headers: { "Content-Type": "application/json" } });

            if (response.data) {
                // ✅ Handle both array response and { products: [...] } structure
                const productList = Array.isArray(response.data) ? response.data : response.data.products;

                if (Array.isArray(productList)) {
                    setProducts(productList);
                    setTotalPages(Math.ceil(response.data.total / productsPerPage) || 1);
                } else {
                    throw new Error("Invalid API response format - expected an array.");
                }
            } else {
                throw new Error("No data received from API.");
            }
        } catch (error) {
            setError("Failed to fetch products.");
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };


    // Fetch products on initial load and when category changes
    useEffect(() => {
        fetchProducts(searchTerm, currentPage);
    }, [categoryId, currentPage]);

    // Fetch products as user types (debounced search)
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            fetchProducts(searchTerm, 1);
            setCurrentPage(1);
        }, 500); // Delays search by 500ms
        return () => clearTimeout(searchTimeout.current);
    }, [searchTerm]);

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <HeaderComponent />
            <div className="product-list-container">
                <h2 className="category-title">
                    {categoryId ? "Products in this Category" : "All Products"}
                </h2>

                {/* Search Input */}
                <input
                    type="text"
                    className="search-box"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Loader */}
                {loading && <Loader />}

                {/* Product Grid */}
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.productId} className="product-card">
                                <Link to={`/productDetails/${product.productId}`}>
                                    <img
                                        src={`${BASE_IMAGE_URL}${product.imageUrl}`}
                                        alt={product.name}
                                        className="product-image-cat"
                                        onError={(e) => (e.target.src = "/fallback-image.jpg")}
                                    />
                                </Link>
                                <Link className="link" to={`/productDetails/${product.productId}`}>
                                    <h4 className="product-name">{product.name}</h4>
                                </Link>
                                <p className="product-price">KES {product.price.toLocaleString()}</p>
                                <Link to={`/productDetails/${product.productId}`}>
                                    <button className="btn">Shop Now</button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No products found.</p>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? "active" : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ProductList;
