import React, { createContext, useState, useContext } from 'react';

// Create context
const NotificationContext = createContext();

// Custom hook to use notifications
export const useNotification = () => {
    return useContext(NotificationContext);
};

// Provider component
export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    // Show notification function
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
            {notification && <Notification message={notification} />}
        </NotificationContext.Provider>
    );
};

// Notification component
const Notification = ({ message }) => {
    return (
        <div className="notification">
            {message}
        </div>
    );
};
