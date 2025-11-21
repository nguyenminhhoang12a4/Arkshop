import React, { useEffect } from 'react';
import { Icon } from './Icon';

export const ImageZoomModal = ({ currentImage, onClose, onNavigate, hasNavigation }) => {
  
  // Sự kiện bàn phím (giữ nguyên)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNavigation) onNavigate(1);
      if (e.key === 'ArrowLeft' && hasNavigation) onNavigate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate, hasNavigation]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 animate-fade-in-fast"
      onClick={onClose}
    >
      {/* Nút đóng (X) */}
      <button 
        className="absolute top-4 right-4 text-white/70 z-20 p-2 rounded-full hover:text-white hover:bg-white/10 transition-colors"
        onClick={onClose}
      >
        <Icon name="X" size={32} className="sm:w-10 sm:h-10" /> {/* Icon nhỏ hơn xíu trên đt */}
      </button>
      
      <div 
        className="relative flex items-center justify-center w-full h-full p-2 sm:p-4" // Giảm padding trên điện thoại
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Nút Previous (Trái) --- */}
        {hasNavigation && (
          <button
            // ĐÃ SỬA: 
            // - Bỏ 'hidden sm:block' -> Hiện trên mọi thiết bị
            // - left-2 (điện thoại) -> left-6 (máy tính)
            // - p-2 (điện thoại) -> p-4 (máy tính)
            // - bg-black/10 (điện thoại) -> bg-black/30 (máy tính)
            className="absolute left-2 sm:left-6 z-10 p-2 sm:p-4 text-white bg-black/20 sm:bg-black/30 rounded-full hover:bg-black/50 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
          >
            {/* Icon nhỏ (32px) trên đt, to (48px) trên máy tính */}
            <Icon name="ChevronLeft" size={32} className="sm:w-12 sm:h-12" />
          </button>
        )}

        {/* Ảnh chính */}
        <img 
          src={currentImage} 
          alt="Zoomed product" 
          // Tăng độ lớn tối đa trên điện thoại (max-w-[95vw])
          className="max-w-[95vw] max-h-[85vh] sm:max-h-[90vh] object-contain rounded sm:rounded-lg shadow-2xl animate-fade-in-fast"
        />

        {/* --- Nút Next (Phải) --- */}
        {hasNavigation && (
          <button
            // ĐÃ SỬA tương tự nút trái
            className="absolute right-2 sm:right-6 z-10 p-2 sm:p-4 text-white bg-black/20 sm:bg-black/30 rounded-full hover:bg-black/50 transition-all duration-200"
             onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
          >
            <Icon name="ChevronRight" size={32} className="sm:w-12 sm:h-12" />
          </button>
        )}
      </div>
    </div>
  );
};