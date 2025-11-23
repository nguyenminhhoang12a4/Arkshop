import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// --- 1. Context ---
import { AuthProvider } from './contexts/AuthContext';

// --- 2. Component và Data ---
import { Navbar } from './components/Navbar';
import { ImageZoomModal } from './components/ImageZoomModal';
import { initialProductData } from './data/productData';

// --- 3. Các trang (Pages) ---
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { EventPage } from './pages/EventPage';

import FleaMarketHome from './pages/FleaMarketHome'; 
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
        <Outlet />
      </main>
    </div>
  </div>
);

export default function App() {
  // State zoom ảnh
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
    <AuthProvider>
      <>
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
        
        <Routes>
          
          {/* --- NHÓM 1: CÁC TRANG CÓ NAVBAR (AppLayout) --- */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            
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
            
            <Route path="/event" element={<EventPage />} />
            <Route path="/cho-troi" element={<FleaMarketHome />} />
            <Route path="/create" element={<CreateListing />} />
            
            {/* ✅ ĐÃ CHUYỂN CARD PAGE LÊN ĐÂY ĐỂ CÓ NAVBAR */}
            <Route path="/card" element={<CardPage />} />

            {/* Route dự phòng */}
            <Route path="*" element={<HomePage />} /> 
          </Route>
          
          {/* --- NHÓM 2: CÁC TRANG KHÔNG CÓ NAVBAR (Login/Register) --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Đã xóa CardPage ở đây */}

        </Routes>
        
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