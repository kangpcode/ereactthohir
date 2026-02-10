import React from 'react';

export interface SidebarItem {
    label: string;
    icon?: React.ReactNode;
    href: string;
    active?: boolean;
}

export interface SidebarProps {
    items: SidebarItem[];
    brandName?: string;
    brandLogo?: React.ReactNode;
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
    items,
    brandName = 'EreactThohir',
    brandLogo,
    className = ''
}) => {
    return (
        <aside className={`w-64 h-screen bg-slate-900 text-white flex flex-col ${className}`}>
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                {brandLogo}
                <span className="text-xl font-bold tracking-tight">{brandName}</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {items.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.href}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${item.active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">JD</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">John Doe</p>
                        <p className="text-xs text-slate-500 truncate">john@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
