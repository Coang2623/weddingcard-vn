import React from 'react';

export const PatternIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" className={className} {...props}>
        {/* Traditional geometric pattern (Hoa văn cổ điển) */}
        <rect x="25" y="25" width="50" height="50" rx="4" />
        <path d="M50 5 L50 25 M50 75 L50 95 M5 50 L25 50 M75 50 L95 50" />
        <path d="M25 25 L10 10 M75 25 L90 10 M25 75 L10 90 M75 75 L90 90" />
        <circle cx="50" cy="50" r="8" fill="currentColor" />
    </svg>
);
