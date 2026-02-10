import React from 'react';

export interface LayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    sidebar,
    header,
    className = ''
}) => {
    return (
        <div className={`min-h-screen bg-[#f8fafc] flex selection:bg-indigo-100 selection:text-indigo-900 ${className}`}>
            {sidebar && (
                <aside className="w-72 bg-white border-r border-slate-200/60 hidden lg:block sticky top-0 h-screen overflow-y-auto z-30">
                    <div className="p-8">
                        {sidebar}
                    </div>
                </aside>
            )}
            <div className="flex-1 flex flex-col relative">
                {header && (
                    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-10 py-5 sticky top-0 z-20 shadow-sm shadow-slate-200/20">
                        {header}
                    </header>
                )}
                <main className="flex-1 px-10 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
