import React from 'react';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    size?: 'sm' | 'md';
    className?: string;
    style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    style
}) => {
    const variants = {
        primary: 'rice-bg-primary rice-text-primary',
        secondary: 'rice-bg-secondary rice-text-secondary',
        success: 'rice-text-success',
        danger: 'rice-text-danger',
        warning: 'rice-text-warning',
        info: 'rice-text-info'
    };

    const sizes = {
        sm: 'rice-px-2 rice-py-1 rice-text-xs',
        md: 'rice-px-3 rice-py-1 rice-text-sm'
    };

    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: '1px solid',
        borderRadius: '9999px',
        transition: 'all 300ms',
        ...style
    };

    return (
        <span
            className={`${variants[variant]} ${sizes[size]} ${className}`}
            style={baseStyles}
        >
            {children}
        </span>
    );
};
