import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';
// 👇 Import hook lấy thông tin user
import { useAuth } from '../contexts/AuthContext';

// 1. IMPORT FILE ẢNH CỦA BẠN
import choTroiIcon from '../assets/cho-troi-icon.png';
import ticket from '../assets/icon-ticket.png';
import money from '../assets/icon-money.png';
import home from '../assets/icon-home.png';
import shop from '../assets/icon-shop.png';
import loginIcon from '../assets/icon-login.png'; // Đổi tên biến tránh trùng với logic login

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
      `}
    >
      {({ isActive }) => (
        <>
          {iconSrc ? (
            <img src={iconSrc} alt={label} className="w-5 h-5" />
          ) : (
            <Icon name={iconName} size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
          )}
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
  // 👇 Lấy user và hàm logout từ Context
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-center">
      
      <div className="text-3xl font-bold text-red-600 mb-4 sm:mb-0">
        <span className="text-3xl text-yellow-400">✨</span>
        BennShop
        <span className="text-3xl text-yellow-400">✨</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 text-base sm:text-lg sm:space-x-4 sm:gap-0">
        <NavButton 
          to="/" 
          label="Trang Chủ" 
          iconSrc={home} 
        />
        <NavButton 
          to="/shop" 
          label="Cửa hàng" 
          iconSrc={shop} 
        />
        <NavButton 
          to="/event" 
          label="Sổ Xố" 
          iconSrc={ticket} 
        />

        <NavButton 
          to="/card" 
          label="Đổi tiền" 
          iconSrc={money} 
        />
        
        <NavButton 
          to="/cho-troi" 
          label="Chợ Trời" 
          iconSrc={choTroiIcon} 
        />
        
        {/* 👇 LOGIC THAY ĐỔI NÚT ĐĂNG NHẬP / ĐĂNG XUẤT */}
        {user ? (
          // Nếu đã đăng nhập -> Hiện nút Đăng xuất
          // Dùng thẻ <button> thay vì NavLink để xử lý onClick
          <button 
            onClick={logout}
            className="flex items-center space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-gray-500 hover:text-red-600 hover:bg-red-50"
            title="Đăng xuất khỏi tài khoản"
          >
            <img src={loginIcon} alt="Logout" className="w-5 h-5 opacity-70" />
            <span>Đăng xuất</span>
          </button>
        ) : (
          // Nếu chưa đăng nhập -> Hiện nút Đăng nhập như cũ
          <NavButton 
            to="/login" 
            label="Đăng nhập" 
            iconSrc={loginIcon} 
          />
        )}

      </div>
    </nav>
  );
};