import React from 'react';
// import { Icon } from '../components/Icon'; // Giả sử dùng chung Icon component - Dòng này đã bị comment lại vì code bạn gửi đã bỏ hết Icon

/**
 * Component EventPage: Trang sự kiện Sổ Xố
 */
export const EventPage = () => {
  return (
    <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-lg shadow-2xl animate-fade-in font-sans">
      
      {/* --- Header Section --- */}
      <div className="text-center p-8 rounded-lg bg-black bg-opacity-20 mb-12 relative overflow-hidden">
        {/* Hiệu ứng nền mờ */}
        <div className="absolute inset-0 bg-yellow-900 opacity-30 blur-3xl z-0"></div>
        
        <div className="relative z-10">
          {/* SỬA: Thay thế Icon 'Ticket' bị lỗi bằng emoji 🎟️ */}
          <div className="text-6xl mx-auto mb-4 text-yellow-400" role="img" aria-label="Ticket">🎟️</div>
          
          {/* SỬA: Giảm font-size trên mobile và thêm break-words */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 break-words">
            🎉 SỰ KIỆN HOT: <span className="text-yellow-400">SỔ XỐ MỖI NGÀY</span> 🎉
          </h1>
          {/* SỬA: Giảm font-size trên mobile */}
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto break-words">
            💥 Thử vận may mỗi ngày – Rinh quà cực chất! 💥
          </p>
        </div>
      </div>

      {/* --- Section: Cách Thức & Thời Gian --- */}
      {/* SỬA: Thêm class 'break-words' để nội dung không bị tràn */}
      <div className="grid md:grid-cols-2 gap-8 mb-12 break-words">
        {/* Cột Cách Tham Gia */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          {/* SỬA: Bỏ icon "Clock" */}
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            Cách Thức & Thời Gian
          </h2>
          <p className="text-lg text-gray-300 mb-2">
            <strong>Khung giờ tham gia:</strong> 7h00 - 17h00 mỗi ngày.
          </p>
          {/* SỬA: Bỏ icon "AlertTriangle" */}
          <p className="text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-lg text-sm mb-4">
            Lưu ý: Sau 17h00 sẽ không ghi nhận lượt xổ số nữa.
          </p>
          <ul className="space-y-2 text-lg">
            {/* SỬA: Bỏ icon "ChevronsRight" */}
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2 font-bold">»</span>
              15 lượt quay số may mắn mỗi ngày.
            </li>
            {/* SỬA: Bỏ icon "Award" */}
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2 font-bold">»</span>
              Mỗi lần trúng = <strong className="mx-1 text-emerald-400">+1 điểm</strong>
            </li>
            {/* SỬA: Bỏ icon "Calendar" */}
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2 font-bold">»</span>
              Thời gian xổ số: <strong className="ml-1">20h00 mỗi ngày.</strong>
            </li>
          </ul>
        </div>

        {/* Cột Hướng Dẫn Chọn Số */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          {/* SỬA: Bỏ icon "ClipboardList" */}
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">
            Hướng Dẫn Chọn Số
          </h2>
          <p className="text-lg text-gray-300 mb-3">
            Chọn 1 số may mắn từ <strong className="text-white">01</strong> đến <strong className="text-white">99</strong>.
          </p>
          <p className="text-gray-300 mb-2">Nhập đúng cú pháp sau:</p>
          
          {/* === ĐÃ SỬA LỖI TRÀN (1) === */}
          {/* SỬA ĐỔI: Bỏ overflow-x-auto và dùng break-words để tự xuống hàng */}
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 mb-4">
            <code className="text-lg text-yellow-300 break-words">
              vietlott | Tên Zalo | Tên ingame | Server | Số muốn chọn
            </code>
          </div>
          
          <p className="text-lg font-bold text-gray-200 mb-2">Ví dụ đúng:</p>
          
          {/* === ĐÃ SỬA LỖI TRÀN (2) === */}
          {/* SỬA ĐỔI: Bỏ overflow-x-auto và dùng break-words để tự xuống hàng */}
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 mb-4">
            <code className="text-lg text-emerald-300 break-words">
              vietlott | Nguyễn Minh Hoàng | been | vn_game | 46
            </code>
          </div>
          
          {/* SỬA: Bỏ icon "AlertCircle" */}
          <p className="text-red-400 text-base">
            Mỗi người chỉ được chọn 1 lần. Sai cú pháp sẽ không được tính.
          </p>
        </div>
      </div>


      {/* --- Section: Phần Thưởng --- */}
      <div className="mb-12">
        {/* SỬA: Bỏ icon "Gift" và thêm 'break-words' */}
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400 break-words">
          <span>Bảng Phần Thưởng Tích Điểm</span>
        </h2>

        {/* Phần thưởng đặc biệt */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-emerald-700 to-green-800 p-6 rounded-lg shadow-lg border border-emerald-500 text-center">
                <p className="text-2xl font-bold text-white">20 ĐIỂM</p>
                <p className="text-xl text-gray-200 mt-1">🎁 1 VAULT bv 292 bv 🎁</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-700 to-orange-800 p-6 rounded-lg shadow-lg border border-yellow-500 text-center">
                <p className="text-2xl font-bold text-white">30 ĐIỂM</p>
                <p className="text-xl text-gray-200 mt-1">🎁 1 THÁNG FREE PASS AD 🎁</p>
            </div>
        </div>

        {/* Danh sách phần thưởng */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Cột 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-3 border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 mb-3">Mốc 1 Điểm</h3>
            <p><span className="font-bold text-emerald-400">1đ</span> = 2k amber</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = 1 cuốc + 1 rìu (full chỉ số)</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = 3k Nguyên liệu (tự chọn)</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = buff lv cho 1 con thú</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = 3 cây turret 7m</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = 3 cây hoa Plan X</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = 1 tek gen + 100 element</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = 1 tek tele + 100 element</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = 1 tek kibble + 100 element</p>
            <p><span className="font-bold text-emerald-400">1đ</span> = dịch vụ hỗ trợ liên quan đến đảo / 1 lần</p>
          </div>

          {/* Cột 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-3 border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 mb-3">Mốc 2-3 Điểm</h3>
            <p><span className="font-bold text-emerald-400">2đ</span> = x100 cái X15</p>
            <p><span className="font-bold text-emerald-400">2đ</span> = x30 cái Vòng Vàng</p>
            <p><span className="font-bold text-emerald-400">2đ</span> = x30 Thuốc Phối Thú Ăn Thịt</p>
            <p><span className="font-bold text-emerald-400">2đ</span> = x40 Thuốc Phối Thú Ăn Cỏ</p>
            <div className="border-t border-gray-700 my-4"></div>
            <p><span className="font-bold text-emerald-400">3đ</span> = full giáp sắt max chỉ số</p>
          </div>

          {/* Cột 3 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-3 border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 mb-3">Mốc 5-7 Điểm</h3>
            <p><span className="font-bold text-emerald-400">5đ</span> = 1 bv tự chọn</p>
            <p><span className="font-bold text-emerald-400">5đ</span> = 1 thú đột biến ramdon (lv 538 + 60lv)</p>
            <p><span className="font-bold text-emerald-400">5đ</span> = alpha raptor lv</p>
            <p><span className="font-bold text-emerald-400">5đ</span> = 1 bv tự chọn ( tek, tele, súng tek,…)</p>
            <div className="border-t border-gray-700 my-4"></div>
            <p><span className="font-bold text-emerald-400">6đ</span> = 1 thú đột biến tự chọn (lv 538 + 60lv)</p>
            <div className="border-t border-gray-700 my-4"></div>
            <p><span className="font-bold text-emerald-400">7đ</span> = 1 đảo bay</p>
          </div>

        </div>
      </div>
      
      {/* --- Footer CTA --- */}
      <div className="text-center border-t border-gray-700 pt-8">
        <p className="text-2xl text-gray-300 mb-6 break-words">
          🔥 Đừng bỏ lỡ sự giàu sang! Vận may đang chờ bạn lúc 20h! 🔥
        </p>
        
        <button 
          onClick={() => window.open("https://docs.google.com/spreadsheets/d/1C0m4B6UTP_opTxz8EezOmtIK7LjRfCogyue32ibx94I/edit?usp=sharing", "_blank")}
          /* SỬA: Giảm font-size trên mobile (text-lg -> text-base) */
          className="bg-yellow-600 text-white py-3 px-8 rounded-lg font-bold text-base sm:text-lg hover:bg-yellow-500 transition-colors duration-300 shadow-lg shadow-yellow-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-3">
          {/* SỬA: Bỏ icon "Sheet" */}
          <span>Xem Bảng Điểm Tích Lũy Ngay!</span>
        </button>
      </div>

    </div>
  );
};