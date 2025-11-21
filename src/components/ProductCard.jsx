import React from 'react';
import { Icon } from './Icon';

// Component này chỉ hiển thị 1 sản phẩm
export const ProductCard = ({ product, onImageClick, imageClassName = "aspect-video", isHighlighted }) => {
  return (
    <div 
      // QUAN TRỌNG: Gán ID để trang web biết cuộn tới đâu
      id={`product-${product.id}`}
      
      // Hiệu ứng highlight: nếu isHighlighted là true thì thêm viền vàng và phóng to
      className={`
        bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-in-out
        ${isHighlighted ? 'ring-4 ring-yellow-400 scale-105 z-10' : 'hover:scale-105'}
      `}
    >
      <div 
        className={`w-full cursor-zoom-in overflow-hidden ${imageClassName}`}
        // Khi click vào ảnh, gửi ID của sản phẩm ra ngoài
        onClick={() => onImageClick(product.id)} 
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Không+tìm+thấy+ảnh'; }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-blue-600 font-bold mt-1">{product.price}</p>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
          <Icon name="ShoppingCart" size={18} />
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </div>
  );
};