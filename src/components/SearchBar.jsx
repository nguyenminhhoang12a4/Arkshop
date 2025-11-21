import React from 'react';
import { Icon } from './Icon';

export const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-full">
      {/* Icon nằm bên trong ô input */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name="Search" size={20} className="text-gray-400" />
      </div>

      {/* Ô input */}
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm trong shop này..."
        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};