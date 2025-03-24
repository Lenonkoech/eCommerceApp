import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { addItemToCart } from "../services/cart";
import "../Assets/css/main.css";
import "../Assets/css/productDetails.css";
import HeaderComponent from "./header";
import Footer from "./footer";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "../context/NotificationContext";
import { fetchProductById } from "../services/products";
import { addToWishlist } from "../services/wishlistService";
import { BASE_IMAGE_URL } from "./products";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const { showNotification } = useNotification();

    const BASE_URL = "http://localhost:5294/api/Product";

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userIdString = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                const userId = parseInt(userIdString, 10);

                if (!isNaN(userId)) {
                    setUser({ userId });
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
            }
        }
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await fetchProductById(id);
                setProduct(productData);
                if (productData.categoryId) {
                    fetchRelatedProducts(productData.categoryId, productData.productId);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("Error fetching product details.");
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async (categoryId, productId) => {
            try {
                const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
                const productsArray = response.data.products || [];
                const filteredProducts = productsArray
                    .filter(p => p.productId !== productId)
                    .slice(0, 4);
                setRelatedProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching related products:", error);
                setRelatedProducts([]);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || !user?.userId) {
            showNotification("Please log in to add items to cart.");
            return;
        }

        try {
            await addItemToCart({
                productId: product.productId,
                userId: user.userId,
                quantity: 1,
            });
            showNotification("Item added to cart!");
        } catch (error) {
            showNotification(error.message || "Failed to add item to cart.");
        }
    };
    const handleAddToWishlist = async () => {
        if (!product || !user?.userId) {
            showNotification("Please log in to add items to wishlist.");
            return;
        }

        try {
            await addToWishlist({
                userId: user.userId,
                productId: product.productId
            });
            showNotification("Item added to wishlist!");
        } catch (error) {
            showNotification(error.message || "Failed to add item to wishlist.");
        }
    };


    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <HeaderComponent />
            <div className="product-details">
                <div className="product-container">
                    <div className="product-image-container">
                        <img src={`${BASE_IMAGE_URL}${product.imageUrl}`} alt={product.name} className="product-image" />
                    </div>
                    <div className="product-info">
                        <h2 className="product-title">{product.name}</h2>
                        <p className="product-price">KES {product.price.toLocaleString()}</p>
                        <ul className="product-description">
                            <h3>Features</h3>
                            {product.description.split("\n").map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>
                        <button className="add-to-cart" onClick={handleAddToCart}>ADD TO CART</button>
                        <button className="add-to-wishlist" onClick={handleAddToWishlist}>ADD TO WISHLIST</button>
                    </div>
                </div>

                <div className="related-products">
                    <h3>Related Products</h3>
                    <div className="related-products-container">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map((related) => (
                                <div key={related.productId} className="related-product">
                                    <img src={`${BASE_IMAGE_URL}${related.imageUrl}`} alt={related.name} />
                                    <h4>{related.name}</h4>
                                    <p>KES {related.price.toLocaleString()}</p>
                                    <Link className="link" to={`/productDetails/${related.productId}`}>
                                        <button className="btn">Shop Now</button>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No related products found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;
