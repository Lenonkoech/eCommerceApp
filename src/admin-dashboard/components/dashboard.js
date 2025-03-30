import React, { useState, useEffect } from 'react';
import { HiOutlineShoppingCart, HiOutlineUsers, HiOutlineClipboardList, HiOutlineCurrencyDollar, HiBell } from 'react-icons/hi';
import Chart from 'react-apexcharts';
import "../../Assets/css/style.css";

const AdminDashboard = () => {
    const [orders, setOrders] = useState(120);
    const [users, setUsers] = useState(80);
    const [revenue, setRevenue] = useState(25000);
    const [newInquiries, setNewInquiries] = useState(5);

    useEffect(() => {
        // Fetch real data from API in future
    }, []);

    return (
        <div className="admin-dashboard">
            {/* <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <div className="notifications">
                    <HiBell className="notification-icon" />
                    <span className="badge">{newInquiries}</span>
                </div>
            </div> */}
            
            <div className="stats-cards">
                <div className="card">
                    <HiOutlineShoppingCart className="icon" />
                    <h3>{orders}</h3>
                    <p>Total Orders</p>
                </div>
                <div className="card">
                    <HiOutlineUsers className="icon" />
                    <h3>{users}</h3>
                    <p>Total Users</p>
                </div>
                <div className="card">
                    <HiOutlineCurrencyDollar className="icon" />
                    <h3>KES {revenue.toLocaleString()}</h3>
                    <p>Total Revenue</p>
                </div>
                <div className="card">
                    <HiOutlineClipboardList className="icon" />
                    <h3>{newInquiries}</h3>
                    <p>New Inquiries</p>
                </div>
            </div>
            
            <div className="charts">
                <h3 className='chart-header'>Sales Chart</h3>
                <Chart 
                    options={{ 
                        chart: { id: 'sales-trend', toolbar: { show: false } },
                        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
                        dataLabels: { enabled: false },
                        colors: ['#34a853']
                    }}
                    series={[{ name: 'Sales', data: [3000, 4000, 3500, 5000, 6000] }]}
                    type="bar"
                    width="100%"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
