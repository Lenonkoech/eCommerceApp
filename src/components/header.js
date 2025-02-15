import React from 'react'
import '../Assets/css/main.css'
import { HiOutlineChevronDown, HiOutlineStar } from "react-icons/hi";
import { Link } from 'react-router-dom';

const HeaderComponent = () => {
    return (

        <header className='header'>
            <div className='logo'>URB<HiOutlineStar className='logo-icon' />NCove    </div>

            <nav role="navigation" class="primary-navigation">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li>Products <HiOutlineChevronDown />
                        <ul class="dropdown">
                            <li><a href="#i">Apparel</a></li>
                            <li><a href="#s">Foot Wear</a></li>
                            <li><a href="#c">Accesories</a></li>
                            <li><a href="#i">Care Products</a></li>

                        </ul>
                    </li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><Link to={'/auth'}>Login</Link></li>
                    <li><Link to={'/auth'}>Register</Link></li>
                </ul>
            </nav>
        </header>
    )
}


export default HeaderComponent;