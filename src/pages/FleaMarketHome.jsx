import { useEffect, useState } from 'react'; 
import { supabase } from '../services/supabaseClient';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  InformationCircleIcon, 
  ExclamationTriangleIcon, 
  NoSymbolIcon,
  XMarkIcon,
  MagnifyingGlassPlusIcon,
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PencilSquareIcon, 
  CheckIcon 
} from '@heroicons/react/24/solid';

export default function FleaMarketHome() {
  const { user, profile, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterServer, setFilterServer] = useState('ALL');

  // State cho Modal
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null); 
  
  // --- STATE CHO ADMIN (QUẢN LÝ LIMIT) ---
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminUserList, setAdminUserList] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newLimitValue, setNewLimitValue] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  
  // 🔥 State mới: Giới hạn mặc định từ DB & Phân trang
  const [defaultLimit, setDefaultLimit] = useState(3); // Mặc định fallback là 3 nếu chưa load đc
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
    fetchSystemSettings(); // Lấy cấu hình mặc định
  }, []);

  useEffect(() => {
    if (location.state?.showWelcomeRules) {
      setShowRulesModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]); 
  
  // Load danh sách user ngay khi Admin vào (nếu là Admin)
  useEffect(() => {
    if (profile?.role === 'admin') {
      handleAdminSearch(1);
    }
  }, [profile]);

  // --- LẤY CẤU HÌNH HỆ THỐNG ---
  const fetchSystemSettings = async () => {
    const { data } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'default_post_limit')
      .single();
    
    if (data) setDefaultLimit(data.value);
  };

  // --- LOGIC CHÍNH: LẤY TIN ĐĂNG ---
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

  // --- LOGIC ADMIN: TÌM KIẾM NGƯỜI DÙNG & PHÂN TRANG ---
  const handleAdminSearch = async (pageNumber = 1) => {
    if (profile?.role !== 'admin') return;
    
    setAdminLoading(true);
    setPage(pageNumber);

    try {
      const from = (pageNumber - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false }) // Người mới nhất lên đầu
        .range(from, to);

      // Nếu có từ khóa tìm kiếm
      if (adminSearchTerm.trim()) {
        query = query.or(`character_name.ilike.%${adminSearchTerm}%,email.ilike.%${adminSearchTerm}%,zalo_contact.ilike.%${adminSearchTerm}%`);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setAdminUserList(data || []);
      setHasMore(count > to + 1);

    } catch (err) {
      alert("Lỗi tải danh sách: " + err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  // --- LOGIC ADMIN: CẬP NHẬT LIMIT ---
  const handleUpdateLimit = async (userId) => {
    // Nếu để trống thì set về NULL (dùng mặc định)
    const limitToSend = newLimitValue === '' ? null : parseInt(newLimitValue);
    
    try {
      const { error } = await supabase.rpc('admin_update_post_limit', {
        p_user_id: userId,
        p_new_limit: limitToSend
      });

      if (error) throw error;

      alert("✅ Đã cập nhật giới hạn thành công!");
      setEditingUserId(null);
      handleAdminSearch(page); // Tải lại trang hiện tại để cập nhật UI

    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  const filteredListings = filterServer === 'ALL' 
    ? listings 
    : listings.filter(item => item.profiles?.server === filterServer);

  const openZoomModal = (imageUrl) => setZoomedImageUrl(imageUrl);
  const closeZoomModal = () => setZoomedImageUrl(null);
  
  return (
    <div className="min-h-screen bg-gray-50 relative pb-20">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-y-3">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tighter whitespace-nowrap">
            "CHỢ TRỜI" rẻ như cho
          </h1>
          
          <div className="flex items-center gap-2 md:gap-4">
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

            {user ? (
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
              <Link to="/login" className="text-blue-600 font-bold hover:underline whitespace-nowrap">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ========================================================= */}
        {/* 🛡️ KHU VỰC ADMIN: QUẢN LÝ GIỚI HẠN (Chỉ hiện với Admin) */}
        {/* ========================================================= */}
        {profile?.role === 'admin' && (
          <div className="mb-8 bg-white border-2 border-indigo-500/30 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 p-3 px-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                 <UserGroupIcon className="w-5 h-5" /> Admin: Quản Lý Giới Hạn Đăng Tin
              </h3>
            </div>
            
            <div className="p-4 sm:p-6">
              {/* Thanh tìm kiếm */}
              <div className="flex gap-2 mb-4 max-w-2xl">
                 <div className="relative flex-1">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Tìm tên, email, zalo... (Trống = Xem tất cả)" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={adminSearchTerm}
                      onChange={(e) => setAdminSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdminSearch(1)}
                    />
                 </div>
                 <button 
                    onClick={() => handleAdminSearch(1)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 whitespace-nowrap"
                 >
                    Tìm Kiếm
                 </button>
              </div>

              {/* Kết quả tìm kiếm */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                 {/* Header Bảng */}
                 <div className="grid grid-cols-12 bg-gray-100 p-3 text-xs sm:text-sm font-bold text-gray-700 uppercase">
                    <div className="col-span-6 sm:col-span-5">Thông tin User</div>
                    <div className="col-span-3 sm:col-span-4 text-center">Giới hạn</div>
                    <div className="col-span-3 text-right">Sửa</div>
                 </div>

                 {/* Body Bảng (Có scroll) */}
                 <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-gray-100">
                   {adminUserList.length > 0 ? (
                     adminUserList.map(u => (
                       <div key={u.id} className="grid grid-cols-12 p-3 items-center hover:bg-indigo-50">
                          {/* Cột Thông tin */}
                          <div className="col-span-6 sm:col-span-5 pr-2">
                             <div className="font-bold text-gray-800 truncate">{u.character_name}</div>
                             <div className="text-xs text-gray-500 truncate">{u.email}</div>
                             <div className="text-[10px] text-gray-400">{u.zalo_contact}</div>
                          </div>

                          {/* Cột Giới hạn */}
                          <div className="col-span-3 sm:col-span-4 text-center">
                             {editingUserId === u.id ? (
                                <input 
                                  type="number" 
                                  autoFocus
                                  placeholder={`Mặc định (${defaultLimit})`}
                                  className="w-full border border-indigo-500 rounded p-1 text-center font-bold text-indigo-700 bg-white text-sm"
                                  value={newLimitValue}
                                  onChange={(e) => setNewLimitValue(e.target.value)}
                                />
                             ) : (
                                <span className={`font-bold text-xs sm:text-sm px-2 py-1 rounded whitespace-nowrap ${u.custom_post_limit ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                                   {u.custom_post_limit ? `${u.custom_post_limit} tin` : `Mặc định (${defaultLimit})`}
                                </span>
                             )}
                          </div>

                          {/* Cột Hành động */}
                          <div className="col-span-3 text-right">
                             {editingUserId === u.id ? (
                                <div className="flex gap-1 justify-end">
                                   <button onClick={() => handleUpdateLimit(u.id)} className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700 shadow-sm" title="Lưu">
                                      <CheckIcon className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => setEditingUserId(null)} className="bg-gray-400 text-white p-1.5 rounded hover:bg-gray-500 shadow-sm" title="Hủy">
                                      <XMarkIcon className="w-4 h-4" />
                                   </button>
                                </div>
                             ) : (
                                <button 
                                  onClick={() => {
                                     setEditingUserId(u.id);
                                     setNewLimitValue(u.custom_post_limit || '');
                                  }}
                                  className="text-indigo-600 hover:bg-indigo-100 p-2 rounded"
                                  title="Sửa giới hạn"
                                >
                                   <PencilSquareIcon className="w-5 h-5" />
                                </button>
                             )}
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="p-6 text-center text-gray-500 italic">
                       {adminLoading ? 'Đang tải...' : 'Không tìm thấy user nào.'}
                     </div>
                   )}
                 </div>
              </div>

              {/* Phân trang Admin */}
              {adminUserList.length > 0 && (
                 <div className="flex justify-center items-center gap-4 mt-4">
                    <button 
                      onClick={() => handleAdminSearch(page - 1)} 
                      disabled={page === 1 || adminLoading} 
                      className={`px-3 py-1 rounded text-sm font-bold ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                    >
                      ← Trước
                    </button>
                    <span className="text-sm font-bold text-gray-600">Trang {page}</span>
                    <button 
                      onClick={() => handleAdminSearch(page + 1)} 
                      disabled={!hasMore || adminLoading} 
                      className={`px-3 py-1 rounded text-sm font-bold ${!hasMore ? 'bg-gray-200 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                    >
                      Sau →
                    </button>
                 </div>
              )}

            </div>
          </div>
        )}
        {/* ========================================================= */}

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
                
                {/* Nút Xóa */}
                {user && (user.id === item.user_id || profile?.role === 'admin') && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded shadow hover:bg-red-700 z-10 text-xs font-bold"
                  >
                    Xóa tin
                  </button>
                )}

                {/* Ảnh Zoom */}
                <button
                  type="button"
                  onClick={() => openZoomModal(item.image_url)}
                  className="h-48 bg-gray-200 relative w-full group/image cursor-zoom-in"
                >
                  <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <MagnifyingGlassPlusIcon className="h-10 w-10 text-white" />
                  </div>

                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
                    {item.profiles?.server}
                  </span>
                </button>

                {/* Thông tin chi tiết */}
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

      {/* MODAL QUY ĐỊNH */}
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
              <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
                Chào mừng bạn! 👋
              </h2>
              <p className="text-center text-gray-600 mb-6 -mt-4">
                Vui lòng đọc kỹ các quy định trước khi đăng bài nhé.
              </p>
              
              {/* Nội dung quy định giữ nguyên */}
              <div className="mb-6">
                <h3 className="flex items-center text-lg font-bold text-blue-600 mb-3">
                  <InformationCircleIcon className="h-6 w-6 mr-2" />
                  Thông Tin Khi Đăng Bài
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Để biết giá đăng hợp lý, bạn có thể **tham khảo ở /shop**.</li>
                  <li>Có món nào bán món đó.</li>
                  <li>Nếu cần trung gian thì liên hệ **ad BennShop**.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="flex items-center text-lg font-bold text-indigo-600 mb-3">
                  <span className="text-xl mr-2">📊</span>
                  Giới Hạn Đăng Bài
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Mỗi người sẽ được đăng bán **{defaultLimit} mặt hàng** (Mặc định).</li>
                  <li>Có thể liên hệ Admin để **nâng cấp giới hạn**.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="flex items-center text-lg font-bold text-yellow-600 mb-3">
                  <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                  Quy Định Khi Đăng Bài
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>**Không đăng** các mặt hàng hack/cheat.</li>
                  <li>Vi phạm sẽ bị **khóa tài khoản vĩnh viễn**.</li>
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

      {/* MODAL ZOOM ẢNH */}
      {zoomedImageUrl && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={closeZoomModal}
        >
          <button 
            onClick={closeZoomModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            title="Đóng"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomedImageUrl} 
              alt="Zoom ảnh vật phẩm"
              className="block max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

    </div>
  );
}