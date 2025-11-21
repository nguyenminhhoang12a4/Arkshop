import React, { useState, useEffect } from 'react';
import { ProductList } from '../components/ProductList';
import { HowToBuy } from '../components/HowToBuy';
import { SearchBar } from '../components/SearchBar'; 
import { shopDisplayNames, shopImageStyles } from '../data/productData'; 

export const ShopPage = ({ products, onOpenZoom, zoomState }) => {
  // Lấy danh sách tên các shop (A, B, C...)
  const shopTabs = Object.keys(products);
  
  // State lưu shop hiện tại (mặc định là shop đầu tiên)
  const [currentShop, setCurrentShop] = useState(shopTabs[0] || 'A');
  
  // State lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  
  // State lưu ID sản phẩm cần highlight (hiệu ứng viền vàng)
  const [highlightedId, setHighlightedId] = useState(null);

  // Lấy style ảnh (vuông/chữ nhật) của shop hiện tại
  const currentImageStyle = shopImageStyles[currentShop] || "aspect-video";
  
  // Lấy danh sách sản phẩm của shop hiện tại
  const currentShopProducts = products[currentShop] || [];
  
  // Logic lọc sản phẩm theo từ khóa tìm kiếm
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const filteredProducts = normalizedSearch
    ? currentShopProducts.filter(product => product.name.toLowerCase().includes(normalizedSearch))
    : currentShopProducts;

  // --- HIỆU ỨNG: Tự động cuộn và highlight khi đóng Zoom ---
  useEffect(() => {
    // Chỉ chạy khi modal vừa ĐÓNG (isOpen từ true -> false)
    if (!zoomState.isOpen && zoomState.products.length > 0) {
      // Lấy sản phẩm vừa xem cuối cùng
      const lastViewedProduct = zoomState.products[zoomState.currentIndex];
      
      if (lastViewedProduct) {
        // Tìm thẻ HTML của sản phẩm đó
        const element = document.getElementById(`product-${lastViewedProduct.id}`);
        
        if (element) {
          // Cuộn tới đó
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Bật highlight
          setHighlightedId(lastViewedProduct.id);
          // Tắt highlight sau 2 giây
          setTimeout(() => setHighlightedId(null), 2000);
        }
      }
    }
  }, [zoomState.isOpen]); // Chỉ theo dõi biến isOpen

  // --- HÀM: Xử lý khi click vào ảnh để mở Zoom ---
  const handleImageClick = (clickedProductId) => {
    // Tìm vị trí của sản phẩm trong danh sách ĐANG HIỂN THỊ
    const clickedIndex = filteredProducts.findIndex(p => p.id === clickedProductId);
    
    if (clickedIndex !== -1 && onOpenZoom) {
      // Gửi danh sách đang xem vào Modal Zoom
      onOpenZoom(filteredProducts, clickedIndex);
    }
  };

  // --- HÀM: Xử lý chuyển Tab Shop ---
  const handleShopChange = (shopId) => {
    setCurrentShop(shopId); // Cập nhật shop hiện tại
    setSearchTerm('');      // Xóa từ khóa tìm kiếm cũ
  };
  
  return (
    <div className="animate-fade-in">
      {/* --- THANH TABS CHỌN SHOP --- */}
      <div className="mb-6 bg-white p-2 rounded-lg shadow flex flex-wrap justify-center sm:justify-start space-x-1 sm:space-x-2">
        {shopTabs.map(shopId => {
          const isActive = currentShop === shopId;
          const displayName = shopDisplayNames[shopId] || `Shop ${shopId}`;
          return (
            <button
              key={shopId}
              onClick={() => handleShopChange(shopId)}
              className={`
                px-4 sm:px-6 py-3 font-semibold rounded-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5
                ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      {/* Tiêu đề Shop */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Sản phẩm trong <span className="text-blue-600">{shopDisplayNames[currentShop] || `Shop ${currentShop}`}</span>
        </h2>
      </div>

      {/* Layout chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Thanh tìm kiếm */}
          <div className="mb-6">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
            />
          </div>

          {/* Danh sách sản phẩm */}
          <ProductList 
            products={filteredProducts} 
            onImageClick={handleImageClick} 
            imageClassName={currentImageStyle}
            highlightedId={highlightedId}
          />
        </div>

        {/* Cột bên phải: Hướng dẫn mua hàng */}
        <div className="lg:col-span-1">
          <HowToBuy />
        </div>
      </div>
    </div>
  );
};