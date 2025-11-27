// 📂 src/pages/EventPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient'; 
import confetti from 'canvas-confetti';

export const EventPage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); 
  const [selectedNumber, setSelectedNumber] = useState('');
  const [myPick, setMyPick] = useState(null); 
  const [todayResult, setTodayResult] = useState(null); 
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // --- State cho Admin Management ---
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminUserList, setAdminUserList] = useState([]); 
  const [editingUserId, setEditingUserId] = useState(null); 
  const [newPointValue, setNewPointValue] = useState('');
  
  // 🔥 State mới cho Phân Trang
  const [page, setPage] = useState(1); // Trang hiện tại
  const ITEMS_PER_PAGE = 20; // Số người hiển thị mỗi trang (ít để load nhanh)
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu trang sau không

  // --- 1. Lấy dữ liệu khi vào trang ---
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(userProfile);

        const todayStr = new Date().toISOString().split('T')[0];
        const { data: pick } = await supabase
          .from('lottery_picks')
          .select('picked_number')
          .eq('user_id', user.id)
          .eq('play_date', todayStr)
          .maybeSingle();
        
        if (pick) setMyPick(pick.picked_number);
      }

      fetchLeaderboard();
      checkTodayResult();
    };

    fetchData();
  }, []);

  const fetchLeaderboard = async () => {
    const { data: leaders } = await supabase
      .from('profiles')
      .select('character_name, event_points, server')
      .order('event_points', { ascending: false })
      .limit(10);
    setLeaderboard(leaders || []);
  };

  const checkTodayResult = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: results } = await supabase
      .from('lottery_results')
      .select('*')
      .eq('play_date', todayStr)
      .maybeSingle();
    if (results) setTodayResult(results);
  };

  const handleBuyTicket = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tham gia!");
      return;
    }
    if (selectedNumber === '' || selectedNumber < 0 || selectedNumber > 99) {
      alert("Vui lòng chọn số từ 00 đến 99");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.rpc('buy_lottery_ticket', {
        p_number: parseInt(selectedNumber)
      });

      if (error) throw error;

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setMyPick(parseInt(selectedNumber));
      setMessage({ type: 'success', text: '🎟️ Đã chốt số thành công! Chờ kết quả nhé.' });

    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRunLottery = async () => {
    if (!window.confirm("⚠️ ADMIN ACTION: Bạn có chắc chắn muốn quay số ngay bây giờ không?")) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('run_lottery_daily');
      if (error) throw error;

      alert(`✅ Đã quay số thành công! Có ${data.winners_count} người trúng giải.`);
      setTodayResult({ winning_numbers: data.results, play_date: new Date() });
      fetchLeaderboard();

    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. Chức năng Admin Tìm Kiếm & Phân Trang ---
  // Hàm này được gọi khi bấm nút Tìm hoặc chuyển trang
  const handleSearchUsers = async (pageNumber = 1) => {
    setLoading(true);
    setPage(pageNumber); // Cập nhật trang hiện tại

    try {
      // Tính toán phạm vi dòng cần lấy (Ví dụ: Trang 1 lấy dòng 0-19, Trang 2 lấy 20-39)
      const from = (pageNumber - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' }) // Lấy tổng số lượng để biết có trang sau không
        .order('event_points', { ascending: false })
        .range(from, to); // 🔥 CHỈ LẤY DỮ LIỆU CỦA TRANG HIỆN TẠI -> KHÔNG LAG

      if (adminSearchTerm.trim()) {
        query = query.or(`character_name.ilike.%${adminSearchTerm}%,email.ilike.%${adminSearchTerm}%,zalo_contact.ilike.%${adminSearchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      setAdminUserList(data || []);
      
      // Kiểm tra xem còn dữ liệu ở trang sau không
      // Nếu tổng số bản ghi > số bản ghi đã lấy đến hiện tại -> Còn trang sau
      setHasMore(count > to + 1);

    } catch (error) {
      alert("Lỗi tải danh sách: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePoints = async (userId) => {
    if (newPointValue === '') return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ event_points: parseInt(newPointValue) })
        .eq('id', userId);

      if (error) throw error;
      alert("✅ Đã cập nhật điểm thành công!");
      setEditingUserId(null);
      
      // Load lại đúng trang hiện tại
      handleSearchUsers(page); 
      fetchLeaderboard();

    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-lg shadow-2xl animate-fade-in font-sans min-h-screen">
      
      {/* 🛠️ ADMIN PANEL */}
      {profile?.role === 'admin' && (
        <div className="mb-12 border-2 border-red-600 rounded-xl overflow-hidden bg-gray-800 shadow-2xl">
          <div className="bg-red-700 p-3 text-white font-bold text-center uppercase tracking-wider flex items-center justify-center gap-2">
             👑 Admin Control Panel
          </div>
          
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Quay số */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <div>
                <h3 className="text-red-400 font-bold text-lg">🎲 Quay Số Hàng Ngày</h3>
                <p className="text-sm text-gray-400">Bấm nút lúc 17:30. Hệ thống sẽ tự random và cộng điểm.</p>
              </div>
              <button 
                onClick={handleAdminRunLottery}
                disabled={loading || todayResult}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold shadow-lg whitespace-nowrap ${
                  todayResult 
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                {todayResult ? 'Hôm nay đã quay' : 'Chạy Quay Số'}
              </button>
            </div>

            {/* Quản lý điểm */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
              <h3 className="text-yellow-400 font-bold text-lg mb-4 flex items-center gap-2">
                🔍 Quản Lý & Soi Gian Lận
              </h3>
              
              {/* Thanh tìm kiếm */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="Nhập tên, Zalo, Email... (Để trống = Xem Tất Cả)" 
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers(1)} // Tìm kiếm reset về trang 1
                  className="flex-1 bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                />
                <button 
                  onClick={() => handleSearchUsers(1)} // Bấm tìm thì về trang 1
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap"
                >
                  {adminSearchTerm ? 'Tìm Kiếm' : 'Xem Danh Sách'}
                </button>
              </div>

              {/* Danh sách User */}
              <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
                <div className="grid grid-cols-12 bg-gray-700 p-3 text-xs sm:text-sm font-bold text-gray-300 uppercase">
                  <div className="col-span-5 sm:col-span-4">Người chơi</div>
                  <div className="col-span-4 sm:col-span-5 hidden sm:block">Liên hệ</div>
                  <div className="col-span-3 sm:col-span-2 text-center">Điểm</div>
                  <div className="col-span-4 sm:col-span-1 text-right">Sửa</div>
                </div>

                {/* Body Bảng */}
                <div>
                  {adminUserList.length > 0 ? (
                    adminUserList.map((u, idx) => (
                      <div key={u.id} className={`grid grid-cols-12 p-3 border-b border-gray-700 items-center hover:bg-gray-700/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'
                      }`}>
                        {/* Cột 1 */}
                        <div className="col-span-5 sm:col-span-4 pr-2">
                          <div className="font-bold text-white truncate text-sm sm:text-base">
                            {/* Tính số thứ tự chính xác dựa trên trang: (Page-1)*20 + idx + 1 */}
                            {((page - 1) * ITEMS_PER_PAGE) + idx + 1}. {u.character_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate sm:hidden">{u.email}</div>
                          <div className="text-[10px] text-gray-400 uppercase mt-1 px-1 bg-gray-700 inline-block rounded">
                            {u.server}
                          </div>
                        </div>

                        {/* Cột 2 */}
                        <div className="col-span-4 sm:col-span-5 hidden sm:block text-xs text-gray-400">
                          <div className="truncate">📧 {u.email}</div>
                          <div className="truncate">📱 {u.zalo_contact}</div>
                        </div>

                        {/* Cột 3 */}
                        <div className="col-span-3 sm:col-span-2 text-center">
                          {editingUserId === u.id ? (
                            <input 
                              type="number" 
                              autoFocus
                              value={newPointValue}
                              onChange={(e) => setNewPointValue(e.target.value)}
                              className="w-full bg-gray-900 text-center border border-yellow-500 rounded p-1 text-white font-bold"
                            />
                          ) : (
                            <span className={`font-bold text-lg ${u.event_points > 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                              {u.event_points}
                            </span>
                          )}
                        </div>

                        {/* Cột 4 */}
                        <div className="col-span-4 sm:col-span-1 text-right pl-2">
                          {editingUserId === u.id ? (
                            <div className="flex flex-col gap-1">
                              <button 
                                onClick={() => handleUpdatePoints(u.id)}
                                className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs"
                              >
                                Lưu
                              </button>
                              <button 
                                onClick={() => setEditingUserId(null)}
                                className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setEditingUserId(u.id);
                                setNewPointValue(u.event_points);
                              }}
                              className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded text-xs font-bold"
                            >
                              Sửa
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 italic">
                      {adminSearchTerm ? 'Không tìm thấy ai.' : 'Bấm "Xem Danh Sách" để tải dữ liệu.'}
                    </div>
                  )}
                </div>
              </div>

              {/* 🔥 THANH ĐIỀU HƯỚNG PHÂN TRANG (MỚI) 🔥 */}
              {adminUserList.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                  <button 
                    onClick={() => handleSearchUsers(page - 1)}
                    disabled={page === 1 || loading}
                    className={`px-4 py-2 rounded font-bold ${page === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                  >
                    ← Trước
                  </button>
                  
                  <span className="text-gray-300 font-bold">Trang {page}</span>
                  
                  <button 
                    onClick={() => handleSearchUsers(page + 1)}
                    disabled={!hasMore || loading}
                    className={`px-4 py-2 rounded font-bold ${!hasMore ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                  >
                    Sau →
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- PHẦN GIAO DIỆN USER (Giữ nguyên) --- */}
      <div className="text-center p-6 sm:p-8 rounded-lg bg-black bg-opacity-20 mb-8 sm:mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-900 opacity-30 blur-3xl z-0"></div>
        <div className="relative z-10">
          <div className="text-5xl sm:text-6xl mx-auto mb-4 animate-bounce" role="img" aria-label="Ticket">🎟️</div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 break-words leading-tight">
            🎉 SỰ KIỆN: <span className="text-yellow-400 block sm:inline">SỔ XỐ MỖI NGÀY</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto break-words px-2">
            💥 Thử vận may - Rinh quà cực chất! 💥
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-yellow-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-6 border-b border-gray-700 pb-2">
                🎯 Vòng Quay May Mắn
              </h2>
              {todayResult ? (
                <div className="bg-gray-900 p-4 sm:p-6 rounded text-center border border-gray-600">
                  <p className="text-gray-400 mb-4 uppercase tracking-wider text-sm sm:text-base">Kết quả xổ số hôm nay</p>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
                    {todayResult.winning_numbers.map((num, idx) => (
                      <span key={idx} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full font-bold text-base sm:text-lg shadow-md ${
                        myPick === num ? 'bg-green-500 text-white ring-4 ring-green-900 scale-110' : 'bg-gray-700 text-yellow-400'
                      }`}>
                        {num < 10 ? `0${num}` : num}
                      </span>
                    ))}
                  </div>
                  {myPick !== null ? (
                    <div className="text-base sm:text-lg border-t border-gray-700 pt-4 mt-4">
                      Bạn đã chọn số: <span className="font-bold text-3xl sm:text-4xl mx-2 text-white">{myPick < 10 ? `0${myPick}` : myPick}</span>
                      <div className="mt-2">
                        {todayResult.winning_numbers.includes(myPick) ? 
                          <span className="text-green-400 font-bold text-lg sm:text-xl animate-pulse block">🎉 CHÚC MỪNG! BẠN ĐÃ TRÚNG THƯỞNG 🎉</span> : 
                          <span className="text-gray-400 block">Rất tiếc, chúc bạn may mắn lần sau!</span>
                        }
                      </div>
                    </div>
                  ) : (
                     <p className="text-gray-500 italic">Hôm nay bạn không tham gia chọn số.</p>
                  )}
                </div>
              ) : (
                <>
                  {myPick !== null ? (
                    <div className="bg-emerald-900/20 border border-emerald-500/50 p-6 sm:p-8 rounded text-center">
                      <p className="text-lg sm:text-xl text-gray-300">Bạn đã chốt con số:</p>
                      <div className="text-6xl sm:text-8xl font-extrabold text-emerald-400 my-4 sm:my-6 drop-shadow-lg">
                        {myPick < 10 ? `0${myPick}` : myPick}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 bg-gray-900/50 inline-block px-4 py-2 rounded-full">
                        ⏳ Kết quả có lúc 17:30
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center py-4">
                      <input
                        type="number"
                        value={selectedNumber}
                        onChange={(e) => setSelectedNumber(e.target.value)}
                        placeholder="Số (00-99)"
                        className="w-full sm:w-64 text-center text-3xl p-4 bg-gray-900 border-2 border-gray-600 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all"
                      />
                      <button
                        onClick={handleBuyTicket}
                        disabled={loading}
                        className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                          loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white'
                        }`}
                      >
                        {loading ? 'Đang xử lý...' : 'CHỐT SỐ NGAY 🍀'}
                      </button>
                    </div>
                  )}
                  {message && (
                    <div className={`mt-6 p-4 rounded-lg text-center font-medium ${message.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/50 text-green-200 border border-green-800'}`}>
                      {message.text}
                    </div>
                  )}
                </>
              )}
           </div>

           <div className="grid md:grid-cols-2 gap-6 mb-12 text-sm sm:text-base">
            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 flex items-center border-b border-gray-600 pb-2">
                🕒 Thời Gian & Thể Lệ
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex justify-between items-center">
                   <span>Mở chọn số:</span>
                   <span className="font-bold text-white bg-gray-700 px-2 py-1 rounded text-xs sm:text-sm">07:00 - 17:00</span>
                </li>
                <li className="flex justify-between items-center">
                   <span>Quay thưởng:</span>
                   <span className="font-bold text-yellow-400 bg-gray-700 px-2 py-1 rounded text-xs sm:text-sm">17:30 hàng ngày</span>
                </li>
                <li className="pt-2 border-t border-gray-700 mt-2">
                   🎯 Hệ thống quay ngẫu nhiên <strong>15 số</strong>.<br/> 
                   👉 Trúng bất kỳ số nào = <strong className="text-emerald-400 text-base sm:text-lg">+1 Điểm</strong>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-3 flex items-center border-b border-gray-600 pb-2">
                📝 Lưu Ý Quan Trọng
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 font-bold">●</span>
                  <span>Mỗi tài khoản chỉ được chọn <strong>1 số duy nhất</strong>/ngày.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 font-bold">●</span>
                  <span>Kiểm tra kỹ số trước khi chốt, không thể thay đổi.</span>
                </li>
                <li className="flex items-start">
                   <span className="text-red-500 mr-2 font-bold">●</span>
                   <span>Sau <strong>17:00</strong> hệ thống tự động khóa.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cột Phải: Bảng Xếp Hạng */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 sticky top-4">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center justify-center uppercase tracking-widest border-b border-gray-600 pb-4">
              🏆 Bảng Vinh Danh
            </h2>
            {profile && (
              <div className="bg-blue-600/20 border border-blue-500 p-3 sm:p-4 rounded-lg mb-6 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3 min-w-0"> 
                   <div className="w-10 h-10 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white border-2 border-blue-300">
                      You
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-blue-300 uppercase font-bold tracking-wider">Hạng & Điểm</p>
                      <p className="font-bold text-white text-base sm:text-lg truncate">{profile.character_name}</p>
                   </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                   <div className="font-extrabold text-xl sm:text-2xl text-emerald-400 drop-shadow-md">
                      {profile.event_points || 0} đ
                   </div>
                </div>
              </div>
            )}
            <div className="space-y-3 max-h-[400px] sm:max-h-[450px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
              {leaderboard.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Chưa có dữ liệu xếp hạng</p>
              ) : (
                leaderboard.map((player, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-900/60 to-yellow-800/40 border border-yellow-600/50' : 
                    index === 1 ? 'bg-gray-700/60 border border-gray-500/50' : 
                    index === 2 ? 'bg-orange-900/40 border border-orange-700/50' : 'bg-gray-900/50 hover:bg-gray-800'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm shadow-sm ${
                        index === 0 ? 'bg-yellow-500 text-black ring-2 ring-yellow-300' : 
                        index === 1 ? 'bg-gray-400 text-black ring-2 ring-gray-200' : 
                        index === 2 ? 'bg-orange-600 text-white ring-2 ring-orange-400' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <p className={`font-bold text-sm truncate ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                           {player.character_name}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase truncate">{player.server}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-sm px-2 py-1 rounded flex-shrink-0 ml-2 ${index < 3 ? 'text-emerald-300 bg-emerald-900/40' : 'text-gray-400 bg-gray-800'}`}>
                      {player.event_points} đ
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 text-center pt-4 border-t border-gray-700">
              <button 
                onClick={() => window.open("https://docs.google.com/spreadsheets/d/1C0m4B6UTP_opTxz8EezOmtIK7LjRfCogyue32ibx94I/edit?usp=sharing", "_blank")}
                className="text-yellow-500 text-xs hover:underline hover:text-yellow-400 uppercase tracking-widest font-semibold"
              >
                Xem chi tiết file Google Sheet &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-yellow-400 break-words">
          <span>Bảng Phần Thưởng Tích Điểm</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-r from-emerald-700 to-green-800 p-6 rounded-lg shadow-lg border border-emerald-500 text-center transform sm:hover:scale-105 transition-transform duration-300">
                <p className="text-xl sm:text-2xl font-bold text-white">20 ĐIỂM</p>
                <p className="text-lg sm:text-xl text-gray-200 mt-1">🎁 1 VAULT bv 292 bv 🎁</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-700 to-orange-800 p-6 rounded-lg shadow-lg border border-yellow-500 text-center transform sm:hover:scale-105 transition-transform duration-300">
                <p className="text-xl sm:text-2xl font-bold text-white">30 ĐIỂM</p>
                <p className="text-lg sm:text-xl text-gray-200 mt-1">🎁 1 THÁNG FREE PASS AD 🎁</p>
            </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-3 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 mb-3">Mốc 1 Điểm</h3>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 2k amber</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 1 cuốc + 1 rìu (full chỉ số)</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 3k Nguyên liệu (tự chọn)</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = buff lv cho 1 con thú</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 3 cây turret 7m</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 3 cây hoa Plan X</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 1 tek gen + 100 element</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 1 tek tele + 100 element</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = 1 tek kibble + 100 element</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">1đ</span> = dịch vụ hỗ trợ liên quan đến đảo / 1 lần</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-3 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 mb-3">Mốc 2-3 Điểm</h3>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x100 cái X15</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x30 cái Vòng Vàng</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x30 Thuốc Phối Thú Ăn Thịt</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x40 Thuốc Phối Thú Ăn Cỏ</p>
            <div className="border-t border-gray-700 my-4"></div>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">3đ</span> = full giáp sắt max chỉ số</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-3 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 mb-3">Mốc 5-7 Điểm</h3>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">5đ</span> = 1 bv tự chọn</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">5đ</span> = 1 thú đột biến ramdon (lv 538 + 60lv)</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">5đ</span> = alpha raptor lv</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">5đ</span> = 1 bv tự chọn ( tek, tele, súng tek,…)</p>
            <div className="border-t border-gray-700 my-4"></div>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">6đ</span> = 1 thú đột biến tự chọn (lv 538 + 60lv)</p>
            <div className="border-t border-gray-700 my-4"></div>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">7đ</span> = 1 đảo bay</p>
          </div>
        </div>
      </div>
      
      <div className="text-center border-t border-gray-700 pt-8 pb-8">
        <p className="text-xl sm:text-2xl text-gray-300 mb-6 break-words px-2">
          🔥 Đừng bỏ lỡ sự giàu sang! Vận may đang chờ bạn lúc 20h! 🔥
        </p>
        <button 
          onClick={() => window.open("https://docs.google.com/spreadsheets/d/1C0m4B6UTP_opTxz8EezOmtIK7LjRfCogyue32ibx94I/edit?usp=sharing", "_blank")}
          className="bg-yellow-600 text-white py-3 px-8 rounded-lg font-bold text-base sm:text-lg hover:bg-yellow-500 transition-colors duration-300 shadow-lg shadow-yellow-600/30 transform hover:-translate-y-1 flex items-center justify-center mx-auto space-x-3 w-full sm:w-auto"
        >
          <span>Xem Bảng Điểm Tích Lũy Ngay!</span>
        </button>
      </div>

    </div>
  );
};