import React, { useState } from 'react';

export interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: string;
    disabled?: boolean;
}

export interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpen?: string[];
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    items,
    allowMultiple = false,
    defaultOpen = [],
    className = ''
}) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (itemId: string) => {
        if (allowMultiple) {
            setOpenItems(prev =>
                prev.includes(itemId)
                    ? prev.filter(id => id !== itemId)
                    : [...prev, itemId]
            );
        } else {
            setOpenItems(prev =>
                prev.includes(itemId) ? [] : [itemId]
            );
        }
    };

    return (
        <div className={`rice-w-full rice-space-y-2 ${className}`}>
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);

                return (
                    <div
                        key={item.id}
                        className="rice-border rice-rounded-lg rice-overflow-hidden rice-bg-white rice-shadow-sm"
                    >
                        {/* Accordion Header */}
                        <button
                            onClick={() => !item.disabled && toggleItem(item.id)}
                            disabled={item.disabled}
                            className="rice-w-full rice-flex rice-items-center rice-justify-between rice-p-4 rice-text-left rice-font-semibold rice-transition"
                            style={{
                                cursor: item.disabled ? 'not-allowed' : 'pointer',
                                opacity: item.disabled ? 0.5 : 1,
                                backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                                color: '#0f172a'
                            }}
                        >
                            <div className="rice-flex rice-items-center rice-gap-3">
                                {item.icon && <span className="rice-text-xl">{item.icon}</span>}
                                <span>{item.title}</span>
                            </div>
                            <svg
                                className="rice-w-5 rice-h-5 rice-transition"
                                style={{
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    color: '#64748b'
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Accordion Content */}
                        {isOpen && (
                            <div
                                className="rice-p-4 rice-border-t rice-animate-slide-up"
                                style={{
                                    backgroundColor: '#ffffff',
                                    color: '#475569'
                                }}
                            >
                                {item.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
