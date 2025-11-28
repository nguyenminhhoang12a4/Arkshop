import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon'; // Import Icon
import { supabase } from '../services/supabaseClient'; // Import Supabase
import { useAuth } from '../contexts/AuthContext'; // Lấy thông tin user hiện tại
import { MagnifyingGlassIcon, PencilSquareIcon, CheckIcon, XMarkIcon, UserGroupIcon, BriefcaseIcon, PlusCircleIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/solid';

// --- IMPORT CHO SLIDER ---
import Slider from "react-slick";
// Import CSS bắt buộc của thư viện slider
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// --- IMPORT HÌNH ẢNH CỦA BẠN (Giữ nguyên) ---
import HinhTC1 from '../assets/HinhTC_1.png';
import HinhTC2 from '../assets/HinhTC_2.png';
import HinhTC3 from '../assets/HinhTC_3.png';
import HinhTC4 from '../assets/HinhTC_4.png';
import HinhTC5 from '../assets/HinhTC_5.png';
import HinhTC6 from '../assets/HinhTC_6.png';
import HinhTC7 from '../assets/HinhTC_7.png';
import HinhTC8 from '../assets/HinhTC_8.png';
import HinhTC9 from '../assets/HinhTC_9.png';
import HinhTC10 from '../assets/HinhTC_10.png';
import HinhTC11 from '../assets/HinhTC_11.png';
import HinhTC12 from '../assets/HinhTC_12.png';
import HinhTC13 from '../assets/HinhTC_13.png';
import HinhTC14 from '../assets/HinhTC_14.png';
import HinhTC15 from '../assets/HinhTC_15.png';
import HinhTC16 from '../assets/HinhTC_16.png';
import HinhTC17 from '../assets/HinhTC_17.png';
import HinhTC18 from '../assets/HinhTC_18.png';
import HinhTC19 from '../assets/HinhTC_19.png';
import HinhTC20 from '../assets/HinhTC_20.png';
import HinhTC21 from '../assets/HinhTC_21.png';
import HinhTC22 from '../assets/HinhTC_22.png';
import HinhTC23 from '../assets/HinhTC_23.png';
import HinhTC24 from '../assets/HinhTC_24.png';
import HinhTC25 from '../assets/HinhTC_25.png';
import HinhTC26 from '../assets/HinhTC_26.png';
import HinhTC27 from '../assets/HinhTC_27.png';
import HinhTC28 from '../assets/HinhTC_28.png';
import HinhTC29 from '../assets/HinhTC_29.png';
import HinhTC30 from '../assets/HinhTC_30.png';
import HinhTC31 from '../assets/HinhTC_31.png';
import HinhTC32 from '../assets/HinhTC_32.png';
import HinhTC33 from '../assets/HinhTC_33.png';
import HinhTC34 from '../assets/HinhTC_34.png';
import HinhTC35 from '../assets/HinhTC_35.png';
import HinhTC36 from '../assets/HinhTC_36.png';
import HinhTC37 from '../assets/HinhTC_37.png';
import HinhTC38 from '../assets/HinhTC_38.png';
import HinhTC39 from '../assets/HinhTC_39.png';
import HinhTC40 from '../assets/HinhTC_40.png';
import HinhTC41 from '../assets/HinhTC_41.png';
import HinhTC42 from '../assets/HinhTC_42.png';
import HinhTC43 from '../assets/HinhTC_43.png';
import HinhTC44 from '../assets/HinhTC_44.png';
import HinhTC45 from '../assets/HinhTC_45.png';

const sliderImages = [
  HinhTC1, HinhTC2, HinhTC3, HinhTC4, HinhTC5, HinhTC6, HinhTC7, HinhTC8, HinhTC9,
  HinhTC10, HinhTC11, HinhTC12, HinhTC13, HinhTC14, HinhTC15, HinhTC16, HinhTC17,
  HinhTC18, HinhTC19, HinhTC20, HinhTC21, HinhTC22, HinhTC23, HinhTC24, HinhTC25,
  HinhTC26, HinhTC27, HinhTC28, HinhTC29, HinhTC30, HinhTC31, HinhTC32, HinhTC33,
  HinhTC34, HinhTC35, HinhTC36, HinhTC37, HinhTC38, HinhTC39, HinhTC40, HinhTC41,
  HinhTC42, HinhTC43, HinhTC44, HinhTC45
];

/**
 * Component Home: Trang chủ
 */
export const HomePage = () => {
  const { user, profile } = useAuth(); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Form Request
  const [formContent, setFormContent] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formBounty, setFormBounty] = useState('');

  // --- STATE ADMIN USER MANAGEMENT ---
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); 
  const [newRank, setNewRank] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [hasMore, setHasMore] = useState(true);

  // 🔥 State Danh Sách Helper
  const [helpersList, setHelpersList] = useState([]);

  // Slider Settings
  const sliderSettings = {
    className: "center-slider",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    dots: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    slidesToShow: 1, 
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 1, centerPadding: "40px" }
      }
    ]
  };

  useEffect(() => {
    fetchRequests();
    fetchHelpers(); // Tải danh sách Helper

    if (profile?.role === 'admin') {
        handleAdminSearch(1);
    }

    const channel = supabase
      .channel('public:help_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'help_requests' }, fetchRequests)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  // --- FETCH HELPER LIST (MỚI) ---
  const fetchHelpers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('character_name, server, event_points')
      .eq('rank', 'helper')
      .order('event_points', { ascending: false }); // Xếp theo uy tín (điểm)
    
    if (!error) setHelpersList(data || []);
  };

  // --- FETCH REQUESTS ---
  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('help_requests')
      .select(`*, profiles:user_id (character_name, server, zalo_contact, rank), helper:helper_id (character_name)`)
      .order('created_at', { ascending: false })
      .neq('status', 'cancelled')
      .limit(20);
    if (!error) setRequests(data);
  };

  // --- ADMIN FUNCTIONS ---
  const handleAdminSearch = async (pageNumber = 1) => {
    setAdminLoading(true);
    setPage(pageNumber);
    try {
        const from = (pageNumber - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        let query = supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('rank', { ascending: true }) 
            .order('created_at', { ascending: false })
            .range(from, to);
        
        if (adminSearchTerm.trim()) {
            query = query.or(`character_name.ilike.%${adminSearchTerm}%,zalo_contact.ilike.%${adminSearchTerm}%,email.ilike.%${adminSearchTerm}%`);
        }
        
        const { data, error, count } = await query;
        if (error) throw error;
        
        setAdminUsers(data || []);
        setHasMore(count > to + 1);
    } catch (error) {
        alert("Lỗi tìm kiếm: " + error.message);
    } finally {
        setAdminLoading(false);
    }
  };

  const handleUpdateRank = async (userId) => {
      if (!newRank) return;
      try {
          const { error } = await supabase.rpc('admin_update_user_rank', {
              p_user_id: userId,
              p_new_rank: newRank
          });
          if (error) throw error;
          alert("✅ Cập nhật Rank thành công!");
          setEditingUser(null);
          handleAdminSearch(page);
          fetchHelpers(); // Cập nhật luôn list helper công khai
      } catch (error) {
          alert("Lỗi: " + error.message);
      }
  };

  // --- HELPER CENTER ACTIONS ---
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập!");
    const bounty = parseInt(formBounty);
    const currentPoints = profile?.event_points || 0;
    if (bounty <= 0) return alert("Số điểm phải lớn hơn 0");
    if (bounty > currentPoints) return alert(`Bạn không đủ điểm! (Có: ${currentPoints}, Cần: ${bounty})`);

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_help_request', {
        p_content: formContent, p_time_info: formTime, p_bounty: bounty
      });
      if (error) throw error;
      alert(data.message);
      setIsModalOpen(false); setFormContent(''); setFormTime(''); setFormBounty('');
      fetchRequests();
    } catch (err) { alert("Lỗi: " + err.message); } finally { setLoading(false); }
  };

  const handleAccept = async (reqId) => {
    if (!confirm("Bạn chắc chắn muốn nhận hỗ trợ?")) return;
    try {
      const { error } = await supabase.rpc('accept_help_request', { p_request_id: reqId });
      if (error) throw error;
      alert("Đã nhận kèo thành công!");
    } catch (err) { alert("Lỗi: " + err.message); }
  };

  const handleComplete = async (reqId) => {
    if (!confirm("Xác nhận hoàn thành và chuyển điểm?")) return;
    try {
      const { error } = await supabase.rpc('complete_help_request', { p_request_id: reqId });
      if (error) throw error;
      alert("Đã hoàn thành!");
    } catch (err) { alert("Lỗi: " + err.message); }
  };

  const handleCancel = async (reqId) => {
    if (!confirm("Hủy yêu cầu và nhận lại điểm?")) return;
    try {
      const { error } = await supabase.rpc('cancel_help_request', { p_request_id: reqId });
      if (error) throw error;
      alert("Đã hủy!");
    } catch (err) { alert("Lỗi: " + err.message); }
  };

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-lg shadow-2xl animate-fade-in font-sans">
      
      {/* --- Hero Section --- */}
      <div className="text-center p-8 rounded-lg bg-black bg-opacity-20 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900 opacity-30 blur-3xl z-0"></div>
        <div className="relative z-10">
          <Icon name="ShieldCheck" size={64} className="text-emerald-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Hệ thống server <span className="text-emerald-400">ARK Mobile Việt Nam</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Ra mắt hơn 1 năm bởi BennShop, sân chơi ổn định, công bằng và đầy sáng tạo.
          </p>
          <button onClick={() => window.open("https://zalo.me/g/nzqcdi654", "_blank")} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2">
            <Icon name="Rocket" size={22} /> <span>Tham Gia Ngay Hôm Nay!</span>
          </button>
        </div>
      </div>

      {/* --- Server Section --- */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3">
          <Icon name="Server" size={30} className="text-emerald-400" /><span>Hệ Thống Server</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Server Cards */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center mb-3"><Icon name="Swords" size={28} className="text-blue-400 mr-3" /><h3 className="text-2xl font-bold text-blue-400">🏕️ VN_game</h3></div>
            <p className="text-gray-300 mb-2">Dành cho người chơi thích trải nghiệm ổn định, cày cuốc nhẹ nhàng.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
            <div className="flex items-center mb-3"><Icon name="Swords" size={28} className="text-red-400 mr-3" /><h3 className="text-2xl font-bold text-red-400">⚔️ VN_toichoi</h3></div>
            <p className="text-gray-300 mb-2">Dành cho game thủ yêu thích PvP, chiến đấu sinh tồn khốc liệt.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center mb-3"><Icon name="Swords" size={28} className="text-green-400 mr-3" /><h3 className="text-2xl font-bold text-green-500">💖 VN_YenBinh</h3></div>
            <p className="text-gray-300 mb-2">Thế giới "Yên Bình" dành cho các chiến binh hệ cute!</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center mb-3"><Icon name="Swords" size={28} className="text-yellow-400 mr-3" /><h3 className="text-2xl font-bold text-yellow-400">⭐ Cổ Đông</h3></div>
            <p className="mb-2 text-xl text-yellow-400">Admin: TQK (VN_game)</p>
            <p className="text-gray-400 text-sm">Kêu gọi nhà đầu tư xây dựng server!</p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 👑 ADMIN PANEL (Giữ nguyên) */}
      {/* ============================================================== */}
      {profile?.role === 'admin' && (
        <div className="mb-16 border border-indigo-500 rounded-xl bg-gray-900 overflow-hidden shadow-xl">
          <div className="bg-indigo-600 p-4 flex items-center gap-3 text-white font-bold text-xl">
             <UserGroupIcon className="w-7 h-7" /> 
             <span>Admin: Quản Lý Người Dùng & Rank</span>
          </div>
          <div className="p-6 bg-gray-800">
             <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                   <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                     type="text" 
                     placeholder="Nhập tên, Zalo, Email... (Để trống = Xem Tất Cả)" 
                     className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                     value={adminSearchTerm}
                     onChange={(e) => setAdminSearchTerm(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleAdminSearch(1)}
                   />
                </div>
                <button onClick={() => handleAdminSearch(1)} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95">
                    {adminLoading ? 'Đang tải...' : 'Tìm'}
                </button>
             </div>
             <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-sm">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-gray-700 text-gray-300 uppercase font-bold">
                       <tr><th className="p-4">Người chơi</th><th className="p-4">Liên hệ</th><th className="p-4 text-center">Rank</th><th className="p-4 text-right">Sửa</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                       {adminUsers.length > 0 ? (
                           adminUsers.map(u => (
                              <tr key={u.id} className="hover:bg-gray-700/50 transition-colors">
                                 <td className="p-4"><div className="font-bold text-white text-base">{u.character_name}</div><div className="text-xs text-gray-500">{u.email}</div></td>
                                 <td className="p-4 text-gray-400 font-mono">{u.zalo_contact || <span className="text-gray-600 italic">Chưa cập nhật</span>}</td>
                                 <td className="p-4 text-center">
                                    {editingUser === u.id ? (
                                       <select className="bg-gray-900 border border-indigo-500 rounded px-2 py-1 text-white outline-none" value={newRank} onChange={(e) => setNewRank(e.target.value)}><option value="member">Member</option><option value="helper">Helper</option><option value="admin">Admin</option></select>
                                    ) : (
                                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${u.rank === 'admin' ? 'bg-red-900/50 text-red-300 border border-red-800' : u.rank === 'helper' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800' : 'bg-gray-700 text-gray-400'}`}>{u.rank || 'member'}</span>
                                    )}
                                 </td>
                                 <td className="p-4 text-right">
                                    {editingUser === u.id ? (
                                       <div className="flex gap-2 justify-end"><button onClick={() => handleUpdateRank(u.id)} className="bg-green-600 p-2 rounded hover:bg-green-500 transition-colors"><CheckIcon className="w-4 h-4 text-white" /></button><button onClick={() => setEditingUser(null)} className="bg-gray-600 p-2 rounded hover:bg-gray-500 transition-colors"><XMarkIcon className="w-4 h-4 text-white" /></button></div>
                                    ) : (
                                       <button onClick={() => { setEditingUser(u.id); setNewRank(u.rank || 'member'); }} className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30 p-2 rounded transition-colors"><PencilSquareIcon className="w-5 h-5" /></button>
                                    )}
                                 </td>
                              </tr>
                           ))
                       ) : (<tr><td colSpan="4" className="p-8 text-center text-gray-500 italic">Bấm "Tìm" để xem danh sách hoặc nhập từ khóa để tìm kiếm.</td></tr>)}
                    </tbody>
                 </table>
             </div>
             <p className="text-gray-500 text-xs mt-3 text-right italic">* Sắp xếp ưu tiên: Admin &gt; Helper &gt; Member (20 người/trang).</p>
             {adminUsers.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button onClick={() => handleAdminSearch(page - 1)} disabled={page === 1 || adminLoading} className={`px-4 py-2 rounded font-bold text-sm ${page === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>← Trước</button>
                  <span className="text-gray-300 font-bold text-sm">Trang {page}</span>
                  <button onClick={() => handleAdminSearch(page + 1)} disabled={!hasMore || adminLoading} className={`px-4 py-2 rounded font-bold text-sm ${!hasMore ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>Sau →</button>
                </div>
             )}
          </div>
        </div>
      )}

      {/* =========== 🔥 TRUNG TÂM HỖ TRỢ (NỔI BẬT) 🔥 =========== */}
      <div className="mb-16 relative group">
        {/* Hiệu ứng nền (Glow effect) */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        <div className="relative bg-gray-900 p-8 rounded-2xl border border-yellow-500/20 shadow-2xl overflow-hidden">
            {/* Hiệu ứng ánh sáng nền */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-3 flex items-center justify-center gap-3 uppercase tracking-wide">
                  <BriefcaseIcon className="w-10 h-10 text-yellow-500" />
                  Trung Tâm Hỗ Trợ
               </h2>
               <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                  Bạn cần người cày thuê, xây nhà, hay làm nhiệm vụ khó? <br/>
                  <span className="text-yellow-500 font-medium">Đăng yêu cầu ngay</span> để tìm <strong>Helper</strong> uy tín hỗ trợ bạn!
               </p>
            </div>

            {/* Nút Đăng Yêu Cầu (Đã căn chỉnh lại glow) */}
            <div className="text-center mb-12 flex justify-center">
               {user ? (
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="group relative flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-orange-600/20 transition-all transform hover:scale-105 hover:shadow-orange-500/40 active:scale-95 overflow-hidden"
                 >
                   {/* 🔥 Fix: Hiệu ứng bóng phủ đều toàn nút */}
                   <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                   
                   <PlusCircleIcon className="w-7 h-7 relative z-10" />
                   <span className="text-xl relative z-10">Đăng Yêu Cầu Mới</span>
                 </button>
               ) : (
                 <div className="inline-block bg-red-900/20 border border-red-500/30 px-6 py-3 rounded-lg backdrop-blur-sm">
                    <p className="text-red-400 font-medium flex items-center gap-2">
                        <Icon name="Info" size={20} />
                        Vui lòng đăng nhập để đăng yêu cầu hỗ trợ.
                    </p>
                 </div>
               )}
            </div>

            {/* 🔥 DANH SÁCH VINH DANH HELPER (MỚI) 🔥 */}
            {helpersList.length > 0 && (
              <div className="mb-12 bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-yellow-500/20">
                <h3 className="text-center text-xl font-extrabold text-yellow-400 mb-6 flex items-center justify-center gap-2 uppercase tracking-widest">
                  <SparklesIcon className="w-6 h-6 text-yellow-200 animate-pulse" /> 
                   Biệt Đội Hỗ Trợ Uy Tín
                  <SparklesIcon className="w-6 h-6 text-yellow-200 animate-pulse" />
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {helpersList.map((helper, index) => (
                    <div key={index} className="bg-gray-800 border border-yellow-600/30 rounded-xl p-4 flex flex-col items-center text-center shadow-lg relative group hover:-translate-y-1 transition-transform hover:shadow-yellow-500/20 hover:border-yellow-500">
                       {/* Helper Avatar */}
                       <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 p-0.5 mb-3 shadow-md relative">
                          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                             <UserGroupIcon className="w-7 h-7 text-yellow-400" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-gray-900 shadow-sm">
                             TOP
                          </div>
                       </div>
                       
                       <h4 className="font-bold text-white text-sm truncate w-full mb-1">{helper.character_name}</h4>
                       <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide bg-gray-900 px-2 py-0.5 rounded">{helper.server}</p>
                       
                       <div className="mt-auto w-full pt-2 border-t border-gray-700/50">
                          <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-xs">
                             <StarIcon className="w-3 h-3" /> {helper.event_points} <span className="font-normal text-gray-500">uy tín</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danh Sách Yêu Cầu */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {requests.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700">
                   <p className="text-gray-500 text-lg italic">Hiện chưa có yêu cầu nào. Hãy là người đầu tiên!</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className={`group relative p-6 rounded-xl border-l-4 bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                     req.status === 'open' ? 'border-green-500' : 
                     req.status === 'accepted' ? 'border-blue-500' : 'border-gray-600 opacity-70'
                  }`}>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h4 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors line-clamp-1 flex items-center gap-2">
                              {req.profiles?.character_name}
                              {req.profiles?.rank === 'helper' && (
                                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm border border-blue-400">Helper</span>
                              )}
                              {req.profiles?.rank === 'admin' && (
                                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm border border-red-400">Admin</span>
                              )}
                           </h4>
                           <span className="text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-700 mt-1 inline-block">{req.profiles?.server}</span>
                        </div>
                        <div className="text-right">
                           <div className="font-extrabold text-yellow-400 text-2xl">{req.bounty} <span className="text-xs text-gray-500 font-normal">điểm</span></div>
                           <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded inline-block mt-1 ${
                              req.status === 'open' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                              req.status === 'accepted' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' : 'bg-gray-700 text-gray-400'
                           }`}>
                              {req.status === 'open' ? 'Đang tìm' : req.status === 'accepted' ? 'Đang làm' : 'Đã xong'}
                           </span>
                        </div>
                     </div>

                     <div className="space-y-3 mb-5 border-t border-gray-700 pt-4">
                        <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed"><strong className="text-gray-500 uppercase text-xs block mb-1">Nội dung:</strong> {req.content}</p>
                        <p className="text-gray-300 text-sm"><strong className="text-gray-500 uppercase text-xs block mb-1">Thời gian:</strong> {req.time_info}</p>
                        {req.helper && (
                           <div className="mt-3 p-2 bg-blue-900/20 rounded border border-blue-500/30 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center">
                                  <UserGroupIcon className="w-4 h-4 text-blue-200"/>
                              </div>
                              <div>
                                  <p className="text-[10px] text-blue-400 uppercase font-bold">Helper</p>
                                  <p className="text-blue-200 text-sm font-bold">{req.helper.character_name}</p>
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="mt-auto flex gap-2 justify-end">
                        {user && user.id !== req.user_id && req.status === 'open' && (profile?.rank === 'helper' || profile?.role === 'admin') && (
                           <button onClick={() => handleAccept(req.id)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-500/40">
                              Nhận Kèo Ngay
                           </button>
                        )}
                        {user && user.id === req.user_id && (
                           <>
                              {req.status === 'open' && (
                                 <button onClick={() => handleCancel(req.id)} className="w-full bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white py-3 rounded-lg text-sm font-bold transition-all">Hủy Yêu Cầu</button>
                              )}
                              {req.status === 'accepted' && (
                                 <button onClick={() => handleComplete(req.id)} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg text-sm font-bold animate-pulse shadow-lg shadow-green-600/30">
                                    Xác Nhận Hoàn Thành
                                 </button>
                              )}
                           </>
                        )}
                     </div>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
      {/* =========== HẾT TRUNG TÂM HỖ TRỢ =========== */}

      {/* =========== SECTION SỰ KIỆN NỔI BẬT =========== */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3">
          <Icon name="Megaphone" size={30} className="text-emerald-400" />
          <span>Sự Kiện Nổi Bật</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Thẻ sự kiện giữ nguyên */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-emerald-500 hover:shadow-emerald-500/20 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-emerald-400">🎄 Event Giáng Sinh</h3>
              <span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span>
            </div>
            <p className="text-gray-300 mb-4 flex-grow">Tham gia săn quà Giáng Sinh, thu thập vật phẩm hiếm và nhận thưởng độc quyền từ Admin. Đừng bỏ lỡ!</p>
            <div className="text-gray-400 text-sm border-t border-gray-700 pt-3"><Icon name="Calendar" className="inline-block mr-2" size={16} /><span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span></div>
          </div>
          {/* ... Các thẻ khác ... */}
           <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-yellow-500 hover:shadow-yellow-500/20 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-yellow-400">🏁 Đua Thú Tốc Độ</h3>
              <span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span>
            </div>
            <p className="text-gray-300 mb-4 flex-grow">Giải đua lớn nhất server! Chuẩn bị những con thú tốc độ nhất của bạn để rinh về phần thưởng giá trị.</p>
            <div className="text-gray-400 text-sm border-t border-gray-700 pt-3"><Icon name="Calendar" className="inline-block mr-2" size={16} /><span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span></div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 opacity-70 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-gray-500">🎃 Săn Bí Ngô</h3>
              <span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span>
            </div>
            <p className="text-gray-400 mb-4 flex-grow">Sự kiện Halloween đã qua. Cảm ơn các bạn đã tham gia. Hẹn gặp lại vào năm sau!</p>
            <div className="text-gray-400 text-sm border-t border-gray-700 pt-3"><Icon name="Calendar" className="inline-block mr-2" size={16} />Thời gian: 25/10 - 31/10</div>
          </div>
        </div>
      </div>

      {/* =========== SECTION KHOẢNH KHẮC SERVER =========== */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3">
          <span className="text-3xl" role="img" aria-label="Camera">📸</span>
          <span>Khoảnh Khắc Server</span>
        </h2>
        <div className="slider-wrapper">
          <Slider {...sliderSettings}>
            {sliderImages.map((imgSrc, index) => (
              <div key={index} className="px-2">
                <img src={imgSrc} alt={`Hình ảnh server ${index + 1}`} className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-700"/>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* --- Footer CTA --- */}
      <div className="text-center border-t border-gray-700 pt-8">
        <p className="text-xl text-gray-300 mb-4">Thuần hóa khủng long, xây dựng căn cứ, liên minh cùng bạn bè – tất cả đang chờ bạn!</p>
        <div className="text-gray-400 text-2xl">
          <div className="mb-4"><Icon name="MessageSquare" className="inline-block mr-2" />Liên hệ: <strong>BennShop</strong></div>
          <div><button onClick={() => window.open("https://zalo.me/0842039811", "_blank")} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors duration-300 shadow-lg shadow-emerald-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2"><Icon name="Rocket" size={22} /><span>Zalo: 0842039811</span></button></div>
        </div>
      </div>

      {/* --- MODAL ĐĂNG YÊU CẦU --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
           <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-600" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Đăng Yêu Cầu Hỗ Trợ</h3>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Nội dung cần hỗ trợ</label>
                    <textarea className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-yellow-500 outline-none" rows="3" placeholder="VD: Cần hỗ trợ tame Giga, xây nhà..." value={formContent} onChange={e => setFormContent(e.target.value)} required />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Thời gian cụ thể</label>
                    <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-yellow-500 outline-none" placeholder="VD: 19h tối nay" value={formTime} onChange={e => setFormTime(e.target.value)} required />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Điểm thưởng (Vietlott)</label>
                    <p className="text-xs text-emerald-400 mb-2">
                        (Bạn đang có: {profile?.event_points || 0} EP)
                    </p>
                    <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-yellow-400 font-bold focus:border-yellow-500 outline-none" placeholder="VD: 50" value={formBounty} onChange={e => setFormBounty(e.target.value)} required />
                 </div>
                 <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white font-bold">Hủy</button>
                    <button type="submit" disabled={loading} className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-white font-bold">{loading ? 'Đang đăng...' : 'Đăng Ngay'}</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};