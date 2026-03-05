import React from 'react';

export const DoubleHappinessIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
        {/* Double rings */}
        <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="1" />
        {/* Text */}
        <text x="50" y="53" fontSize="42" fontFamily="serif" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
            囍
        </text>
    </svg>
);
