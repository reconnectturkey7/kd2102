// Result Card Component for displaying KPIs

import type { ReactNode } from 'react';

interface ResultCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'info';
    className?: string;
}

const variantStyles = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-orange-50 border-orange-200',
    info: 'bg-blue-50 border-blue-200',
};

const variantTextStyles = {
    default: 'text-primary-900',
    success: 'text-green-900',
    warning: 'text-orange-900',
    info: 'text-blue-900',
};

export default function ResultCard({
    title,
    value,
    subtitle,
    icon,
    variant = 'default',
    className = '',
}: ResultCardProps) {
    return (
        <div
            className={`
        p-6 rounded-xl border-2 transition-all
        ${variantStyles[variant]}
        ${className}
      `}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                {icon && <div className="text-gray-400">{icon}</div>}
            </div>

            <div className={`text-3xl font-bold mb-1 ${variantTextStyles[variant]}`}>
                {value}
            </div>

            {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
            )}
        </div>
    );
}
