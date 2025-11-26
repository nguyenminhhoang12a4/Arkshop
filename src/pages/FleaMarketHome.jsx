// 📂 src/pages/FleaMarketHome.jsx
import { useEffect, useState } from 'react'; 
import { supabase } from '../services/supabaseClient';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  InformationCircleIcon, 
  ExclamationTriangleIcon, 
  NoSymbolIcon,
  XMarkIcon,
  // 👇 THAY ĐỔI 1: Thêm icon để báo hiệu zoom (Từ lần trước)
  MagnifyingGlassPlusIcon 
} from '@heroicons/react/24/solid';

export default function FleaMarketHome() {
  const { user, profile, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterServer, setFilterServer] = useState('ALL');

  // State cho Modal Quy định
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  // 👇 THAY ĐỔI 2: Thêm state cho Modal Zoom (Từ lần trước)
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null); 
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  // useEffect cho Modal Quy định (Không đổi)
  useEffect(() => {
    if (location.state?.showWelcomeRules) {
      setShowRulesModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]); 

  // (Hàm fetchListings, handleDelete... không đổi)
  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select(`*, profiles (character_name, server, zalo_contact)`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) console.error('Lỗi tải tin:', error);
    else setListings(data);
    setLoading(false);
  };
  const handleDelete = async (listingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin này không?")) return;
    const { error } = await supabase.from('listings').delete().eq('id', listingId);
    if (error) alert("Lỗi xóa tin: " + error.message);
    else {
      alert("Đã xóa tin thành công!");
      fetchListings();
    }
  };
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  const filteredListings = filterServer === 'ALL' 
    ? listings 
    : listings.filter(item => item.profiles?.server === filterServer);

  // 👇 THAY ĐỔI 3: Thêm hàm mở/đóng Modal Zoom (Từ lần trước)
  const openZoomModal = (imageUrl) => setZoomedImageUrl(imageUrl);
  const closeZoomModal = () => setZoomedImageUrl(null);
  
  return (
    <div className="min-h-screen bg-gray-50 relative">
      
      {/* ========================================== */}
      {/* ========= HEADER (ĐÃ SỬA LỖI LAYOUT) ===== */}
      {/* ========================================== */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        {/* Bỏ justify-between, dùng flex-wrap để tự xuống dòng nếu cần */}
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-y-3">
          
          {/* Tiêu đề bên trái (Thêm whitespace-nowrap để không bị vỡ chữ) */}
          <h1 className="text-2xl font-bold text-blue-600 tracking-tighter whitespace-nowrap">
            "CHỢ TRỜI" rẻ như cho
          </h1>
          
          {/* BỌC TẤT CẢ CÁC NÚT ĐIỀU KHIỂN BÊN PHẢI VÀO MỘT DIV MỚI */}
          {/* Dùng gap-2 trên di động, md:gap-4 trên máy tính */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Select Server (Không đổi) */}
            <select 
              className="border p-2 rounded-md bg-gray-100 text-sm font-medium"
              value={filterServer}
              onChange={(e) => setFilterServer(e.target.value)}
            >
              <option value="ALL">🌍 Tất cả Server</option>
              <option value="VN_Game">VN_Game</option>
              <option value="VN_YenBinh">VN_YenBinh</option>
              <option value="VN_ToiChoi">VN_ToiChoi</option>
            </select>

            {/* Logic Đăng nhập / Đăng xuất */}
            {user ? (
              // Dùng Fragment (hoặc giữ div) để các item con nằm ngang hàng với <select>
              // Bỏ div lồng nhau bên trong đi để code gọn hơn
              <> 
                <span className="hidden md:block text-gray-600 text-sm">
                  Xin chào, <b>{profile?.character_name || user.email.split('@')[0]}</b>
                </span>
                <Link to="/create" className="bg-blue-600 text-white px-3 py-2 md:px-4 rounded-full font-bold shadow hover:bg-blue-700 transition text-sm md:text-base">
                  + Đăng tin
                </Link>
                <button onClick={logout} className="text-gray-500 hover:text-red-500 text-sm font-medium">
                  Thoát
                </button>
              </>
            ) : (
              // Thêm whitespace-nowrap để chữ "Đăng nhập" không bị xuống dòng
              <Link to="/login" className="text-blue-600 font-bold hover:underline whitespace-nowrap">
                Đăng nhập
              </Link>
            )}
          </div>
          {/* KẾT THÚC DIV BÊN PHẢI */}
        </div>
      </header>
      {/* ========================================== */}
      {/* ============ KẾT THÚC HEADER ============== */}
      {/* ========================================== */}


      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chưa có vật phẩm nào được rao bán ở Server này.</p>
            {user && <Link to="/create" className="text-blue-500 mt-2 inline-block">Đăng bán món đầu tiên ngay!</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border overflow-hidden flex flex-col relative group">
                
                {/* Nút Xóa (Không đổi) */}
                {user && (user.id === item.user_id || profile?.role === 'admin') && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded shadow hover:bg-red-700 z-10 text-xs font-bold"
                  >
                    Xóa tin
                  </button>
                )}

                {/* 👇 THAY ĐỔI 4: Bọc ảnh bằng <button> để zoom (Từ lần trước) */}
                <button
                  type="button"
                  onClick={() => openZoomModal(item.image_url)}
                  className="h-48 bg-gray-200 relative w-full group/image cursor-zoom-in"
                >
                  <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                  
                  {/* Icon zoom khi hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <MagnifyingGlassPlusIcon className="h-10 w-10 text-white" />
                  </div>

                  {/* Tag Server (Thêm z-10 để nổi lên trên) */}
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
                    {item.profiles?.server}
                  </span>
                </button>
                {/* 👆 KẾT THÚC THAY ĐỔI ẢNH */}

                {/* Thông tin chi tiết (Không đổi) */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 text-lg truncate" title={item.item_name}>
                    {item.item_name}
                  </h3>
                  <p className="text-red-600 font-bold text-xl mt-1">{formatMoney(item.price)}</p>
                  
                  <div className="mt-auto pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{item.profiles?.character_name}</span>
                    </div>
                    <a 
                      href={`https://zalo.me/${item.profiles?.zalo_contact}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Chat Zalo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL QUY ĐỊNH (Không đổi) */}
      {showRulesModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40" 
            onClick={() => setShowRulesModal(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="p-6 md:p-8">
              {/* (Nội dung quy định của bạn...) */}
              <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
                Chào mừng bạn! 👋
              </h2>
              <p className="text-center text-gray-600 mb-6 -mt-4">
                Vui lòng đọc kỹ các quy định trước khi đăng bài nhé.
              </p>
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-bold text-blue-600 mb-3">
                  <InformationCircleIcon className="h-6 w-6 mr-2" />
                  Thông Tin Khi Đăng Bài
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Để biết giá đăng hợp lý, bạn có thể **tham khảo ở /shop** để so sánh. Sau đó đăng bán với giá **(+- 2.000đ)**.</li>
                  <li className="pl-4">
                    *Ví dụ: có con qz 700k HP ở shop bán 60k thì bạn có thể đăng bán với giá **58-62k**.*
                  </li>
                  <li>Có món nào bán món đó.</li>
                  <li>Nếu cần trung gian thì liên hệ **ad BennShop (10k/1 lần)**.</li>
                  <li>Nếu cần định giá món hàng thì liên hệ BennShop 5k/ 1 món.</li>
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-bold text-indigo-600 mb-3">
                  <span className="text-xl mr-2">📊</span>
                  Giới Hạn Đăng Bài
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Mỗi người sẽ được đăng bán **1 mặt hàng**.</li>
                  <li>Rank normal: **2 mặt hàng**.</li>
                  <li>Rank silver: **3 mặt hàng**.</li>
                  <li>Rank gold: **4 mặt hàng**.</li>
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-bold text-yellow-600 mb-3">
                  <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                  Quy Định Khi Đăng Bài
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>**Không đăng** các mặt hàng có liên quan đến **hack**.</li>
                  <li>Khi **không có gói** thì chỉ được đăng bán **thú**.</li>
                  <li>Khi **Sở hữu gói Pass ad** (normal, silver, gold) thì chỉ được đăng bán các mặt hàng **trong đó**.</li>
                  <li>Khi đăng món hàng mà mình không có thì bị <span className="font-bold text-red-600 uppercase">band vĩnh viễn</span>.</li>
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-bold text-red-600 mb-3">
                  <NoSymbolIcon className="h-6 w-6 mr-2" />
                  Hình Phạt
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Khi vi phạm: **– 1 mặt hàng đăng bài**.</li>
                </ul>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="w-full bg-green-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </>
      )}

      {/* 👇 THÊM 5: MODAL ZOOM ẢNH VẬT PHẨM 👇 (Từ lần trước) */}
      {zoomedImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={closeZoomModal} // Click nền mờ để đóng
        >
          {/* Nút đóng (X) ở góc */}
          <button 
            onClick={closeZoomModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            title="Đóng"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          
          {/* Container ảnh */}
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()} // Ngăn click vào ảnh bị đóng modal
          >
            <img 
              src={zoomedImageUrl} 
              alt="Zoom ảnh vật phẩm"
              className="block max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
      {/* 👆 KẾT THÚC MODAL ZOOM ẢNH 👆 */}

    </div>
  );
}