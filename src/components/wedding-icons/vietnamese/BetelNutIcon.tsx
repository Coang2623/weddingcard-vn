import React from 'react';

export const BetelNutIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} {...props}>
        {/* Betel Leaf (Lá Trầu) */}
        <path
            d="M50 85 C30 70, 15 50, 15 30 C15 15, 25 10, 40 10 C50 10, 60 20, 50 35 C45 45, 30 55, 50 85 Z"
            fill="currentColor"
            opacity="0.8"
        />
        {/* Betel Leaf 2 */}
        <path
            d="M55 90 C75 75, 90 55, 90 35 C90 20, 80 15, 65 15 C55 15, 45 25, 55 40 C60 50, 75 60, 55 90 Z"
            fill="currentColor"
            opacity="0.6"
        />
        {/* Areca Nut (Quả Cau) */}
        <circle cx="50" cy="55" r="15" fill="currentColor" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <path d="M42 50 Q50 65 58 50" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
);
