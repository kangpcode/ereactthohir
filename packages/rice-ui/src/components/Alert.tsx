import React, { useState } from 'react';

export interface AlertProps {
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'danger';
    title?: string;
    icon?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    children,
    variant = 'info',
    title,
    icon,
    dismissible = false,
    onDismiss,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) return null;

    const variantStyles = {
        info: {
            background: '#eff6ff',
            border: '#93c5fd',
            color: '#1e40af',
            iconColor: '#3b82f6'
        },
        success: {
            background: '#d1fae5',
            border: '#6ee7b7',
            color: '#065f46',
            iconColor: '#10b981'
        },
        warning: {
            background: '#fef3c7',
            border: '#fcd34d',
            color: '#92400e',
            iconColor: '#f59e0b'
        },
        danger: {
            background: '#fee2e2',
            border: '#fca5a5',
            color: '#991b1b',
            iconColor: '#ef4444'
        }
    };

    const styles = variantStyles[variant];

    const defaultIcons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        danger: '❌'
    };

    return (
        <div
            className={`rice-flex rice-items-start rice-gap-3 rice-p-4 rice-rounded-lg rice-border rice-animate-slide-up ${className}`}
            style={{
                backgroundColor: styles.background,
                borderColor: styles.border,
                color: styles.color
            }}
        >
            {/* Icon */}
            <div className="rice-flex-shrink-0 rice-text-xl" style={{ color: styles.iconColor }}>
                {icon || defaultIcons[variant]}
            </div>

            {/* Content */}
            <div className="rice-flex-1">
                {title && (
                    <h4 className="rice-font-bold rice-mb-1" style={{ color: styles.color }}>
                        {title}
                    </h4>
                )}
                <div className="rice-text-sm" style={{ color: styles.color }}>
                    {children}
                </div>
            </div>

            {/* Dismiss Button */}
            {dismissible && (
                <button
                    onClick={handleDismiss}
                    className="rice-flex-shrink-0 rice-p-1 rice-rounded rice-transition rice-hover-scale-105"
                    style={{
                        color: styles.color,
                        cursor: 'pointer'
                    }}
                >
                    <svg className="rice-w-4 rice-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};
