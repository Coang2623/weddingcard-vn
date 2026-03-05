import React from 'react';

export const CakeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {/* Base Tier */}
        <path d="M20 70 L20 85 C20 88 40 90 50 90 C60 90 80 88 80 85 L80 70" />
        <path d="M20 70 C20 73 40 75 50 75 C60 75 80 73 80 70 C80 67 60 65 50 65 C40 65 20 67 20 70 Z" fill="currentColor" fillOpacity="0.1" />

        {/* Middle Tier */}
        <path d="M30 45 L30 65 C30 68 40 70 50 70 C60 70 70 68 70 65 L70 45" />
        <path d="M30 45 C30 48 40 50 50 50 C60 50 70 48 70 45 C70 42 60 40 50 40 C40 40 30 42 30 45 Z" fill="currentColor" fillOpacity="0.1" />

        {/* Top Tier */}
        <path d="M40 25 L40 40 C40 43 45 45 50 45 C55 45 60 43 60 40 L60 25" />
        <path d="M40 25 C40 28 45 30 50 30 C55 30 60 28 60 25 C60 22 55 20 50 20 C45 20 40 22 40 25 Z" fill="currentColor" fillOpacity="0.1" />

        {/* Cake stand */}
        <path d="M10 90 L90 90" strokeWidth="5" />
        <path d="M45 90 L40 100 M55 90 L60 100" />

        {/* Heart Topper */}
        <path d="M50 20 L50 15" strokeWidth="3" />
        <path d="M50 15 C50 15 45 5 50 10 C50 10 55 5 50 15 Z" fill="currentColor" strokeWidth="2" strokeLinejoin="round" />

        {/* Decorations / Frosting dots */}
        <circle cx="20" cy="70" r="1.5" fill="currentColor" strokeWidth="0" />
        <circle cx="35" cy="72.5" r="1.5" fill="currentColor" strokeWidth="0" />
        <circle cx="50" cy="75" r="1.5" fill="currentColor" strokeWidth="0" />
        <circle cx="65" cy="72.5" r="1.5" fill="currentColor" strokeWidth="0" />
        <circle cx="80" cy="70" r="1.5" fill="currentColor" strokeWidth="0" />
    </svg>
);
