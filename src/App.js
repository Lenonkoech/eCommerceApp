import './App.css';
import Login from './auth/auth'
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import { NotificationProvider } from './context/NotificationContext';
import AdminHome from './admin-dashboard/src/pages/Adminhome'
import ManageProducts from './admin-dashboard/src/pages/manageProducts';
import ManageUsers from './admin-dashboard/src/pages/manageUser';
import ManageOrders from './admin-dashboard/src/pages/manageOrders';
import ViewInquiries from './admin-dashboard/src/pages/viewInquiries';
import AdminLogin from './admin-dashboard/src/AdminLogin';
import ProtectedAdminRoute from './pages/ProtectedAdminRoute';
import ProductDetails from './components/productDetails';
import ProductList from './components/productList';
import CartPage from './pages/cartPage';
import ProtectedUserRoute from './pages/protectedUserRoute';
import AboutPage from './pages/about';
import ContactPage from './pages/contactUs';

const App = () => {
  const [setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  return (
    <Router>
      <NotificationProvider>
        <Routes>
          {/* User pages */}
          <Route path="/" element={<Home showNotification={showNotification} />} />
          <Route path="/auth" element={<Login showNotification={showNotification} />} />
          <Route path='/productDetails/:id' element={<ProductDetails showNotification={showNotification} />} />
          <Route path="/products" element={<ProductList showNotification={showNotification} />} />
          <Route path='/about' element={<AboutPage />} showNotification={showNotification} />
          <Route path='/contact' element={<ContactPage showNotification={showNotification} />} />
          <Route path='/' element={<ProtectedUserRoute />}>
            <Route path="/cart" element={<CartPage showNotification={showNotification} />} />
          </Route>
          {/* Admin pages */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin' element={<ProtectedAdminRoute />} >
            <Route path='/admin' element={<AdminHome />} />
            <Route path='/admin/products' element={<ManageProducts />} />
            <Route path='/admin/users' element={<ManageUsers />} />
            <Route path='/admin/orders' element={<ManageOrders />} />
            <Route path='/admin/inquiries' element={<ViewInquiries />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </Router>
  );
};

export default App;


