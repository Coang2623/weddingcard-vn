import React from 'react';

export const ChampagneIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {/* Glass 1 - Left */}
        <path d="M30 20 L40 55 L40 85" />
        <path d="M30 85 L50 85" />
        <path d="M20 20 C20 40 30 55 40 55" />
        <path d="M22 28 L38 28" strokeWidth="2" /> {/* Liquid level 1 */}

        {/* Glass 2 - Right */}
        <path d="M70 25 L60 60 L60 90" />
        <path d="M50 90 L70 90" />
        <path d="M80 25 C80 45 70 60 60 60" />
        <path d="M62 33 L78 33" strokeWidth="2" /> {/* Liquid level 2 */}

        {/* Clinking stars / spark */}
        <path d="M45 45 L50 52 L55 45 L50 38 Z" fill="currentColor" strokeWidth="1" />
        <circle cx="50" cy="25" r="1.5" fill="currentColor" />
        <circle cx="55" cy="18" r="1" fill="currentColor" />

        {/* Bubbles left */}
        <circle cx="30" cy="45" r="1.5" fill="currentColor" />
        <circle cx="34" cy="35" r="1" fill="currentColor" strokeWidth="0" />

        {/* Bubbles right */}
        <circle cx="70" cy="50" r="1.5" fill="currentColor" />
        <circle cx="66" cy="42" r="1" fill="currentColor" strokeWidth="0" />
    </svg>
);
