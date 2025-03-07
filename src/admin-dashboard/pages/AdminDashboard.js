import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './pages/DashboardHome';
import ManageProducts from './ManageProducts';
import ManageUsers from './pages/ManageUsers';

const App=() => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ width: '100%', marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div style={{ marginTop: '70px', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/products" element={<ManageProducts />} />
            <Route path="/users" element={<ManageUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App
