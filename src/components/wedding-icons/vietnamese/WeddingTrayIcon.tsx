import React from 'react';

export const WeddingTrayIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
        {/* Tray lid (Mâm quả) */}
        <path d="M15 60 C15 30, 85 30, 85 60 Z" fill="currentColor" opacity="0.9" />

        {/* Decorative lid knob */}
        <circle cx="50" cy="30" r="4" fill="currentColor" />

        {/* Tray base */}
        <rect x="10" y="62" width="80" height="8" rx="2" fill="currentColor" />

        {/* Tray stand / feet */}
        <path d="M20 70 L15 85 L35 85 L30 70 Z" fill="currentColor" opacity="0.8" />
        <path d="M80 70 L85 85 L65 85 L70 70 Z" fill="currentColor" opacity="0.8" />

        {/* Decorative string / ribbon (Dây chữ thập) */}
        <path d="M50 30 L15 60 M50 30 L85 60" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
    </svg>
);
