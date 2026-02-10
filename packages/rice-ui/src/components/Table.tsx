import React from 'react';

export interface TableColumn {
    key: string;
    header: string;
    render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
    columns: TableColumn[];
    data: any[];
    className?: string;
}

export const Table: React.FC<TableProps> = ({ columns, data, className = '' }) => {
    return (
        <div className={`overflow-x-auto border border-slate-200 rounded-lg ${className}`}>
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50">
                            {columns.map((col) => (
                                <td key={`${rowIndex}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-slate-500">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
