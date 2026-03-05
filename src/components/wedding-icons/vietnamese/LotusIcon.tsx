import React from 'react';

export const LotusIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
        {/* Outer petals */}
        <path d="M50 10 C30 40, 10 50, 10 70 C10 80, 20 90, 50 90 C80 90, 90 80, 90 70 C90 50, 70 40, 50 10 Z" opacity="0.6" />
        {/* Middle petals */}
        <path d="M50 20 C40 45, 30 60, 30 75 C30 85, 40 90, 50 90 C60 90, 70 85, 70 75 C70 60, 60 45, 50 20 Z" opacity="0.85" />
        {/* Inner petals */}
        <path d="M50 30 C45 50, 40 65, 40 75 C40 82, 45 88, 50 88 C55 88, 60 82, 60 75 C60 65, 55 50, 50 30 Z" opacity="1" />
    </svg>
);
