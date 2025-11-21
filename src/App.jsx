import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// --- 1. Context (Đã thêm lại theo yêu cầu) ---
// Hãy chắc chắn bạn đã có file này: src/contexts/AuthContext.jsx
import { AuthProvider } from './contexts/AuthContext';

// --- 2. Component và Data cũ ---
import { Navbar } from './components/Navbar';
import { ImageZoomModal } from './components/ImageZoomModal';
import { initialProductData } from './data/productData';

// --- 3. Các trang (Pages) ---
// Các trang cũ của ARK Mobile
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { EventPage } from './pages/EventPage';

// Các trang MỚI của Chợ Trời (Đổi tên import Home để tránh trùng)
import FleaMarketHome from './pages/FleaMarketHome'; // Trang Home của chợ trời
import Login from './pages/Login';
import Register from './pages/Register';
import CreateListing from './pages/CreateListing';
import CardPage from './pages/Card';

// Component Layout chung (Navbar + Nền)
const AppLayout = () => (
  <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <main>
        <Outlet /> {/* Đây là nơi các trang con render */}
      </main>
    </div>
  </div>
);

// Component App chính
export default function App() {
  // State zoom ảnh (dành cho ShopPage)
  const [zoomState, setZoomState] = useState({
    isOpen: false,
    products: [],
    currentIndex: 0,
  });

  const handleOpenZoom = (products, startIndex = 0) => {
    setZoomState({
      isOpen: true,
      products: products,
      currentIndex: startIndex,
    });
  };

  const handleCloseZoom = () => {
    setZoomState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNavigateZoom = (direction) => {
    setZoomState((prev) => {
      let newIndex = prev.currentIndex + direction;
      const totalImages = prev.products.length;
      if (newIndex >= totalImages) newIndex = 0;
      if (newIndex < 0) newIndex = totalImages - 1;
      return { ...prev, currentIndex: newIndex };
    });
  };

  return (
    // Bọc toàn bộ ứng dụng trong AuthProvider để dùng chức năng đăng nhập
    <AuthProvider>
      <>
        {/* Giữ nguyên style cho animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 0.5s ease-out; }
          
          @keyframes fadeInFast {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in-fast { animation: fadeInFast 0.2s ease-out; }
        `}</style>
        
        {/* Định nghĩa các Route */}
        <Routes>
          
          {/* --- NHÓM 1: CÁC TRANG CÓ NAVBAR (AppLayout) --- */}
          <Route path="/" element={<AppLayout />}>
            {/* Trang chủ mặc định (ARK Mobile) */}
            <Route index element={<HomePage />} />
            
            {/* Trang Shop */}
            <Route 
              path="shop" 
              element={
                <ShopPage 
                  products={initialProductData} 
                  onOpenZoom={handleOpenZoom}
                  zoomState={zoomState}
                />
              } 
            />
            
            {/* Trang Sự kiện */}
            <Route path="/event" element={<EventPage />} />

            {/* Trang Chợ Trời (Home mới) -> Đã map sang đường dẫn /cho-troi */}
            <Route path="/cho-troi" element={<FleaMarketHome />} />

            {/* Trang Tạo bài đăng (Để trong Layout để có Navbar) */}
            <Route path="/create" element={<CreateListing />} />

            {/* Route dự phòng */}
            <Route path="*" element={<HomePage />} /> 
          </Route>
          
          {/* --- NHÓM 2: CÁC TRANG KHÔNG CÓ NAVBAR (Full màn hình) --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/card" element={<CardPage />} />

        </Routes>
        
        {/* Modal Zoom Ảnh (Luôn nằm trên cùng) */}
        {zoomState.isOpen && (
          <ImageZoomModal
            currentImage={zoomState.products[zoomState.currentIndex]?.imageUrl} 
            onClose={handleCloseZoom}
            onNavigate={handleNavigateZoom}
            hasNavigation={zoomState.products.length > 1}
          />
        )}
      </>
    </AuthProvider>
  );
}