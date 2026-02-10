import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    description?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    description,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full group">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-3 border-2 rounded-xl shadow-sm outline-none transition-all duration-300 ease-in-out
                        ${error
                            ? 'border-rose-100 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                            : 'border-slate-100 bg-slate-50/30 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white'}
                        ${props.disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-slate-300'}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {description && !error && (
                <p className="mt-2 text-xs text-slate-500 italic px-1">{description}</p>
            )}
            {error && (
                <p className="mt-2 text-xs font-medium text-rose-600 px-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-600"></span>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
