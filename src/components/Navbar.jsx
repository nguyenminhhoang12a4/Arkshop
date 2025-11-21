import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';

// 1. IMPORT FILE ẢNH CỦA BẠN
// (Hãy đảm bảo đường dẫn này đúng với vị trí file của bạn)
import choTroiIcon from '../assets/cho-troi-icon.png'; // <-- Giả sử bạn đặt file ở 'src/assets/'

// ... (Code của NavButton đã cập nhật) ...
const NavButton = ({ to, label, iconName, iconSrc }) => {
  const activeClassName = "bg-blue-100 text-blue-700";
  const inactiveClassName = "text-gray-500 hover:text-gray-900 hover:bg-gray-100";

  return (
    <NavLink
      to={to}
      end={to === "/"} 
      className={({ isActive }) => `
        flex items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isActive ? activeClassName : inactiveClassName}
      `} // <-- Giữ padding 'px-2' trên mobile, 'sm:px-4' cho desktop
    >
      {({ isActive }) => (
        <>
          {iconSrc ? (
            <img src={iconSrc} alt={label} className="w-5 h-5" />
          ) : (
            <Icon name={iconName} size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
          )}
          
          {/* SỬA 2: Hiển thị chữ trên mobile (đã xóa 'hidden sm:inline') */}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};


/**
 * Component Navbar: Thanh điều hướng
 */
export const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-center">
      
      <div className="text-3xl font-bold text-red-600 mb-4 sm:mb-0">
        <span className="text-3xl text-yellow-400">✨</span>
        BennShop
        <span className="text-3xl text-yellow-400">✨</span>
      </div>
      
      {/* SỬA 3: Cho phép xuống dòng (flex-wrap) và chỉnh font size/gap */}
      <div className="flex flex-wrap justify-center gap-2 text-base sm:text-lg sm:space-x-4 sm:gap-0">
        {/* Các NavButton khác giữ nguyên */}
        <NavButton to="/" label="Trang Chủ" iconName="Home" />
        <NavButton to="/shop" label="Shop" iconName="Store" />
        <NavButton to="/event" label="Sổ Xố" iconName="Store" />
        
        {/* 2. SỬ DỤNG 'iconSrc' THAY VÌ 'iconName' */}
        <NavButton 
          to="/cho-troi" 
          label="Chợ Trời" 
          iconSrc={choTroiIcon} // <-- Truyền biến ảnh đã import vào đây
        />
        
      </div>
    </nav>
  );
};