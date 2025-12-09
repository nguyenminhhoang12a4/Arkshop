import React from 'react';

// Giả lập props cho các path để React xử lý chúng đúng cách
const pathProps = {
    strokeWidth: "2", 
    strokeLinecap: "round", 
    strokeLinejoin: "round"
};

const svgData = {
    Home: <path {...pathProps} d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    Store: <path {...pathProps} d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M2 7h20M2 7l2 13h16l2-13M12 22v-6M12 16v-6" />,
    Server: <path {...pathProps} d="M20 12V6s0-4-4-4H8C4 2 4 6 4 6v6M20 12h-4H8H4m16 0V18s0 4-4 4H8c-4 0-4-4-4-4v-6" />,
    Plus: <path {...pathProps} d="M5 12h14M12 5v14" />,
    X: <path {...pathProps} d="M18 6 6 18M6 6l12 12" />,
    ShoppingCart: <path {...pathProps} d="M8 1a2 2 0 0 1 2 2v2H4V3a2 2 0 0 1 2-2h4zM4 5h16l-2 13H6L4 5z" />,
    ShieldCheck: <path {...pathProps} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    Swords: <path {...pathProps} d="m15 3 6 6v3l-6 6H9l-6-6V9l6-6h6zM3 9l6 6M9 21V10l6-6M3 15l6-6" />,
    Shield: <path {...pathProps} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />,
    Target: <path {...pathProps} d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />,
    Briefcase: <path {...pathProps} d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />,
    Crown: <path {...pathProps} d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />,
    Phone: <path {...pathProps} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
    Globe: <path {...pathProps} d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />,
    Rocket: <path {...pathProps} d="M4.5 16.5c-1.5 1.5-1.5 4.5 0 6h3m12-12a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3c1.66 0 3-1.34 3-3zM19.5 10.5c1.5-1.5 4.5-1.5 6 0v3M10.5 16.5c-1.5-1.5-1.5-4.5 0-6h3m-6 12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3z" />,
    MessageSquare: <path {...pathProps} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    Users: <path {...pathProps} d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />,
    CheckCircle: <path {...pathProps} d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />,
    Search: <path {...pathProps} d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" />,
    ChevronLeft: <path {...pathProps} d="M15 18l-6-6 6-6" />,
    ChevronRight: <path {...pathProps} d="M9 6l6 6-6 6" />,
};

// Component Icon lớn (Đã sửa lỗi bằng cách thêm pathProps)
export const Icon = ({ name, size = 20, className = '' }) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            {svgData[name] || <circle cx="12" cy="12" r="10" strokeWidth="2" />}
        </svg>
    );
};


// --- Các Icon cụ thể cho trang Trade.jsx (Bầu Cua) ---

// Icon cho Đồng hồ/Thời gian
export const TimerIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

// Icon cho Điểm/Tiền tệ
export const PointsIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.03 60.03 0 0 0 18 0m-18 0s-3.75 3.75 0 3.75h21s3.75-3.75 0-3.75M12 9s-3.75-3.75 0-3.75 3.75 3.75 0 3.75M12 9V3M9.75 6H14.25" />
    </svg>
);

// Icon cho Xúc Xắc (Đại diện chung cho Game)
export const DiceIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m-15 0a4.5 4.5 0 0 1 4.5-4.5h6a4.5 4.5 0 0 1 4.5 4.5m-15 0a4.5 4.5 0 0 0 4.5 4.5h6a4.5 4.5 0 0 0 4.5-4.5m-15 0H4.5M19.5 12H12m-4.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm3 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm3 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
    </svg>
);