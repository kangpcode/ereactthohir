import React from 'react';

export interface NavbarProps {
    title?: string;
    rightContent?: React.ReactNode;
    className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    title,
    rightContent,
    className = ''
}) => {
    return (
        <header className={`h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 ${className}`}>
            <div className="flex items-center">
                {title && <h1 className="text-lg font-semibold text-slate-800">{title}</h1>}
            </div>
            <div className="flex items-center space-x-4">
                {rightContent}
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="flex items-center space-x-2 p-1 pl-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-700 hidden sm:inline">Admin</span>
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">A</div>
                    </button>
                </div>
            </div>
        </header>
    );
};
