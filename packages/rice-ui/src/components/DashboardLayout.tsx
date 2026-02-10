import React, { useState } from 'react';
import { Sidebar, SidebarItem } from './Sidebar';
import { Navbar } from './Navbar';

export interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarItems: SidebarItem[];
    brandName?: string;
    brandLogo?: React.ReactNode;
    navbarTitle?: string;
    navbarRightContent?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    sidebarItems,
    brandName,
    brandLogo,
    navbarTitle,
    navbarRightContent
}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out`}>
                <Sidebar
                    items={sidebarItems}
                    brandName={brandName}
                    brandLogo={brandLogo}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar
                    title={navbarTitle}
                    rightContent={navbarRightContent}
                    className="flex-shrink-0"
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {!isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/50 z-20"
                    onClick={() => setSidebarOpen(true)}
                ></div>
            )}
        </div>
    );
};
