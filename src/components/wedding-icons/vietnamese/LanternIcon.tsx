import React from 'react';

export const LanternIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
        {/* Hanger */}
        <rect x="48" y="5" width="4" height="10" />
        <rect x="40" y="10" width="20" height="5" rx="2" />

        {/* Body */}
        <ellipse cx="50" cy="45" rx="30" ry="25" />

        {/* Decorative lines on lantern */}
        <path d="M40 22 Q30 45 40 68" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M50 20 Q50 45 50 70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M60 22 Q70 45 60 68" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />

        {/* Bottom base */}
        <rect x="42" y="70" width="16" height="5" rx="1" />

        {/* Tassel */}
        <path d="M50 75 L45 95 M50 75 L50 95 M50 75 L55 95" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
);
