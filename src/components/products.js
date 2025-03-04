import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Assets/css/main.css";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5294/api/Product");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p className="loading">Loading products...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <section className="featured">
            <h2>Featured Products</h2>
            <div className="product-grid">

                {products.map((product) => (
                    <div key={product.productId} className="product-card">
                        <h3>
                            <Link className="link" to={`/productDetails/${product.productId}`}>{product.name}</Link> </h3>
                        <Link className="link" to={`/productDetails/${product.productId}`}> <img src={`${process.env.PUBLIC_URL}${product.imageUrl}`} alt={product.name} /></Link>
                        <p className="price">Ksh {product.price}</p>
                        <Link className="link" to={`/productDetails/${product.productId}`}> <button className="btn">Shop Now</button>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
