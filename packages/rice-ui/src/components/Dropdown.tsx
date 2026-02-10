import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
    label: string;
    value: string;
    icon?: string;
    disabled?: boolean;
}

export interface DropdownProps {
    items: DropdownItem[];
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    items,
    label,
    placeholder = 'Select an option',
    value,
    onChange,
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || '');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (itemValue: string) => {
        setSelectedValue(itemValue);
        setIsOpen(false);
        onChange?.(itemValue);
    };

    const selectedItem = items.find(item => item.value === selectedValue);

    return (
        <div className={`rice-relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="rice-block rice-text-sm rice-font-semibold rice-mb-2" style={{ color: '#334155' }}>
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="rice-w-full rice-flex rice-items-center rice-justify-between rice-px-4 rice-py-2 rice-bg-white rice-border rice-rounded-lg rice-shadow-sm rice-transition"
                style={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1
                }}
            >
                <span style={{ color: selectedItem ? '#0f172a' : '#94a3b8' }}>
                    {selectedItem ? (
                        <>
                            {selectedItem.icon && <span className="rice-mr-2">{selectedItem.icon}</span>}
                            {selectedItem.label}
                        </>
                    ) : placeholder}
                </span>
                <svg
                    className="rice-w-4 rice-h-4 rice-transition"
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

            {isOpen && (
                <div
                    className="rice-absolute rice-z-10 rice-w-full rice-mt-2 rice-bg-white rice-border rice-rounded-lg rice-shadow-xl rice-overflow-hidden rice-animate-fade-in"
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                >
                    {items.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => !item.disabled && handleSelect(item.value)}
                            disabled={item.disabled}
                            className="rice-w-full rice-flex rice-items-center rice-px-4 rice-py-3 rice-text-left rice-transition"
                            style={{
                                cursor: item.disabled ? 'not-allowed' : 'pointer',
                                opacity: item.disabled ? 0.5 : 1,
                                backgroundColor: item.value === selectedValue ? '#eff6ff' : 'transparent',
                                color: item.value === selectedValue ? '#2563eb' : '#0f172a'
                            }}
                        >
                            {item.icon && <span className="rice-mr-2">{item.icon}</span>}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
