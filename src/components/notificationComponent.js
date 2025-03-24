import React, { useEffect, useState } from 'react';
import '../Assets/css/notification.css'

const Notification = ({ message, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        });

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <div className="notification">
            {message}
        </div>
    );
};

export default Notification;
