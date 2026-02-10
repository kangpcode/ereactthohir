import React, { Fragment } from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full m-4'
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div
                    className={`
                        inline-block text-left align-bottom transition-all transform bg-white rounded-xl shadow-xl sm:my-8 sm:align-middle w-full
                        ${sizes[size]}
                    `}
                >
                    {(title) && (
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-500 focus:outline-none"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="px-6 py-4">
                        {children}
                    </div>

                    {footer && (
                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-xl flex justify-end space-x-2">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
