import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon'; 
import { supabase } from '../services/supabaseClient'; 
import { useAuth } from '../contexts/AuthContext'; 
import { 
  MagnifyingGlassIcon, PencilSquareIcon, CheckIcon, XMarkIcon, 
  UserGroupIcon, BriefcaseIcon, PlusCircleIcon, StarIcon, 
  SparklesIcon, ClockIcon, ClipboardDocumentListIcon, ArrowPathIcon,
  VideoCameraIcon, PlayIcon, 
  ChevronLeftIcon, ChevronRightIcon 
} from '@heroicons/react/24/solid';
import confetti from 'canvas-confetti'; 

// --- IMPORT CHO SLIDER ---
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// --- IMPORT HÌNH ẢNH ---
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

// Import video local
import VideoHD1 from '../assets/video/video1.mp4';

const sliderImages = [
  HinhTC1, HinhTC2, HinhTC3, HinhTC4, HinhTC5, HinhTC6, HinhTC7, HinhTC8, HinhTC9,
  HinhTC10, HinhTC11, HinhTC12, HinhTC13, HinhTC14, HinhTC15, HinhTC16, HinhTC17,
  HinhTC18, HinhTC19, HinhTC20, HinhTC21, HinhTC22, HinhTC23, HinhTC24, HinhTC25,
  HinhTC26, HinhTC27, HinhTC28, HinhTC29, HinhTC30, HinhTC31, HinhTC32, HinhTC33,
  HinhTC34, HinhTC35, HinhTC36, HinhTC37, HinhTC38, HinhTC39, HinhTC40, HinhTC41,
  HinhTC42, HinhTC43, HinhTC44, HinhTC45
];

// --- DANH SÁCH VIDEO HƯỚNG DẪN ---
const guideVideos = [
  { id: 1, title: "Hướng Dẫn Đăng Ký Và Đăng Nhập", src: VideoHD1, type: 'local' }, 
  { id: 2, title: "Cách Chơi Xổ Số", src: "https://www.youtube.com/embed/o7D--TFtii0", type: 'youtube' },
  { id: 3, title: "Cách Nạp Chuyển Đổi Thẻ", src: "https://www.youtube.com/embed/q8ZcNUVQwio", type: 'youtube' },
  { id: 4, title: "Cách Đăng Tin ", src: "https://www.youtube.com/embed/7Au9WUgfrWw", type: 'youtube' },
  { id: 5, title: "Mua Hàng", src: "https://www.youtube.com/embed/U7pa4x6s75s", type: 'youtube' },
];

// --- COMPONENT MŨI TÊN CUSTOM CHO VIDEO SLIDER ---
// Nút Next (Phải)
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div 
      className="absolute top-1/2 -right-2 sm:-right-4 z-10 -translate-y-1/2 cursor-pointer bg-gray-800/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg border border-gray-600 transition-all"
      onClick={onClick}
    >
      <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
  );
};

// Nút Prev (Trái)
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div 
      className="absolute top-1/2 -left-2 sm:-left-4 z-10 -translate-y-1/2 cursor-pointer bg-gray-800/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg border border-gray-600 transition-all"
      onClick={onClick}
    >
      <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
  );
};

export const HomePage = () => {
  const { user, profile } = useAuth(); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State cho Modal Video
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

  // State Form Request
  const [formContent, setFormContent] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formBounty, setFormBounty] = useState('');

  // Admin & Helper Lists
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); 
  const [newRank, setNewRank] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [hasMore, setHasMore] = useState(true);
  const [helpersList, setHelpersList] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  // --- SLIDER SETTINGS CHO IMAGE (Cũ - Giữ nguyên) ---
  const imageSliderSettings = {
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
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: "20px", centerMode: true } }]
  };

  // --- MỚI: SLIDER SETTINGS CHO VIDEO (ĐÃ CÓ MŨI TÊN ĐIỀU HƯỚNG) ---
  const videoSliderSettings = {
    dots: true,
    infinite: false, 
    speed: 500,
    slidesToShow: 3, // PC mặc định hiện 3
    slidesToScroll: 1,
    swipe: true,
    nextArrow: <NextArrow />, // Sử dụng mũi tên custom
    prevArrow: <PrevArrow />, // Sử dụng mũi tên custom
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 } // Tablet/Laptop nhỏ hiện 2
      },
      {
        breakpoint: 768, 
        settings: { 
            slidesToShow: 1, // Mobile: Hiện 1 video
            slidesToScroll: 1,
            arrows: true, // BẮT BUỘC BẬT MŨI TÊN TRÊN MOBILE
        } 
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

    const requestChannel = supabase
      .channel('public:help_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'help_requests' }, (payload) => {
          fetchRequests(); 
          fetchHistory();
      })
      .subscribe();
      
    const profileChannel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
          fetchHelpers();
      })
      .subscribe();

    return () => { 
        supabase.removeChannel(requestChannel); 
        supabase.removeChannel(profileChannel);
    };
  }, [profile]);

  // --- LOGIC XỬ LÝ MODAL VIDEO ---
  const openVideoModal = (index) => {
    setSelectedVideoIndex(index);
  };

  const closeVideoModal = () => {
    setSelectedVideoIndex(null);
  };

  const nextVideo = (e) => {
    e.stopPropagation();
    if (selectedVideoIndex !== null && selectedVideoIndex < guideVideos.length - 1) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    } else {
        setSelectedVideoIndex(0); 
    }
  };

  const prevVideo = (e) => {
    e.stopPropagation();
    if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    } else {
        setSelectedVideoIndex(guideVideos.length - 1);
    }
  };

  // --- FETCH DATA FUNCTIONS ---
  const fetchHelpers = async () => {
    const { data, error } = await supabase.from('profiles').select('character_name, server, event_points').eq('rank', 'helper').order('event_points', { ascending: false });
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
      .select(`*, profiles:user_id (character_name), helper:helper_id (character_name)`)
      .in('status', ['completed', 'cancelled'])
      .order('created_at', { ascending: false })
      .limit(30); 
    if (!error) setHistoryList(data || []);
  };

  // --- ADMIN & HELPER FUNCTIONS ---
  const handleAdminSearch = async (pageNumber = 1) => { 
    setAdminLoading(true); setPage(pageNumber);
    try {
        const from = (pageNumber - 1) * ITEMS_PER_PAGE; const to = from + ITEMS_PER_PAGE - 1;
        let query = supabase.from('profiles').select('*', { count: 'exact' }).order('rank', { ascending: true }).order('created_at', { ascending: false }).range(from, to);
        if (adminSearchTerm.trim()) query = query.or(`character_name.ilike.%${adminSearchTerm}%,zalo_contact.ilike.%${adminSearchTerm}%,email.ilike.%${adminSearchTerm}%`);
        const { data, count, error } = await query;
        if (error) throw error;
        setAdminUsers(data || []); setHasMore(count > to + 1);
    } catch (error) { alert("Lỗi tìm kiếm: " + error.message); } finally { setAdminLoading(false); }
  };
  const handleUpdateRank = async (userId) => { 
      if (!newRank) return;
      try { const { error } = await supabase.rpc('admin_update_user_rank', { p_user_id: userId, p_new_rank: newRank }); if (error) throw error; alert("✅ Cập nhật Rank thành công!"); setEditingUser(null); handleAdminSearch(page); fetchHelpers(); } catch (error) { alert("Lỗi: " + error.message); }
  };
  const handleSubmitRequest = async (e) => { 
    e.preventDefault(); if (!user) return alert("Vui lòng đăng nhập!"); const bounty = parseInt(formBounty); const currentPoints = profile?.event_points || 0; if (bounty <= 0) return alert("Số điểm phải lớn hơn 0"); if (bounty > currentPoints) return alert(`Bạn không đủ điểm!`); setActionLoading('submit'); try { const { data, error } = await supabase.rpc('create_help_request', { p_content: formContent, p_time_info: formTime, p_bounty: bounty }); if (error) throw error; setIsModalOpen(false); setFormContent(''); setFormTime(''); setFormBounty(''); alert(data.message); await fetchRequests(); } catch (err) { alert("Lỗi: " + err.message); } finally { setActionLoading(null); }
  };
  const handleAccept = async (reqId) => { if (actionLoading === reqId) return; if (!confirm("Bạn chắc chắn muốn nhận hỗ trợ?")) return; setActionLoading(reqId); try { const { error } = await supabase.rpc('accept_help_request', { p_request_id: reqId }); if (error) throw error; await fetchRequests(); alert("Đã nhận kèo thành công!"); } catch (err) { alert("Lỗi: " + err.message); } finally { setActionLoading(null); } };
  const handleComplete = async (reqId) => { if (actionLoading === reqId) return; if (!confirm("Xác nhận hoàn thành?")) return; setActionLoading(reqId); try { const { error } = await supabase.rpc('complete_help_request', { p_request_id: reqId }); if (error) throw error; confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); await fetchRequests(); await fetchHistory(); alert("Đã hoàn thành!"); } catch (err) { alert("Lỗi: " + err.message); } finally { setActionLoading(null); } };
  const handleCancel = async (reqId) => { if (actionLoading === reqId) return; if (!confirm("Hủy yêu cầu?")) return; setActionLoading(reqId); try { const { error } = await supabase.rpc('cancel_help_request', { p_request_id: reqId }); if (error) throw error; await fetchRequests(); await fetchHistory(); alert("Đã hủy!"); } catch (err) { alert("Lỗi: " + err.message); } finally { setActionLoading(null); } };
  const handleRevoke = async (reqId) => { if (actionLoading === reqId) return; if (!confirm("Bạn muốn bỏ kèo này?")) return; setActionLoading(reqId); try { const { error } = await supabase.rpc('helper_revoke_request', { p_request_id: reqId }); if (error) throw error; await fetchRequests(); alert("Đã hủy nhận kèo!"); } catch (err) { alert("Lỗi: " + err.message); } finally { setActionLoading(null); } };
  const formatTime = (dateString) => { const date = new Date(dateString); return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getDate()}/${date.getMonth() + 1}`; };

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-lg shadow-2xl animate-fade-in font-sans">
      
      {/* --- Hero & Server Section (Giữ nguyên) --- */}
      <div className="text-center p-8 rounded-lg bg-black bg-opacity-20 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900 opacity-30 blur-3xl z-0"></div>
        <div className="relative z-10">
          <Icon name="ShieldCheck" size={64} className="text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Hệ thống server <span className="text-emerald-400">ARK Mobile Việt Nam</span></h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-8">Ra mắt hơn 1 năm bởi BennShop, sân chơi ổn định, công bằng và đầy sáng tạo.</p>
          <button onClick={() => window.open("https://zalo.me/g/nzqcdi654", "_blank")} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-2">
            <Icon name="Rocket" size={22} /> <span>Tham Gia Ngay Hôm Nay!</span>
          </button>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3"><Icon name="Server" size={30} className="text-emerald-400" /><span>Hệ Thống Server</span></h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"><div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-blue-400">🏕️ VN_game</h3></div><p className="text-gray-300 mb-2">Dành cho người chơi thích trải nghiệm ổn định, cày cuốc nhẹ nhàng.</p></div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-red-500 transition-all duration-300"><div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-red-400">⚔️ VN_toichoi</h3></div><p className="text-gray-300 mb-2">Dành cho game thủ yêu thích PvP, chiến đấu sinh tồn khốc liệt.</p></div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300"><div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-green-500">💖 VN_YenBinh</h3></div><p className="text-gray-300 mb-2">Thế giới "Yên Bình" dành cho các chiến binh hệ cute!</p></div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300"><div className="flex items-center mb-3"><h3 className="text-2xl font-bold text-yellow-400">⭐ Cổ Đông</h3></div><p className="mb-2 text-xl text-yellow-400">Admin: TQK (VN_game)</p><p className="text-gray-400 text-sm">Kêu gọi nhà đầu tư xây dựng server!</p></div>
        </div>
      </div>

      {/* =========== 🎥 HƯỚNG DẪN TÂN THỦ (ĐÃ CHỈNH MOBILE + MŨI TÊN) =========== */}
      <div className="mb-16">
         <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            <VideoCameraIcon className="w-8 h-8 text-blue-400" />
            <span>Hướng Dẫn Tân Thủ</span>
         </h2>
         
         {/* SLIDER WRAPPER - Thêm px-8 để tạo khoảng trống cho mũi tên trên Mobile */}
         <div className="video-slider-wrapper px-6 sm:px-8">
             <Slider {...videoSliderSettings}>
                {guideVideos.map((video, index) => (
                    <div key={video.id} className="px-2 pb-4"> 
                        <div 
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 group hover:border-blue-500 transition-all cursor-pointer h-full relative"
                            onClick={() => openVideoModal(index)} 
                        >
                            <div className="relative w-full bg-black overflow-hidden" style={{ aspectRatio: '360/780' }}>
                                {video.type === 'local' ? (
                                    <video className="w-full h-full object-cover" src={video.src} muted />
                                ) : (
                                    <img 
                                        className="w-full h-full object-cover opacity-80"
                                        src={`https://img.youtube.com/vi/${video.src.split('/').pop()}/maxresdefault.jpg`} 
                                        alt={video.title}
                                        onError={(e) => {e.target.style.display = 'none'}} 
                                    />
                                )}
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                                        <PlayIcon className="w-8 h-8 text-white ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-800">
                                <h3 className="text-sm font-bold text-white line-clamp-2 min-h-[40px]">
                                    <span className="bg-blue-600 text-[10px] px-1.5 py-0.5 rounded text-white mr-2 align-middle">HD</span>
                                    {video.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
             </Slider>
         </div>
      </div>

      {/* =========== 📺 MODAL PHÁT VIDEO FULLSCREEN =========== */}
      {selectedVideoIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in" onClick={closeVideoModal}>
              <button 
                onClick={closeVideoModal}
                className="absolute top-4 right-4 z-[60] text-white/70 hover:text-white bg-black/50 hover:bg-red-600 p-2 rounded-full transition-all"
              >
                  <XMarkIcon className="w-8 h-8" />
              </button>

              <button 
                  onClick={prevVideo}
                  className="absolute left-2 sm:left-8 z-[60] text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                  <ChevronLeftIcon className="w-10 h-10 sm:w-16 sm:h-16" />
              </button>

              <div 
                className="relative w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] h-[80vh] bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800"
                onClick={(e) => e.stopPropagation()} 
              >
                  {guideVideos[selectedVideoIndex].type === 'local' ? (
                      <video 
                          className="w-full h-full object-contain" 
                          src={guideVideos[selectedVideoIndex].src} 
                          controls 
                          autoPlay 
                      />
                  ) : (
                      <iframe 
                          className="w-full h-full"
                          src={`${guideVideos[selectedVideoIndex].src}?autoplay=1&rel=0`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                      ></iframe>
                  )}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-10 text-center">
                      <h3 className="text-white font-bold text-lg">{guideVideos[selectedVideoIndex].title}</h3>
                      <p className="text-gray-400 text-sm">Video {selectedVideoIndex + 1} / {guideVideos.length}</p>
                  </div>
              </div>

              <button 
                  onClick={nextVideo}
                  className="absolute right-2 sm:right-8 z-[60] text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                  <ChevronRightIcon className="w-10 h-10 sm:w-16 sm:h-16" />
              </button>
          </div>
      )}

      {/* 👑 ADMIN PANEL (Giữ nguyên) */}
      {profile?.role === 'admin' && (
        <div className="mb-16 border border-indigo-500 rounded-xl bg-gray-900 overflow-hidden shadow-xl">
          <div className="bg-indigo-600 p-4 flex items-center gap-3 text-white font-bold text-xl"><UserGroupIcon className="w-7 h-7" /> <span>Admin: Quản Lý Người Dùng & Rank</span></div>
          <div className="p-6 bg-gray-800">
             <div className="flex gap-3 mb-6">
                <div className="relative flex-1"><MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Nhập tên..." className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none" value={adminSearchTerm} onChange={(e) => setAdminSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminSearch(1)} /></div>
                <button onClick={() => handleAdminSearch(1)} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-bold text-white">{adminLoading ? 'Đang tải...' : 'Tìm'}</button>
             </div>
             <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-sm">
                 <table className="w-full text-left text-sm min-w-[600px]"><thead className="bg-gray-700 text-gray-300 uppercase font-bold"><tr><th className="p-4">Người chơi</th><th className="p-4">Liên hệ</th><th className="p-4 text-center">Rank</th><th className="p-4 text-right">Sửa</th></tr></thead><tbody className="divide-y divide-gray-700 bg-gray-800">{adminUsers.length > 0 ? adminUsers.map(u => (<tr key={u.id} className="hover:bg-gray-700/50"><td className="p-4"><div className="font-bold text-white">{u.character_name}</div><div className="text-xs text-gray-500">{u.email}</div></td><td className="p-4 text-gray-400">{u.zalo_contact}</td><td className="p-4 text-center">{editingUser === u.id ? (<select className="bg-gray-900 border border-indigo-500 rounded px-2 py-1 text-white" value={newRank} onChange={(e) => setNewRank(e.target.value)}><option value="member">Member</option><option value="helper">Helper</option><option value="admin">Admin</option></select>) : (<span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${u.rank === 'admin' ? 'bg-red-900 text-red-300' : u.rank === 'helper' ? 'bg-indigo-900 text-indigo-300' : 'bg-gray-700 text-gray-400'}`}>{u.rank || 'member'}</span>)}</td><td className="p-4 text-right">{editingUser === u.id ? (<div className="flex gap-2 justify-end"><button onClick={() => handleUpdateRank(u.id)} className="bg-green-600 p-2 rounded"><CheckIcon className="w-4 h-4 text-white" /></button><button onClick={() => setEditingUser(null)} className="bg-gray-600 p-2 rounded"><XMarkIcon className="w-4 h-4 text-white" /></button></div>) : (<button onClick={() => { setEditingUser(u.id); setNewRank(u.rank || 'member'); }} className="text-indigo-400 p-2"><PencilSquareIcon className="w-5 h-5" /></button>)}</td></tr>)) : <tr><td colSpan="4" className="p-8 text-center text-gray-500">Trống</td></tr>}</tbody></table>
             </div>
             {adminUsers.length > 0 && (<div className="flex justify-center items-center gap-4 mt-4"><button onClick={() => handleAdminSearch(page - 1)} disabled={page === 1 || adminLoading} className={`px-4 py-2 rounded font-bold text-sm ${page === 1 ? 'bg-gray-700 text-gray-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>← Trước</button><span className="text-gray-300 font-bold text-sm">Trang {page}</span><button onClick={() => handleAdminSearch(page + 1)} disabled={!hasMore || adminLoading} className={`px-4 py-2 rounded font-bold text-sm ${!hasMore ? 'bg-gray-700 text-gray-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>Sau →</button></div>)}
          </div>
        </div>
      )}

      {/* =========== 🔥 TRUNG TÂM HỖ TRỢ 🔥 =========== */}
      <div className="mb-16 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative bg-gray-900 p-4 sm:p-8 rounded-2xl border border-yellow-500/20 shadow-2xl overflow-hidden">
            <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-3 flex items-center justify-center gap-3 uppercase tracking-wide"><BriefcaseIcon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" /> Trung Tâm Hỗ Trợ</h2><p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-light">Bạn cần người cày thuê, xây nhà, hay làm nhiệm vụ khó? <br/><span className="text-yellow-500 font-medium">Đăng yêu cầu ngay</span> để tìm <strong>Helper</strong> uy tín hỗ trợ bạn!</p></div>
            <div className="text-center mb-12 flex justify-center">{user ? (<button onClick={() => setIsModalOpen(true)} className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-4 px-8 sm:px-10 rounded-full shadow-xl shadow-orange-600/20 transition-all transform hover:scale-105 active:scale-95 overflow-hidden"><span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span><PlusCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" /><span className="text-lg sm:text-xl relative z-10">Đăng Yêu Cầu Mới</span></button>) : (<div className="inline-block bg-red-900/20 border border-red-500/30 px-6 py-3 rounded-lg backdrop-blur-sm"><p className="text-red-400 font-medium flex items-center gap-2 text-sm sm:text-base"><Icon name="Info" size={20} /> Vui lòng đăng nhập để đăng yêu cầu hỗ trợ.</p></div>)}</div>
            {helpersList.length > 0 && (<div className="mb-12 bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-4 sm:p-6 rounded-2xl border border-yellow-500/20"><h3 className="text-center text-xl font-extrabold text-yellow-400 mb-6 flex items-center justify-center gap-2 uppercase tracking-widest"><SparklesIcon className="w-6 h-6 text-yellow-200 animate-pulse" /> Biệt Đội Hỗ Trợ Uy Tín <SparklesIcon className="w-6 h-6 text-yellow-200 animate-pulse" /></h3><div className="flex overflow-x-auto gap-4 pb-4 px-2 custom-scrollbar snap-x">{helpersList.map((helper, index) => (<div key={index} className="snap-center flex-shrink-0 w-44 sm:w-48 bg-gray-800 border border-yellow-600/30 rounded-xl p-4 flex flex-col items-center text-center shadow-lg relative group hover:-translate-y-1 transition-transform hover:shadow-yellow-500/20 hover:border-yellow-500"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 p-0.5 mb-3 shadow-md relative"><div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center"><UserGroupIcon className="w-7 h-7 text-yellow-400" /></div><div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-gray-900 shadow-sm">TOP</div></div><h4 className="font-bold text-white text-sm truncate w-full mb-1">{helper.character_name}</h4><p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide bg-gray-900 px-2 py-0.5 rounded">{helper.server}</p><div className="mt-auto w-full pt-2 border-t border-gray-700/50"><div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-xs"><StarIcon className="w-3 h-3" /> {helper.event_points} <span className="font-normal text-gray-500">uy tín</span></div></div></div>))}</div></div>)}
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">{requests.length === 0 ? (<div className="col-span-full text-center py-16 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700"><p className="text-gray-500 text-lg italic">Hiện chưa có yêu cầu nào.</p></div>) : (requests.map(req => (<div key={req.id} className={`group relative p-5 sm:p-6 rounded-xl border-l-4 bg-gray-800 shadow-lg transition-all ${req.status === 'open' ? 'border-green-500' : 'border-blue-500'}`}><div className="flex justify-between items-start mb-4"><div><h4 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors line-clamp-1 flex items-center gap-2">{req.profiles?.character_name}{req.profiles?.rank === 'helper' && <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">HELPER</span>}{req.profiles?.rank === 'admin' && <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-bold">ADMIN</span>}</h4><span className="text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded border border-gray-700 mt-1 inline-block">{req.profiles?.server}</span></div><div className="text-right"><div className="font-extrabold text-yellow-400 text-xl sm:text-2xl">{req.bounty} <span className="text-xs text-gray-500 font-normal">điểm</span></div><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded inline-block mt-1 ${req.status === 'open' ? 'bg-green-900/50 text-green-300' : 'bg-blue-900/50 text-blue-300'}`}>{req.status === 'open' ? 'Đang tìm' : 'Đang làm'}</span></div></div><div className="space-y-3 mb-5 border-t border-gray-700 pt-4"><p className="text-gray-300 text-sm line-clamp-2"><strong className="text-gray-500 uppercase text-xs block mb-1">Nội dung:</strong> {req.content}</p><p className="text-gray-300 text-sm"><strong className="text-gray-500 uppercase text-xs block mb-1">Thời gian:</strong> {req.time_info}</p>{req.helper && (<div className="mt-3 p-2 bg-blue-900/20 rounded border border-blue-500/30 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center"><UserGroupIcon className="w-4 h-4 text-blue-200"/></div><div><p className="text-[10px] text-blue-400 uppercase font-bold">Helper</p><p className="text-blue-200 text-sm font-bold">{req.helper.character_name}</p></div></div>)}</div><div className="mt-auto flex gap-2 justify-end">{user && user.id !== req.user_id && req.status === 'open' && (profile?.rank === 'helper' || profile?.role === 'admin') && (<button onClick={() => handleAccept(req.id)} disabled={actionLoading === req.id} className={`w-full text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${actionLoading === req.id ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}>{actionLoading === req.id ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Đang nhận...</> : 'Nhận Kèo Ngay'}</button>)}{user && user.id === req.helper?.id && req.status === 'accepted' && (<button onClick={() => handleRevoke(req.id)} disabled={actionLoading === req.id} className={`w-full text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${actionLoading === req.id ? 'bg-gray-600 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500'}`}>{actionLoading === req.id ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Đang hủy...</> : 'Bỏ Kèo'}</button>)}{user && user.id === req.user_id && (<>{(req.status === 'open' || req.status === 'accepted') && (<button onClick={() => handleCancel(req.id)} disabled={actionLoading === req.id} className={`w-full text-white py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${actionLoading === req.id ? 'bg-gray-600' : 'bg-gray-700 hover:bg-red-600'}`}>{actionLoading === req.id ? 'Đang hủy...' : 'Hủy Yêu Cầu'}</button>)}{req.status === 'accepted' && (<button onClick={() => handleComplete(req.id)} disabled={actionLoading === req.id} className={`w-full text-white py-3 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${actionLoading === req.id ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 animate-pulse'}`}>{actionLoading === req.id ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Đang xử lý...</> : 'Xác Nhận Hoàn Thành'}</button>)}</>)}</div></div>)))}</div>
            {historyList.length > 0 && (<div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"><h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2"><ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" /> Nhật Ký Hoạt Động (Đã xong / Hủy)</h3><div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 space-y-2">{historyList.map(log => (<div key={log.id} className="flex items-center justify-between bg-gray-900 p-3 rounded border border-gray-800 text-sm"><div className="flex flex-col sm:flex-row sm:items-center gap-2"><span className="text-gray-500 text-xs min-w-[80px] flex items-center gap-1"><ClockIcon className="w-3 h-3" />{formatTime(log.created_at)}</span><div className="flex items-center gap-1"><span className="text-blue-300 font-bold">{log.profiles?.character_name}</span><span className="text-gray-500">→</span><span className="text-yellow-300 font-bold">{log.helper?.character_name || '---'}</span></div></div><div className="flex items-center gap-3 text-right"><span className="text-gray-400 hidden sm:inline truncate max-w-[150px]">{log.content}</span>{log.status === 'completed' ? <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded text-xs font-bold border border-green-800">+{log.bounty}đ</span> : <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-xs font-bold border border-red-800">Đã Hủy</span>}</div></div>))}</div></div>)}
        </div>
      </div>
      
      {/* Sự kiện & Slider Hình Ảnh (Giữ nguyên) */}
      <div className="mb-12"><h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3"><Icon name="Megaphone" size={30} className="text-emerald-400" /><span>Sự Kiện Nổi Bật</span></h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"><div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-emerald-500 transition-all flex flex-col"><div className="flex justify-between items-center mb-3"><h3 className="text-2xl font-bold text-emerald-400">🎄 Event Giáng Sinh</h3><span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span></div><p className="text-gray-300 mb-4 flex-grow">Tham gia săn quà Giáng Sinh, thu thập vật phẩm hiếm...</p><div className="text-gray-400 text-sm border-t border-gray-700 pt-3"><Icon name="Calendar" className="inline-block mr-2" size={16} />Đã kết thúc</div></div><div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-yellow-500 transition-all flex flex-col"><div className="flex justify-between items-center mb-3"><h3 className="text-2xl font-bold text-yellow-400">🏁 Đua Thú Tốc Độ</h3><span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span></div><p className="text-gray-300 mb-4 flex-grow">Giải đua lớn nhất server! Chuẩn bị những con thú tốc độ nhất...</p><div className="text-gray-400 text-sm border-t border-gray-700 pt-3"><Icon name="Calendar" className="inline-block mr-2" size={16} />Đã kết thúc</div></div><div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 opacity-70 flex flex-col"><div className="flex justify-between items-center mb-3"><h3 className="text-2xl font-bold text-gray-500">🎃 Săn Bí Ngô</h3><span className="text-xs bg-gray-600 text-white px-3 py-1 rounded-full font-medium">Đã kết thúc</span></div><p className="text-gray-400 mb-4 flex-grow">Sự kiện Halloween đã qua. Cảm ơn các bạn đã tham gia...</p><div className="text-gray-400 text-sm border-t border-gray-700 pt-3"><Icon name="Calendar" className="inline-block mr-2" size={16} />25/10 - 31/10</div></div></div></div>
      <div className="mb-12"><h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center space-x-3"><span className="text-3xl">📸</span><span>Khoảnh Khắc Server</span></h2><div className="slider-wrapper"><Slider {...imageSliderSettings}>{sliderImages.map((imgSrc, index) => (<div key={index} className="px-2"><img src={imgSrc} alt={`Hình ảnh ${index + 1}`} className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-700"/></div>))}</Slider></div></div>

      {/* Footer */}
      <div className="text-center border-t border-gray-700 pt-8"><p className="text-xl text-gray-300 mb-4">Thuần hóa khủng long, xây dựng căn cứ, liên minh cùng bạn bè – tất cả đang chờ bạn!</p><div className="text-gray-400 text-2xl"><div className="mb-4"><Icon name="MessageSquare" className="inline-block mr-2" />Liên hệ: <strong>BennShop</strong></div><div><button onClick={() => window.open("https://zalo.me/0842039811", "_blank")} className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg flex items-center justify-center mx-auto space-x-2"><Icon name="Rocket" size={22} /><span>Zalo: 0842039811</span></button></div></div></div>

      {/* Modal Đăng Yêu Cầu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
           <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-600" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Đăng Yêu Cầu Hỗ Trợ</h3>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                 <div><label className="block text-sm text-gray-400 mb-1">Nội dung cần hỗ trợ</label><textarea className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-yellow-500 outline-none" rows="3" placeholder="VD: Cần hỗ trợ tame Giga, xây nhà..." value={formContent} onChange={e => setFormContent(e.target.value)} required /></div>
                 <div><label className="block text-sm text-gray-400 mb-1">Thời gian cụ thể</label><input type="text" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-yellow-500 outline-none" placeholder="VD: 19h tối nay" value={formTime} onChange={e => setFormTime(e.target.value)} required /></div>
                 <div><label className="block text-sm text-gray-400 mb-1">Điểm thưởng (Event Points)</label><p className="text-xs text-emerald-400 mb-2">(Bạn đang có: {profile?.event_points || 0} EP)</p><input type="number" className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-yellow-400 font-bold focus:border-yellow-500 outline-none" placeholder="VD: 50" value={formBounty} onChange={e => setFormBounty(e.target.value)} required /></div>
                 <div className="flex gap-3 mt-6"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white font-bold">Hủy</button><button type="submit" disabled={actionLoading === 'submit'} className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-white font-bold flex justify-center items-center gap-2">{actionLoading === 'submit' ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Đang xử lý...</> : 'Đăng Ngay'}</button></div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};