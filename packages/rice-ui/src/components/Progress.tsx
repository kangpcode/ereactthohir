import React from 'react';

export interface ProgressProps {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
    striped?: boolean;
    className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    label,
    showPercentage = false,
    variant = 'default',
    size = 'md',
    animated = false,
    striped = false,
    className = ''
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variantColors = {
        default: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
    };

    const sizes = {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem'
    };

    const stripedGradient = striped
        ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        : undefined;

    return (
        <div className={`rice-w-full ${className}`}>
            {/* Label and Percentage */}
            {(label || showPercentage) && (
                <div className="rice-flex rice-justify-between rice-items-center rice-mb-2">
                    {label && (
                        <span className="rice-text-sm rice-font-medium" style={{ color: '#475569' }}>
                            {label}
                        </span>
                    )}
                    {showPercentage && (
                        <span className="rice-text-sm rice-font-semibold" style={{ color: '#0f172a' }}>
                            {percentage.toFixed(0)}%
                        </span>
                    )}
                </div>
            )}

            {/* Progress Bar Container */}
            <div
                className="rice-w-full rice-rounded-full rice-overflow-hidden"
                style={{
                    height: sizes[size],
                    backgroundColor: '#e2e8f0'
                }}
            >
                {/* Progress Bar Fill */}
                <div
                    className="rice-h-full rice-rounded-full rice-transition-all"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: variantColors[variant],
                        backgroundImage: stripedGradient,
                        animation: animated ? 'rice-progress-animate 1s linear infinite' : undefined,
                        transitionDuration: '300ms'
                    }}
                />
            </div>

            <style>{`
                @keyframes rice-progress-animate {
                    0% { background-position: 0 0; }
                    100% { background-position: 40px 0; }
                }
            `}</style>
        </div>
    );
};
