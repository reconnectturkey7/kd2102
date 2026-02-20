// Standard Calculator Layout Component

import type { ReactNode } from 'react';

interface CalculatorLayoutProps {
    children: ReactNode;
    className?: string;
}

export default function CalculatorLayout({ children, className = '' }: CalculatorLayoutProps) {
    return (
        <div className={`min-h-screen bg-gray-50 py-12 ${className}`}>
            <div className="container mx-auto px-4 max-w-7xl">
                {children}
            </div>
        </div>
    );
}
