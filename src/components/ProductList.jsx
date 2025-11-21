import React from 'react';
// Nhớ import ProductCard vào đây
import { ProductCard } from './ProductCard';

export const ProductList = ({ products, onImageClick, imageClassName, highlightedId }) => {
  // Nếu không có sản phẩm nào thì thông báo
  if (!products || products.length === 0) {
    return <p className="text-gray-500 text-center">Chưa có sản phẩm nào trong mục này.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Lặp qua từng sản phẩm và hiển thị ProductCard tương ứng */}
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onImageClick={onImageClick} 
          imageClassName={imageClassName}
          // Kiểm tra: nếu ID của sản phẩm này trùng với ID cần highlight thì true
          isHighlighted={product.id === highlightedId}
        />
      ))}
    </div>
  );
};