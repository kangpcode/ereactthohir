import React, { useEffect, useState } from 'react';

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 3000,
    onClose
}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    const types = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-rose-50 text-rose-800 border-rose-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center px-4 py-3 border rounded-lg shadow-lg max-w-sm w-full transition-all transform ${types[type]}`}>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};
