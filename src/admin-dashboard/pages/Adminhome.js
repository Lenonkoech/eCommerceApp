import React from 'react'
import Sidebar from '../components/AdminNavbar'
import AdminDashboard from '../components/dashboard'

const AdminHome = () => {
    return (
        <>
            <Sidebar />
            <AdminDashboard />
        </>
    )
}

export default AdminHome