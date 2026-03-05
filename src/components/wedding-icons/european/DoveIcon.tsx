import React from 'react';

export const DoveIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {/* Body */}
        <path d="M25 50 C25 35, 45 42, 60 45 C70 47, 82 40, 88 35 C82 52, 70 70, 50 72 C35 74, 25 65, 25 50 Z" />

        {/* Wing */}
        <path d="M50 48 C50 20, 65 10, 80 10 C70 28, 65 42, 55 55" />

        {/* Eye */}
        <circle cx="32" cy="46" r="1.5" fill="currentColor" strokeWidth="0" />

        {/* Beak */}
        <path d="M25 48 L15 52 L25 54 Z" fill="currentColor" strokeWidth="2" strokeLinejoin="round" />

        {/* Tail */}
        <path d="M72 61 C85 70, 95 85, 90 95 C82 90, 72 78, 65 68" />
        <path d="M75 65 C88 72, 98 87, 85 98 C78 90, 70 82, 65 72" />

        {/* Olive branch */}
        <path d="M5 68 C15 72, 12 55, 22 62" strokeWidth="2" />
        <path d="M12 65 C14 62, 10 60, 12 65 Z" fill="currentColor" strokeWidth="1" />
        <path d="M18 69 C20 66, 15 63, 18 69 Z" fill="currentColor" strokeWidth="1" />
    </svg>
);
