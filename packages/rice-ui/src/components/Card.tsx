import React from 'react';

export interface CardProps {
    title?: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    title,
    description,
    children,
    footer,
    className = ''
}) => {
    return (
        <div className={`bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out group ${className}`}>
            {(title || description) && (
                <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-transparent">
                    {title && <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">{title}</h3>}
                    {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
                </div>
            )}
            <div className="px-8 py-6">
                {children}
            </div>
            {footer && (
                <div className="px-8 py-4 bg-slate-50/80 border-t border-slate-100 backdrop-blur-sm">
                    {footer}
                </div>
            )}
        </div>
    );
};
