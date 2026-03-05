import React from 'react';

export const RingsIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" className={className} {...props}>
        <circle cx="35" cy="55" r="22" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="65" cy="45" r="22" strokeLinecap="round" strokeLinejoin="round" />

        {/* Diamond shape on the right ring */}
        <polygon points="65,15 72,23 58,23" fill="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="65,24 72,21 58,21" fill="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <line x1="61" y1="18" x2="65" y2="23" strokeWidth="1" stroke="white" />
        <line x1="69" y1="18" x2="65" y2="23" strokeWidth="1" stroke="white" />
    </svg>
);
