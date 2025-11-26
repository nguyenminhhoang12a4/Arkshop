// 📂 src/pages/EventPage.jsx
import React, { useState, useEffect } from 'react';
// 👇 Đã chỉnh lại đường dẫn theo đúng cấu trúc thư mục bạn gửi
import { supabase } from '../services/supabaseClient'; 
import confetti from 'canvas-confetti';

export const EventPage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Để check quyền admin
  const [selectedNumber, setSelectedNumber] = useState('');
  const [myPick, setMyPick] = useState(null); // Số user đã chọn hôm nay
  const [todayResult, setTodayResult] = useState(null); // Kết quả xổ số hôm nay
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Thông báo

  // --- 1. Lấy dữ liệu khi vào trang ---
  useEffect(() => {
    const fetchData = async () => {
      // 1.1 Lấy User & Profile
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*') // Lấy role để check admin & event_points
          .eq('id', user.id)
          .single();
        setProfile(userProfile);

        // 1.2 Kiểm tra xem hôm nay user đã mua vé chưa
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: pick } = await supabase
          .from('lottery_picks')
          .select('picked_number')
          .eq('user_id', user.id)
          .eq('play_date', todayStr)
          .maybeSingle();
        
        if (pick) setMyPick(pick.picked_number);
      }

      // 1.3 Lấy Bảng xếp hạng (Top 10 người nhiều điểm nhất)
      const { data: leaders } = await supabase
        .from('profiles')
        .select('character_name, event_points, server')
        .order('event_points', { ascending: false })
        .limit(10);
      setLeaderboard(leaders || []);

      // 1.4 Lấy kết quả xổ số hôm nay (nếu đã quay)
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: results } = await supabase
        .from('lottery_results')
        .select('*')
        .eq('play_date', todayStr)
        .maybeSingle();
      if (results) setTodayResult(results);
    };

    fetchData();
  }, []);

  // --- 2. Hàm User Mua Vé ---
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
      // Gọi hàm RPC trong Database
      const { error } = await supabase.rpc('buy_lottery_ticket', {
        p_number: parseInt(selectedNumber)
      });

      if (error) throw error;

      // Thành công
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setMyPick(parseInt(selectedNumber));
      setMessage({ type: 'success', text: '🎟️ Đã chốt số thành công! Chờ kết quả nhé.' });

    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Có lỗi xảy ra' });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Hàm Admin Quay Số (Chạy lúc 17h30) ---
  const handleAdminRunLottery = async () => {
    if (!window.confirm("⚠️ ADMIN ACTION: Bạn có chắc chắn muốn quay số ngay bây giờ không?")) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('run_lottery_daily');
      if (error) throw error;

      alert(`✅ Đã quay số thành công! Có ${data.winners_count} người trúng giải.`);
      
      // Cập nhật ngay kết quả lên màn hình
      setTodayResult({ winning_numbers: data.results, play_date: new Date() });
      
      // Refresh lại bảng xếp hạng
      const { data: leaders } = await supabase
        .from('profiles')
        .select('character_name, event_points, server')
        .order('event_points', { ascending: false })
        .limit(10);
      setLeaderboard(leaders || []);

    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-8 rounded-lg shadow-2xl animate-fade-in font-sans min-h-screen">
      
      {/* ========================================================== */}
      {/* 🛠️ ADMIN PANEL (Chỉ hiện nếu là Admin) */}
      {/* ========================================================== */}
      {profile?.role === 'admin' && (
        <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-red-400 font-bold uppercase text-lg">👑 Khu vực quản trị viên</h3>
            <p className="text-sm text-gray-300">Bấm nút bên cạnh vào lúc 17:30 để quay số.</p>
          </div>
          <button 
            onClick={handleAdminRunLottery}
            disabled={loading || todayResult} // Disable nếu đang chạy hoặc đã có kết quả hôm nay
            className={`w-full sm:w-auto px-6 py-3 rounded font-bold shadow-lg whitespace-nowrap ${
              todayResult 
                ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {todayResult ? 'Hôm nay đã quay' : '🎲 QUAY SỐ NGAY'}
          </button>
        </div>
      )}

      {/* --- Header Section --- */}
      <div className="text-center p-6 sm:p-8 rounded-lg bg-black bg-opacity-20 mb-8 sm:mb-12 relative overflow-hidden">
        {/* Hiệu ứng nền mờ */}
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
        {/* --- CỘT TRÁI: KHU VỰC CHƠI GAME --- */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* === KHUNG CHỌN SỐ === */}
           <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-yellow-500/30">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-6 border-b border-gray-700 pb-2">
                🎯 Vòng Quay May Mắn
              </h2>

              {/* TRƯỜNG HỢP 1: Đã có kết quả xổ số (Sau 17h30 và Admin đã quay) */}
              {todayResult ? (
                <div className="bg-gray-900 p-4 sm:p-6 rounded text-center border border-gray-600">
                  <p className="text-gray-400 mb-4 uppercase tracking-wider text-sm sm:text-base">Kết quả xổ số hôm nay</p>
                  
                  {/* Hiển thị 15 số trúng thưởng */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
                    {todayResult.winning_numbers.map((num, idx) => (
                      <span key={idx} className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full font-bold text-base sm:text-lg shadow-md ${
                        myPick === num 
                          ? 'bg-green-500 text-white ring-4 ring-green-900 scale-110' // Nếu trúng thì nổi bật
                          : 'bg-gray-700 text-yellow-400'
                      }`}>
                        {num < 10 ? `0${num}` : num}
                      </span>
                    ))}
                  </div>

                  {/* Thông báo kết quả của user */}
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
                // TRƯỜNG HỢP 2: Chưa có kết quả (Đang cho phép chơi hoặc chờ Admin quay)
                <>
                  {myPick !== null ? (
                    // User đã chọn số rồi
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
                    // User chưa chọn số -> Hiện ô nhập
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
                          loading 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white'
                        }`}
                      >
                        {loading ? 'Đang xử lý...' : 'CHỐT SỐ NGAY 🍀'}
                      </button>
                    </div>
                  )}

                  {/* Thông báo lỗi/thành công */}
                  {message && (
                    <div className={`mt-6 p-4 rounded-lg text-center font-medium ${message.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/50 text-green-200 border border-green-800'}`}>
                      {message.text}
                    </div>
                  )}
                </>
              )}
           </div>

           {/* === TEXT QUY ĐỊNH & THƯỞNG === */}
           <div className="grid md:grid-cols-2 gap-6 mb-12 text-sm sm:text-base">
            
            {/* Cột 1: Thời gian & Thưởng */}
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

            {/* Cột 2: Lưu ý quan trọng */}
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

        {/* --- CỘT PHẢI: BẢNG XẾP HẠNG (Leaderboard) --- */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-700 sticky top-4">
            <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center justify-center uppercase tracking-widest border-b border-gray-600 pb-4">
              🏆 Bảng Vinh Danh
            </h2>

            {/* 🔥 PHẦN MỚI: ĐIỂM CỦA BẠN 🔥 */}
            {profile && (
              <div className="bg-blue-600/20 border border-blue-500 p-3 sm:p-4 rounded-lg mb-6 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3 min-w-0"> {/* min-w-0 để truncate hoạt động */}
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

            {/* 🔥 DANH SÁCH CUỘN (SCROLL) 🔥 */}
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
                        <p className={`font-bold text-sm truncate ${
                           index < 3 ? 'text-white' : 'text-gray-300'
                        }`}>
                           {player.character_name}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase truncate">{player.server}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-sm px-2 py-1 rounded flex-shrink-0 ml-2 ${
                       index < 3 ? 'text-emerald-300 bg-emerald-900/40' : 'text-gray-400 bg-gray-800'
                    }`}>
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

      {/* --- Section: Phần Thưởng --- */}
      <div className="mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-yellow-400 break-words">
          <span>Bảng Phần Thưởng Tích Điểm</span>
        </h2>

        {/* Phần thưởng đặc biệt */}
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

        {/* Danh sách phần thưởng */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cột 1 */}
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

          {/* Cột 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-3 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 mb-3">Mốc 2-3 Điểm</h3>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x100 cái X15</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x30 cái Vòng Vàng</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x30 Thuốc Phối Thú Ăn Thịt</p>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">2đ</span> = x40 Thuốc Phối Thú Ăn Cỏ</p>
            <div className="border-t border-gray-700 my-4"></div>
            <p className="text-sm sm:text-base"><span className="font-bold text-emerald-400">3đ</span> = full giáp sắt max chỉ số</p>
          </div>

          {/* Cột 3 */}
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
      
      {/* --- Footer CTA --- */}
      <div className="text-center border-t border-gray-700 pt-8 pb-8">
        <p className="text-xl sm:text-2xl text-gray-300 mb-6 break-words px-2">
          🔥 Đừng bỏ lỡ sự giàu sang! Vận may đang chờ bạn lúc 20h! 🔥
        </p>
        
      </div>

    </div>
  );
};