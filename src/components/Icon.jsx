import React from 'react';

// --- Giả lập các Icon (vì không thể import trực tiếp) ---
// Trong môi trường thực tế, bạn sẽ import từ 'lucide-react'
export const Icon = ({ name, size = 20, className = '' }) => {
  const svgData = {
    Home: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    Store: <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M2 7h20M2 7l2 13h16l2-13M12 22v-6M12 16v-6" />,
    Server: <path d="M20 12V6s0-4-4-4H8C4 2 4 6 4 6v6M20 12h-4H8H4m16 0V18s0 4-4 4H8c-4 0-4-4-4-4v-6" />,
    Plus: <path d="M5 12h14M12 5v14" />,
    X: <path d="M18 6 6 18M6 6l12 12" />,
    ShoppingCart: <path d="M8 1a2 2 0 0 1 2 2v2H4V3a2 2 0 0 1 2-2h4zM4 5h16l-2 13H6L4 5z" />,
    // --- Thêm các icon mới cho trang chủ ---
    ShieldCheck: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    Swords: <path d="m15 3 6 6v3l-6 6H9l-6-6V9l6-6h6zM3 9l6 6M9 21V10l6-6M3 15l6-6" />,
    Shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />,
    Target: <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />,
    Briefcase: <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />,
    Crown: <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />,
    Phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
    Globe: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />,
    Rocket: <path d="M4.5 16.5c-1.5 1.5-1.5 4.5 0 6h3m12-12a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3c1.66 0 3-1.34 3-3zM19.5 10.5c1.5-1.5 4.5-1.5 6 0v3M10.5 16.5c-1.5-1.5-1.5-4.5 0-6h3m-6 12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3z" />,
    MessageSquare: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    Users: <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />,
    CheckCircle: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />,
    Search: <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" />,
    ChevronLeft: <path d="M15 18l-6-6 6-6" />,
    ChevronRight: <path d="M9 6l6 6-6 6" />,
  
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{svgData[name] || <circle cx="12" cy="12" r="10" />}</svg>;
};