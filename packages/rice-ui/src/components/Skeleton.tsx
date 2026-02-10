import React from 'react';

export interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    className = ''
}) => {
    const baseClasses = 'animate-pulse bg-slate-200 rounded';

    const variants = {
        text: 'h-3 w-full mb-2',
        circular: 'rounded-full',
        rectangular: ''
    };

    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={style}
        />
    );
};
