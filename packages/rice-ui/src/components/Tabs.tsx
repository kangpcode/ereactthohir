import React, { useState } from 'react';

export interface TabItem {
    id: string;
    label: string;
    icon?: string;
    content: React.ReactNode;
    disabled?: boolean;
}

export interface TabsProps {
    items: TabItem[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    items,
    defaultTab,
    onChange,
    variant = 'default',
    className = ''
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id || '');

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const activeTabContent = items.find(item => item.id === activeTab)?.content;

    const getTabStyles = (isActive: boolean, isDisabled: boolean) => {
        const baseStyles: React.CSSProperties = {
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1,
            transition: 'all 200ms'
        };

        if (variant === 'pills') {
            return {
                ...baseStyles,
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem'
            };
        }

        if (variant === 'underline') {
            return {
                ...baseStyles,
                color: isActive ? '#2563eb' : '#64748b',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                padding: '0.5rem 1rem'
            };
        }

        return {
            ...baseStyles,
            backgroundColor: isActive ? '#ffffff' : '#f1f5f9',
            color: isActive ? '#2563eb' : '#64748b',
            border: '1px solid',
            borderColor: isActive ? '#2563eb' : '#e2e8f0',
            borderBottom: isActive ? '1px solid #ffffff' : '1px solid #e2e8f0',
            padding: '0.75rem 1.5rem',
            marginBottom: '-1px'
        };
    };

    return (
        <div className={`rice-w-full ${className}`}>
            {/* Tab Headers */}
            <div
                className="rice-flex rice-gap-2"
                style={{
                    borderBottom: variant === 'default' ? '1px solid #e2e8f0' : 'none'
                }}
            >
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && handleTabChange(item.id)}
                        disabled={item.disabled}
                        className="rice-flex rice-items-center rice-gap-2 rice-font-medium rice-transition"
                        style={getTabStyles(activeTab === item.id, item.disabled || false)}
                    >
                        {item.icon && <span>{item.icon}</span>}
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div
                className="rice-p-6 rice-bg-white rice-rounded-lg rice-animate-fade-in"
                style={{
                    border: variant === 'default' ? '1px solid #e2e8f0' : 'none',
                    borderTop: variant === 'default' ? 'none' : undefined
                }}
            >
                {activeTabContent}
            </div>
        </div>
    );
};
