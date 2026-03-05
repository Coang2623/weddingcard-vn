import React from 'react';

export const ChurchArchIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {/* Arch */}
        <path d="M20 50 C20 15, 80 15, 80 50 L80 90" />
        <path d="M35 50 C35 30, 65 30, 65 50 L65 90" />
        <path d="M20 90 L80 90" strokeWidth="6" />

        {/* Hanging florals in arch */}
        <path d="M20 45 Q35 55 50 45 Q65 55 80 45" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="50" cy="45" r="3" fill="currentColor" strokeWidth="0" />
        <circle cx="35" cy="50" r="2.5" fill="currentColor" strokeWidth="0" />
        <circle cx="65" cy="50" r="2.5" fill="currentColor" strokeWidth="0" />

        {/* Flowers at base of arch */}
        <ellipse cx="20" cy="80" rx="6" ry="10" fill="currentColor" strokeWidth="0" opacity="0.8" />
        <ellipse cx="80" cy="80" rx="6" ry="10" fill="currentColor" strokeWidth="0" opacity="0.8" />
    </svg>
);
