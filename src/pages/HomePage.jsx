import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon'; // Import Icon
import { supabase } from '../services/supabaseClient'; // Import Supabase
import { useAuth } from '../contexts/AuthContext'; // Lấy thông tin user hiện tại
import { MagnifyingGlassIcon, PencilSquareIcon, CheckIcon, XMarkIcon, UserGroupIcon, BriefcaseIcon, PlusCircleIcon, StarIcon, SparklesIcon, ClockIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

// --- IMPORT CHO SLIDER ---
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// --- IMPORT HÌNH ẢNH (GIỮ NGUYÊN) ---
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

export const HomePage = () => {
  const { user, profile } = useAuth(); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Form Request
  const [formContent, setFormContent] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formBounty, setFormBounty] = useState('');

  // Admin Management State
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); 
  const [newRank, setNewRank] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [hasMore, setHasMore] = useState(true);

  // Helper List State
  const [helpersList, setHelpersList] = useState([]);

  // State Lịch Sử
  const [historyList, setHistoryList] = useState([]);

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
        settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "20px", centerMode: true } 
      }
    ]
  };

  useEffect(() => {
    fetchRequests();
    fetchHelpers();
    fetchHistory(); 

    if (profile?.role === 'admin') {
        handleAdminSearch(1);
    }

    const channel = supabase
      .channel('public:help_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'help_requests' }, (payload) => {
          fetchRequests();
          fetchHistory();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  // --- FETCH DATA ---
  const fetchHelpers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('character_name, server, event_points')
      .eq('rank', 'helper')
      .order('event_points', { ascending: false }); 
    if (!error) setHelpersList(data || []);
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('help_requests')
      .select(`*, profiles:user_id (character_name, server, zalo_contact, rank), helper:helper_id (character_name, id)`)
      .order('created_at', { ascending: false })
      .neq('status', 'cancelled')
      .neq('status', 'completed') 
      .limit(20);
    if (!error) setRequests(data);
  };

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('help_requests')
      .select(`
        *, 
        profiles:user_id (character_name), 
        helper:helper_id (character_name)
      `)
      .in('status', ['completed', 'cancelled'])
      .order('created_at', { ascending: false })
      .limit(30); 
    
    if (!error) setHistoryList(data || []);
  };

  // --- ADMIN FUNCTIONS ---
  const handleAdminSearch = async (pageNumber = 1) => {
    setAdminLoading(true);
    setPage(pageNumber);
    try {
        const from = (pageNumber - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        let query = supabase.from('profiles').select('*', { count: 'exact' }).order('rank', { ascending: true }).order('created_at', { ascending: false }).range(from, to);
        if (adminSearchTerm.trim()) {
            query = query.or(`character_name.ilike.%${adminSearchTerm}%,zalo_contact.ilike.%${adminSearchTerm}%,email.ilike.%${adminSearchTerm}%`);
        }
        const { data, error, count } = await query;
        if (error) throw error;
        setAdminUsers(data || []);
        setHasMore(count > to + 1);
    } catch (error) { alert("Lỗi tìm kiếm: " + error.message); } finally { setAdminLoading(false); }
  };

  const handleUpdateRank = async (userId) => {
      if (!newRank) return;
      try {
          const { error } = await supabase.rpc('admin_update_user_rank', { p_user_id: userId, p_new_rank: newRank });
          if (error) throw error;
          alert("✅ Cập nhật Rank thành công!");
          setEditingUser(null);
          handleAdminSearch(page);
          fetchHelpers();
      } catch (error) { alert("Lỗi: " + error.message); }
  };

  // --- HELPER ACTIONS ---
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập!");
    const bounty = parseInt(formBounty);
    const currentPoints = profile?.event_points || 0;
    if (bounty <= 0) return alert("Số điểm phải lớn hơn 0");
    if (bounty > currentPoints) return alert(`Bạn không đủ điểm! (Có: ${currentPoints}, Cần: ${bounty})`);

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_help_request', { p_content: formContent, p_time_info: formTime, p_bounty: bounty });
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

  const handleRevoke = async (reqId) => {
    if (!confirm("Bạn muốn bỏ kèo này? Yêu cầu sẽ được mở lại cho người khác.")) return;
    try {
      const { error } = await supabase.rpc('helper_revoke_request', { p_request_id: reqId });
      if (error) throw error;
      alert("Đã hủy nhận kèo thành công!");
    } catch (err) { alert("Lỗi: " + err.message); }
  };

  const formatTime = (dateString) => {
      const date = new Date(dateString);
      return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-lg shadow-2xl animate-fade-in font-sans">
      
      {/* --- Hero Section (Giữ nguyên) --- */}
      <div className="text-center p-8 rounded-lg bg-black bg-opacity-20 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900 opacity-30 blur-3xl z-0"></div>
        <div className="relative z-10">
          <Icon name="ShieldCheck" size={64} className="text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Hệ thống server <span className="text-emerald-400">ARK Mobile Việt Nam</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Ra mắt hơn 1 năm bởi BennShop, sân chơi ổn định, công bằng và đầy sáng tạo.
          </p>
          <button onClick={() => window.open("https://zalo.me/g/nzqcdi654", "_blank")} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2">
            <Icon name="Rocket" size={22} /> <span>Tham Gia Ngay Hôm Nay!</span>
          </button>
        </div>
      </div>

      {/* --- Server Section (Giữ nguyên) --- */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3">
          <Icon name="Server" size={30} className="text-emerald-400" /><span>Hệ Thống Server</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Server Cards */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-blue-400">🏕️ VN_game</h3></div>
            <p className="text-gray-300 mb-2">Dành cho người chơi thích trải nghiệm ổn định, cày cuốc nhẹ nhàng.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-red-500 transition-all duration-300">
            <div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-red-400">⚔️ VN_toichoi</h3></div>
            <p className="text-gray-300 mb-2">Dành cho game thủ yêu thích PvP, chiến đấu sinh tồn khốc liệt.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-green-500">💖 VN_YenBinh</h3></div>
            <p className="text-gray-300 mb-2">Thế giới "Yên Bình" dành cho các chiến binh hệ cute!</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-yellow-400">⭐ Cổ Đông</h3></div>
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
             <UserGroupIcon className="w-7 h-7" /> <span>Admin: Quản Lý Người Dùng & Rank</span>
          </div>
          <div className="p-6 bg-gray-800">
             <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                   <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input type="text" placeholder="Nhập tên..." className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none" value={adminSearchTerm} onChange={(e) => setAdminSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminSearch(1)} />
                </div>
                <button onClick={() => handleAdminSearch(1)} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-bold text-white">Tìm</button>
             </div>
             <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-sm">
                 <table className="w-full text-left text-sm min-w-[600px]">
                    <thead className="bg-gray-700 text-gray-300 uppercase font-bold">
                       <tr><th className="p-4">Người chơi</th><th className="p-4">Liên hệ</th><th className="p-4 text-center">Rank</th><th className="p-4 text-right">Sửa</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                       {adminUsers.length > 0 ? adminUsers.map(u => (
                              <tr key={u.id} className="hover:bg-gray-700/50">
                                 <td className="p-4"><div className="font-bold text-white">{u.character_name}</div><div className="text-xs text-gray-500">{u.email}</div></td>
                                 <td className="p-4 text-gray-400">{u.zalo_contact}</td>
                                 <td className="p-4 text-center">
                                    {editingUser === u.id ? (
                                       <select className="bg-gray-900 border border-indigo-500 rounded px-2 py-1 text-white" value={newRank} onChange={(e) => setNewRank(e.target.value)}><option value="member">Member</option><option value="helper">Helper</option><option value="admin">Admin</option></select>
                                    ) : (
                                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.rank === 'admin' ? 'bg-red-900 text-red-300' : u.rank === 'helper' ? 'bg-indigo-900 text-indigo-300' : 'bg-gray-700 text-gray-400'}`}>{u.rank || 'member'}</span>
                                    )}
                                 </td>
                                 <td className="p-4 text-right">
                                    {editingUser === u.id ? (
                                       <div className="flex gap-2 justify-end"><button onClick={() => handleUpdateRank(u.id)} className="bg-green-600 p-2 rounded"><CheckIcon className="w-4 h-4 text-white" /></button><button onClick={() => setEditingUser(null)} className="bg-gray-600 p-2 rounded"><XMarkIcon className="w-4 h-4 text-white" /></button></div>
                                    ) : (
                                       <button onClick={() => { setEditingUser(u.id); setNewRank(u.rank || 'member'); }} className="text-indigo-400 p-2"><PencilSquareIcon className="w-5 h-5" /></button>
                                    )}
                                 </td>
                              </tr>
                           )) : <tr><td colSpan="4" className="p-8 text-center text-gray-500">Trống</td></tr>}
                    </tbody>
                 </table>
             </div>
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        
        <div className="relative bg-gray-900 p-4 sm:p-8 rounded-2xl border border-yellow-500/20 shadow-2xl overflow-hidden">
            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-3 flex items-center justify-center gap-3 uppercase tracking-wide">
                  <BriefcaseIcon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" /> Trung Tâm Hỗ Trợ
               </h2>
               <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-light">
                  Bạn cần người cày thuê, xây nhà, hay làm nhiệm vụ khó? <br/>
                  <span className="text-yellow-500 font-medium">Đăng yêu cầu ngay</span> để tìm <strong>Helper</strong> uy tín hỗ trợ bạn!
               </p>
            </div>

            <div className="text-center mb-12 flex justify-center">
               {user ? (
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-4 px-8 sm:px-10 rounded-full shadow-xl shadow-orange-600/20 transition-all transform hover:scale-105 active:scale-95 overflow-hidden"
                 >
                   {/* 🔥 CĂN CHỈNH HIỆU ỨNG GLOW 🔥 */}
                   <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                   <PlusCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
                   <span className="text-lg sm:text-xl relative z-10">Đăng Yêu Cầu Mới</span>
                 </button>
               ) : (
                 <div className="inline-block bg-red-900/20 border border-red-500/30 px-6 py-3 rounded-lg backdrop-blur-sm">
                    <p className="text-red-400 font-medium flex items-center gap-2 text-sm sm:text-base">
                        <Icon name="Info" size={20} /> Vui lòng đăng nhập để đăng yêu cầu hỗ trợ.
                    </p>
                 </div>
               )}
            </div>

            {/* 🔥 DANH SÁCH VINH DANH HELPER (MỚI) 🔥 */}
            {helpersList.length > 0 && (
              <div className="mb-12 bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-4 sm:p-6 rounded-2xl border border-yellow-500/20">
                <h3 className="text-center text-xl font-extrabold text-yellow-400 mb-6 flex items-center justify-center gap-2 uppercase tracking-widest">
                  <SparklesIcon className="w-6 h-6 text-yellow-200 animate-pulse" /> 
                   Biệt Đội Hỗ Trợ Uy Tín
                  <SparklesIcon className="w-6 h-6 text-yellow-200 animate-pulse" />
                </h3>
                
                {/* Scrollbar ngang cho mobile */}
                <div className="flex overflow-x-auto gap-4 pb-4 px-2 custom-scrollbar snap-x">
                  {helpersList.map((helper, index) => (
                    <div key={index} className="snap-center flex-shrink-0 w-44 sm:w-48 bg-gray-800 border border-yellow-600/30 rounded-xl p-4 flex flex-col items-center text-center shadow-lg relative group hover:-translate-y-1 transition-transform hover:shadow-yellow-500/20 hover:border-yellow-500">
                       {/* Avatar Helper */}
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
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {requests.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700">
                   <p className="text-gray-500 text-lg italic">Hiện chưa có yêu cầu nào.</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req.id} className={`group relative p-5 sm:p-6 rounded-xl border-l-4 bg-gray-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                     req.status === 'open' ? 'border-green-500' : 'border-blue-500'
                  }`}>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h4 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors line-clamp-1 flex items-center gap-2">
                              {req.profiles?.character_name}
                              {req.profiles?.rank === 'helper' && <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">HELPER</span>}
                              {req.profiles?.rank === 'admin' && <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">ADMIN</span>}
                           </h4>
                           <span className="text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-700 mt-1 inline-block">{req.profiles?.server}</span>
                        </div>
                        <div className="text-right">
                           <div className="font-extrabold text-yellow-400 text-xl sm:text-2xl">{req.bounty} <span className="text-xs text-gray-500 font-normal">điểm</span></div>
                           <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded inline-block mt-1 ${
                              req.status === 'open' ? 'bg-green-900/50 text-green-300' : 'bg-blue-900/50 text-blue-300'
                           }`}>
                              {req.status === 'open' ? 'Đang tìm' : 'Đang làm'}
                           </span>
                        </div>
                     </div>

                     <div className="space-y-3 mb-5 border-t border-gray-700 pt-4">
                        <p className="text-gray-300 text-sm line-clamp-2"><strong className="text-gray-500 uppercase text-xs block mb-1">Nội dung:</strong> {req.content}</p>
                        <p className="text-gray-300 text-sm"><strong className="text-gray-500 uppercase text-xs block mb-1">Thời gian:</strong> {req.time_info}</p>
                        {req.helper && (
                           <div className="mt-3 p-2 bg-blue-900/20 rounded border border-blue-500/30 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center"><UserGroupIcon className="w-4 h-4 text-blue-200"/></div>
                              <div><p className="text-[10px] text-blue-400 uppercase font-bold">Helper</p><p className="text-blue-200 text-sm font-bold">{req.helper.character_name}</p></div>
                           </div>
                        )}
                     </div>

                     <div className="mt-auto flex gap-2 justify-end">
                        {user && user.id !== req.user_id && req.status === 'open' && (profile?.rank === 'helper' || profile?.role === 'admin') && (
                           <button onClick={() => handleAccept(req.id)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg">Nhận Kèo Ngay</button>
                        )}
                        {user && user.id === req.helper?.id && req.status === 'accepted' && (
                           <button onClick={() => handleRevoke(req.id)} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg">Bỏ Kèo</button>
                        )}
                        {user && user.id === req.user_id && (
                           <>
                              {(req.status === 'open' || req.status === 'accepted') && <button onClick={() => handleCancel(req.id)} className="w-full bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white py-3 rounded-lg text-sm font-bold">Hủy Yêu Cầu</button>}
                              {req.status === 'accepted' && <button onClick={() => handleComplete(req.id)} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg text-sm font-bold animate-pulse">Xác Nhận Hoàn Thành</button>}
                           </>
                        )}
                     </div>
                  </div>
                ))
              )}
            </div>

            {/* 🔥 KHU VỰC LỊCH SỬ HOẠT ĐỘNG (Giữ nguyên) 🔥 */}
            {historyList.length > 0 && (
               <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
                     <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" /> 
                     Nhật Ký Hoạt Động (Đã xong / Hủy)
                  </h3>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                     {historyList.map(log => (
                        <div key={log.id} className="flex items-center justify-between bg-gray-900 p-3 rounded border border-gray-800 text-sm">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-gray-500 text-xs min-w-[80px] flex items-center gap-1">
                                 <ClockIcon className="w-3 h-3" />
                                 {formatTime(log.created_at)}
                              </span>
                              <div className="flex items-center gap-1">
                                 <span className="text-blue-300 font-bold">{log.profiles?.character_name}</span>
                                 <span className="text-gray-500">→</span>
                                 <span className="text-yellow-300 font-bold">{log.helper?.character_name || '---'}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 text-right">
                              <span className="text-gray-400 hidden sm:inline truncate max-w-[150px]">{log.content}</span>
                              {log.status === 'completed' ? (
                                 <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded text-xs font-bold border border-green-800">
                                    +{log.bounty}đ
                                 </span>
                              ) : (
                                 <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-xs font-bold border border-red-800">
                                    Đã Hủy
                                 </span>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

        </div>
      </div>

      {/* =========== SECTION SỰ KIỆN NỔI BẬT (Giữ nguyên) =========== */}
      {/* (Phần này bạn giữ nguyên code cũ nhé, mình không paste lại để tránh dài dòng) */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3">
          <Icon name="Megaphone" size={30} className="text-emerald-400" />
          <span>Sự Kiện Nổi Bật</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-emerald-500 hover:shadow-emerald-500/20 transition-all duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-emerald-400">🎄 Event Giáng Sinh</h3>
              <span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span>
            </div>
            <p className="text-gray-300 mb-4 flex-grow">Tham gia săn quà Giáng Sinh, thu thập vật phẩm hiếm và nhận thưởng độc quyền từ Admin. Đừng bỏ lỡ!</p>
            <div className="text-gray-400 text-sm border-t border-gray-700 pt-3"><Icon name="Calendar" className="inline-block mr-2" size={16} /><span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span></div>
          </div>
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

      {/* =========== SECTION KHOẢNH KHẮC SERVER (Giữ nguyên) =========== */}
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

      {/* --- Operator & Community Section (Giữ nguyên) --- */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center"><Icon name="Briefcase" className="text-emerald-400 mr-2" /><span>Người Vận Hành</span></h2>
          <div className="flex items-center mb-4"><Icon name="Crown" className="text-yellow-400 mr-3" size={24} /><span className="text-xl font-semibold">Nguyễn Minh Hoàng</span><span className="ml-3 text-sm bg-emerald-600 text-white px-3 py-0.5 rounded-full font-medium">Nhà sáng lập & Quản lý</span></div>
          <div className="flex items-center mb-4"><Icon name="Crown" className="text-yellow-400 mr-3" size={24} /><span className="text-xl font-semibold">Kim Tuyền</span><span className="ml-3 text-sm bg-emerald-600 text-white px-3 py-0.5 rounded-full font-medium">Nhà sáng lập & Quản lý</span></div>
          <p className="text-gray-300 mb-4">Luôn đồng hành cùng cộng đồng, hỗ trợ kỹ thuật, cập nhật và lắng nghe ý kiến từ người chơi để mang đến trải nghiệm tốt nhất.</p>
          <div className="flex items-center text-lg bg-gray-900 p-3 rounded-lg"><Icon name="Phone" className="text-emerald-400 mr-3" /><strong>Liên hệ Zalo:</strong><span className="ml-2 text-white font-mono bg-gray-700 px-3 py-1 rounded-md text-base">0842039811</span></div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center"><Icon name="Globe" className="text-emerald-400 mr-2" /><span>Cộng Đồng</span></h2>
          <div className="flex items-center text-3xl font-bold mb-4"><Icon name="Users" className="text-emerald-400 mr-3" size={32} />300+<span className="text-lg font-normal text-gray-300 ml-2">thành viên</span></div>
          <p className="text-gray-300 mb-3">Môi trường của chúng ta:</p>
          <ul className="space-y-2"><li className="flex items-center text-lg"><Icon name="CheckCircle" size={18} className="text-emerald-400 mr-2" /> Vui vẻ</li><li className="flex items-center text-lg"><Icon name="CheckCircle" size={18} className="text-emerald-400 mr-2" /> Công bằng</li><li className="flex items-center text-lg"><Icon name="CheckCircle" size={18} className="text-emerald-400 mr-2" /> Lâu dài</li></ul>
        </div>
      </div>

      {/* --- Footer CTA (Giữ nguyên) --- */}
      <div className="text-center border-t border-gray-700 pt-8">
        <p className="text-xl text-gray-300 mb-4">Thuần hóa khủng long, xây dựng căn cứ, liên minh cùng bạn bè – tất cả đang chờ bạn!</p>
        <div className="text-gray-400 text-2xl">
          <div className="mb-4"><Icon name="MessageSquare" className="inline-block mr-2" />Liên hệ: <strong>BennShop</strong></div>
          <div><button onClick={() => window.open("https://zalo.me/0842039811", "_blank")} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors duration-300 shadow-lg shadow-emerald-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2"><Icon name="Rocket" size={22} /><span>Zalo: 0842039811</span></button></div>
        </div>
      </div>

      {/* --- MODAL ĐĂNG YÊU CẦU (Giữ nguyên) --- */}
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
                    <label className="block text-sm text-gray-400 mb-1">Điểm thưởng (Event Points)</label>
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