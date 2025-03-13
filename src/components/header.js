import React, { useState, useEffect } from 'react';
import '../Assets/css/main.css';
import { HiOutlineChevronDown, HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { logoutUser } from '../services/authenthication';
import { BiHeart, BiLogOut, BiShoppingBag } from 'react-icons/bi';
import { CiShoppingTag } from 'react-icons/ci';
import { fetchCategories } from '../services/categories';

const HeaderComponent = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProductCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError("Failed to load categories. Please try again.");
            }
        };
        fetchProductCategories();
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const decName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                const decEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
                setUser({ email: decName || decEmail });
            } catch (error) {
                console.error('Invalid token:', error);
                setUser(null);
            }
        }
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsProductsOpen(false);
    };

    const toggleProductsDropdown = () => {
        setIsProductsOpen(!isProductsOpen);
    };

    const handleNavigationClick = () => {
        setIsMobileMenuOpen(false);
        setIsProductsOpen(false);
    };

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        window.location.href = '/';
    };

    // if (loading) return <p className="loading">Loading categories...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <header className='header'>
            <Link className='link' to={'/'}> <h2 className='logo'>URB<span className="highlight">NCove</span></h2></Link>

            <div className='mobile-menu-toggle' onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <HiX /> : <HiMenu />}
            </div>

            <nav className={`primary-navigation ${isMobileMenuOpen ? 'active' : ''}`}>
                <ul>
                    <li><Link to={'/'} onClick={handleNavigationClick}>Home</Link></li>
                    <li className='dropdown-parent'
                        onMouseEnter={() => !window.matchMedia('(max-width: 768px)').matches && setIsProductsOpen(true)}
                        onMouseLeave={() => !window.matchMedia('(max-width: 768px)').matches && setIsProductsOpen(false)}
                        onClick={toggleProductsDropdown}
                    >
                        <Link to={'/products'}> Products </Link>
                        <ul className={`dropdown ${isProductsOpen ? 'active' : ''}`}>
                            {categories.map((category) => (
                                <li key={category.categoryId}>
                                    <Link className='category-link'
                                        to={`/products?categoryId=${category.categoryId}`}
                                        onClick={handleNavigationClick}
                                    >
                                        {category.categoryName}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li><Link to={'/about'} onClick={handleNavigationClick}>About</Link></li>
                    <li><Link to={'/contact'} onClick={handleNavigationClick}>Contact</Link></li>
                    {user ? (
                        <>
                            <li><Link to={'/cart'} onClick={handleNavigationClick}>Cart <BiShoppingBag /></Link></li>
                            <li className='dropdown-parent' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                {user.email} <HiOutlineChevronDown />
                                <ul className={`dropdown logout ${isDropdownOpen ? 'active' : ''}`}>
                                    <li><a href='#i' onClick={handleNavigationClick}>Favorites <BiHeart className='icon' /></a></li>
                                    <li><a href='#s' onClick={handleNavigationClick}>Wish List <CiShoppingTag /> </a></li>
                                    <li className='logoutbtn' onClick={handleLogout}>Logout <BiLogOut /></li>
                                </ul>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to='/auth'>Login</Link></li>
                            <li><Link to='/auth'>Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default HeaderComponent;
