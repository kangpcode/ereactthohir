import React from 'react';

export interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down';
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'amber' | 'red' | 'indigo';
    className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    trend,
    icon,
    color = 'blue',
    className = ''
}) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    };

    return (
        <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>

                    {change !== undefined && (
                        <div className="flex items-center mt-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
                            </span>
                            <span className="text-xs text-slate-400 ml-2">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
