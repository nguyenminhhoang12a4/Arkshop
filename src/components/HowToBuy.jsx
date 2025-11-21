// src/components/HowToBuy.js (hoặc vị trí file của bạn)

import React, { useState } from 'react';
import { Icon } from './Icon'; // Import Icon của bạn

// 1. IMPORT ICON TRỢ GIÚP
// Giả sử file này (HowToBuy.js) nằm trong /src/components
// và icon của bạn nằm ở /src/assets/help-icon.png
import helpIcon from '../assets/help-icon.png';

// ----------------------------------------------------------------------

// == A. NỘI DUNG HƯỚNG DẪN (Tách ra để tái sử dụng) ==
// Đây là code gốc trong component của bạn, mình tách ra để dùng
// ở cả 2 nơi (sticky box và modal) mà không cần lặp code.
const GuideContent = () => (
  <>
    <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
      <Icon name="ShoppingCart" className="text-blue-600 mr-2" />
      Hướng dẫn Mua Hàng
    </h3>
    <ul className="text-2xl space-y-3 text-gray-700 list-decimal list-inside">
      <li>Chọn mặt hàng bạn thích sau đó chụp hình lại.</li>
      <li>Gửi sản phẩm bạn chọn qua Zalo: <strong className="text-gray-900">Nguyễn Minh Hoàng (BennShop)</strong>.</li>
      <li className="text-2xl font-semibold text-blue-600 list-none ml-4">
        <button 
          onClick={() => window.open("https://zalo.me/0842039811", "_blank")}
          className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors duration-300 shadow-lg shadow-emerald-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2">
          <Icon name="Rocket" size={22} />
          <span>Zalo: 0842039811</span>
        </button> 
      </li>
      <li>Nếu Thanh toán QR thì kèm theo bill gửi tiền.</li>
      <li>Nếu thanh toán bằng card thì có thể liên hệ trực tiếp.</li>
    </ul>
    <div className="mt-6">
      <img 
        src="/assets/QR.png" // Đường dẫn này OK nếu QR.png nằm trong /public/assets
        alt="Mã QR Thanh toán" 
        className="w-full h-auto rounded-md border-2 border-gray-200"
        onError={(e) => { e.target.src = 'https://placehold.co/400x400/cccccc/ffffff?text=QR+Code'; }}
      />
      <p className="text-center text-sm text-gray-600 mt-2">Quét mã QR để thanh toán (BennShop)</p>
    </div>
  </>
);

// == B. COMPONENT CHÍNH (Đã cập nhật logic) ==
export const HowToBuy = () => {
  // 2. Thêm state để quản lý việc Bật/Tắt modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* == 1. Giao diện Desktop: Sticky Box (Code cũ của bạn) == */}
      {/* - hidden: Mặc định ẩn
        - md:block: Hiển thị dạng 'block' trên màn hình medium (md) trở lên
        - Đây chính là component gốc của bạn
      */}
      <div className="hidden md:block bg-white p-6 rounded-lg shadow-md sticky top-8">
        <GuideContent />
      </div>

      {/* == 2. Giao diện Mobile: Nút Trợ Giúp (Icon) == */}
      {/* - block: Mặc định hiển thị
        - md:hidden: Ẩn đi trên màn hình medium (md) trở lên
        - fixed: Nằm cố định trên màn hình
      */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="block md:hidden fixed bottom-5 right-5 bg-blue-600 p-3 rounded-full shadow-lg z-40 transform hover:scale-110 transition-transform active:scale-95"
        aria-label="Hướng dẫn mua hàng"
      >
        <img src={helpIcon} alt="Trợ giúp" className="w-8 h-8" />
      </button>

      {/* == 3. Giao diện Mobile: Modal Hướng Dẫn == */}
      {/* Chỉ hiển thị khi isModalOpen === true */}
      {isModalOpen && (
        <div 
          // Lớp phủ mờ (Overlay)
          className="md:hidden fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
          onClick={() => setIsModalOpen(false)} // Click bên ngoài để đóng
        >
          <div 
            // Khung nội dung Modal
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Ngăn click vào nội dung modal làm modal bị đóng
          >
            {/* Nút đóng modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1 rounded-full z-10"
              aria-label="Đóng"
            >
              {/* Giả sử bạn có icon "X" trong component <Icon> */}
              <Icon name="X" size={24} />
              
              {/* **Nếu không có Icon "X", bạn có thể dùng dòng này thay thế:**
              <span className="text-2xl font-bold">&times;</span> 
              */}
            </button>
            
            {/* Tải nội dung hướng dẫn vào đây */}
            <GuideContent />
          </div>
        </div>
      )}
    </>
  );
};