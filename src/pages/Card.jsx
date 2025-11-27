import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { 
    BanknotesIcon, ClockIcon, CreditCardIcon, 
    CalculatorIcon, ClipboardDocumentIcon, PlusCircleIcon, TrashIcon,
    CheckCircleIcon, XCircleIcon, ArrowPathIcon, UserGroupIcon, MagnifyingGlassIcon,
    CurrencyDollarIcon, QrCodeIcon, XMarkIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/solid';

// --- HÀM HELPER: Lấy mã ngân hàng chuẩn cho VietQR ---
const getBankId = (bankName) => {
    if (!bankName) return 'VCB';
    const name = bankName.toLowerCase();
    
    if (name.includes('vietcombank')) return 'VCB';
    if (name.includes('bidv')) return 'BIDV';
    if (name.includes('vietinbank')) return 'ICB';
    if (name.includes('agribank')) return 'VBA';
    if (name.includes('sacombank')) return 'STB';
    if (name.includes('techcombank')) return 'TCB';
    if (name.includes('mb')) return 'MB';
    if (name.includes('vpbank')) return 'VPB';
    if (name.includes('tpbank')) return 'TPB';
    if (name.includes('acb')) return 'ACB';
    if (name.includes('donga')) return 'DOB';
    if (name.includes('eximbank')) return 'EIB';
    if (name.includes('seabank')) return 'SEAB';
    if (name.includes('vib')) return 'VIB';
    if (name.includes('msb') || name.includes('maritime')) return 'MSB';
    if (name.includes('shb')) return 'SHB';
    if (name.includes('ocb')) return 'OCB';
    if (name.includes('hdbank')) return 'HDB';
    if (name.includes('nama')) return 'NAMABANK';
    if (name.includes('saigonbank')) return 'SGB';
    if (name.includes('vietbank')) return 'VIETBANK';
    if (name.includes('abbank')) return 'ABB';
    if (name.includes('kienlong')) return 'KLB';
    if (name.includes('bvbank') || name.includes('ban viet')) return 'BVB';
    if (name.includes('pvcom')) return 'PVCOMBANK';
    if (name.includes('ocean')) return 'OJB';
    if (name.includes('ncb')) return 'NCB';
    if (name.includes('shinhan')) return 'SHINHAN';
    if (name.includes('scb')) return 'SCB';
    if (name.includes('vieta') || name.includes('vab')) return 'VAB';
    if (name.includes('gpbank')) return 'GPB';
    if (name.includes('pgbank')) return 'PGB';
    if (name.includes('public')) return 'PBVN';
    if (name.includes('uob')) return 'UOB';
    if (name.includes('woori')) return 'WOORI';
    if (name.includes('cimb')) return 'CIMB';
    if (name.includes('cake')) return 'CAKE';
    if (name.includes('timo')) return 'TIMO';
    if (name.includes('tnex')) return 'TNEX';
    if (name.includes('lio')) return 'LIOBANK';
    if (name.includes('viettel')) return 'VTLMONEY';
    if (name.includes('vnpt')) return 'VNPTMONEY';
    
    if (name.includes('momo')) return 'MOMO'; 
    if (name.includes('zalopay')) return 'ZALOPAY';

    return 'VCB'; 
};

// Danh sách ngân hàng & Ví điện tử
const BANK_LIST = [
    "Ngân hàng Vietcombank", "Ngân hàng BIDV", "Ngân hàng VIETINBANK", "Ngân hàng AGRIBANK",
    "Ngân hàng SACOMBANK", "Ngân hàng TECHCOMBANK", "Ngân hàng MBBANK", "Ngân hàng VPBANK",
    "Ngân hàng TPBANK", "Ngân hàng ACB", "Ngân hàng DONGABANK", "Ngân hàng EXIMBANK",
    "Ngân hàng SEABANK", "Ngân hàng VIB", "Ngân hàng MSB (Maritime)", "Ngân hàng SHB",
    "Ngân hàng OCB", "Ngân hàng HDBank", "Ngân hàng NAMABANK", "Ngân hàng SAIGONBANK",
    "Ngân hàng VIETBANK", "Ngân hàng ABBANK", "Ngân hàng KIENLONGBANK", "Ngân hàng BVBANK (Bản Việt)",
    "Ngân hàng PVCOMBANK", "Ngân hàng OCEANBANK", "Ngân hàng NCB", "Ngân hàng SHINHAN",
    "Ngân hàng SCB", "Ngân hàng VAB (VietA)", "Ngân hàng GPBANK", "Ngân hàng PGBANK",
    "Ngân hàng PUBLIC BANK", "Ngân hàng UOB", "Ngân hàng WOORI", "Ngân hàng CIMB",
    "Ngân hàng số CAKE", "Ngân hàng số TIMO", "Ngân hàng số TNEX", "Ngân hàng số LIOBANK",
    "Ví MOMO", "Ví ZALOPAY", "Ví VIETTEL MONEY", "Ví VNPT MONEY"
];

export default function CardPage() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('deposit'); 
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); 

  // State Nạp thẻ
  const [cardsList, setCardsList] = useState([
    { id: 1, telco: 'VIETTEL', amount: '10000', code: '', serial: '', status: 'idle', msg: '' }
  ]);

  // Form Rút tiền
  const [withdrawForm, setWithdrawForm] = useState({ bank_name: '', account_number: '', account_name: '', amount: '' });
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // State lịch sử
  const [history, setHistory] = useState({ cards: [], withdraws: [] });

  // State Admin
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminUserList, setAdminUserList] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newBalanceValue, setNewBalanceValue] = useState('');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [hasMore, setHasMore] = useState(true);
  const [adminWithdrawList, setAdminWithdrawList] = useState([]);

  // --- STATE MODAL QR CODE ---
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  // 🔥 State mới: quản lý trạng thái đang tải ảnh
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);

  useEffect(() => {
    fetchUserAndBalance();
  }, []);

  useEffect(() => {
    if (user) {
        fetchLastWithdrawalInfo();
        if (activeTab === 'history') fetchHistory();
        if (activeTab === 'admin_money' && profile?.role === 'admin') handleSearchUsers(1);
        if (activeTab === 'admin_withdraw' && profile?.role === 'admin') fetchAdminWithdraws();
    }
  }, [activeTab, user, profile]);

  const fetchUserAndBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
          setBalance(data.balance);
          setProfile(data); 
      }
    }
  };

  const fetchLastWithdrawalInfo = async () => {
      if (!user) return;
      try {
          const { data, error } = await supabase
              .from('withdraw_requests')
              .select('bank_name, account_number, account_name')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

          if (!error && data) {
              setWithdrawForm(prev => ({
                  ...prev,
                  bank_name: data.bank_name || '',
                  account_number: data.account_number || '',
                  account_name: data.account_name || ''
              }));
              setIsAutoFilled(true);
          }
      } catch (err) {
          console.error("Lỗi auto-fill:", err);
      }
  };

  const fetchHistory = async () => {
    try {
        const { data: cards } = await supabase.from('card_transactions').select('*').order('created_at', { ascending: false }).limit(20);
        const { data: withdraws } = await supabase.from('withdraw_requests').select('*').order('created_at', { ascending: false }).limit(20);
        setHistory({ cards: cards || [], withdraws: withdraws || [] });
    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
    }
  };

  // --- CÁC HÀM XỬ LÝ (NẠP THẺ) ---
  const addCardRow = () => setCardsList([...cardsList, { id: Date.now(), telco: 'VIETTEL', amount: '10000', code: '', serial: '', status: 'idle', msg: '' }]);
  const removeCardRow = (index) => { if (cardsList.length === 1) return; const newList = [...cardsList]; newList.splice(index, 1); setCardsList(newList); };
  const updateCardRow = (index, field, value) => { const newList = [...cardsList]; newList[index][field] = value; if (field === 'code' || field === 'serial') { newList[index].status = 'idle'; newList[index].msg = ''; } setCardsList(newList); };
  const handlePaste = async (index, field) => { try { const text = await navigator.clipboard.readText(); if (text) updateCardRow(index, field, text); } catch (err) { alert('Lỗi paste'); } };
  
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!user) { if (confirm("Đăng nhập ngay?")) navigate('/login'); return; }
    if (!cardsList.every(c => c.code && c.serial)) { alert("Thiếu mã/serial"); return; }
    setLoading(true);
    let successCount = 0;
    let currentList = [...cardsList];
    for (let i = 0; i < currentList.length; i++) {
        const card = currentList[i];
        if (card.status === 'success') continue;
        currentList[i].status = 'processing';
        setCardsList([...currentList]);
        try {
            const { data, error } = await supabase.functions.invoke('card-proxy', { body: { telco: card.telco, amount: card.amount, code: card.code, serial: card.serial, user_id: user.id } });
            if (error) throw error;
            if (data.status == 99) { currentList[i].status = 'success'; currentList[i].msg = 'Thành công'; successCount++; } 
            else { currentList[i].status = 'error'; currentList[i].msg = data.message || 'Lỗi'; }
        } catch (err) { currentList[i].status = 'error'; currentList[i].msg = err.message; }
        setCardsList([...currentList]);
    }
    setLoading(false);
    if (successCount > 0) { alert(`Gửi thành công ${successCount} thẻ!`); fetchUserAndBalance(); }
  };
  const resetForm = () => setCardsList([{ id: Date.now(), telco: 'VIETTEL', amount: '10000', code: '', serial: '', status: 'idle', msg: '' }]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert("Cần đăng nhập."); navigate('/login'); return; }
    setLoading(true);
    const amt = parseInt(withdrawForm.amount);
    if (amt < 10000 || amt > balance || !withdrawForm.bank_name) { alert("Thông tin không hợp lệ"); setLoading(false); return; }
    try {
        const { error } = await supabase.rpc('create_withdraw_request', { p_amount: amt, p_bank_name: withdrawForm.bank_name, p_account_number: withdrawForm.account_number, p_account_name: withdrawForm.account_name });
        if (error) throw error;
        alert("Tạo lệnh thành công!"); 
        setWithdrawForm(prev => ({ ...prev, amount: '' })); 
        fetchUserAndBalance();
    } catch (err) { alert("Lỗi: " + err.message); } finally { setLoading(false); }
  };

  // --- ADMIN FUNCTIONS ---
  const handleSearchUsers = async (pageNumber = 1) => {
    setLoading(true); setPage(pageNumber);
    try {
      const from = (pageNumber - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      let query = supabase.from('profiles').select('*', { count: 'exact' }).order('balance', { ascending: false }).range(from, to);
      if (adminSearchTerm.trim()) query = query.or(`character_name.ilike.%${adminSearchTerm}%,email.ilike.%${adminSearchTerm}%,zalo_contact.ilike.%${adminSearchTerm}%`);
      const { data, count, error } = await query;
      if (error) throw error;
      setAdminUserList(data || []); setHasMore(count > to + 1);
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleAdminUpdateBalance = async (userId) => {
    if (!newBalanceValue) return;
    if (!confirm(`Set số dư thành ${formatCurrency(newBalanceValue)}?`)) return;
    try {
        const { error } = await supabase.rpc('admin_update_balance', { p_user_id: userId, p_new_balance: parseInt(newBalanceValue) });
        if (error) throw error;
        alert("Thành công"); setEditingUserId(null); handleSearchUsers(page);
    } catch (err) { alert(err.message); }
  };

  const fetchAdminWithdraws = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase.from('withdraw_requests').select(`*, profiles (character_name, email)`).order('created_at', { ascending: false }).limit(50);
        if (error) throw error;
        setAdminWithdrawList(data || []);
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const handleProcessWithdraw = async (requestId, status) => {
      if (!confirm(`Xác nhận ${status === 'completed' ? 'DUYỆT' : 'HỦY'}?`)) return;
      setLoading(true);
      try {
          const { error } = await supabase.rpc('admin_process_withdraw', { p_request_id: requestId, p_status: status });
          if (error) throw error;
          alert("Xong!"); fetchAdminWithdraws();
      } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  const openQrModal = (item) => {
      const bankId = getBankId(item.bank_name);
      const qrUrl = `https://img.vietqr.io/image/${bankId}-${item.account_number}-compact.png?amount=${item.amount}&addInfo=RUT TIEN ${item.profiles?.character_name}&accountName=${encodeURIComponent(item.account_name)}`;
      setQrData({ url: qrUrl, info: item });
      setQrModalOpen(true);
  };

  // --- 🔥 HÀM TẢI ẢNH QR (ĐÃ NÂNG CẤP CHO MOBILE) 🔥 ---
  const handleDownloadQr = async () => {
      if (!qrData?.url) return;
      setIsDownloadingQr(true);

      try {
          // Bước 1: Thử fetch ảnh về dạng blob
          const response = await fetch(qrData.url);
          if (!response.ok) throw new Error('Network error');
          const blob = await response.blob();
          
          // Bước 2: Tạo URL object
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `QR_ChuyenKhoan_${qrData.info.amount}.png`;
          document.body.appendChild(link);
          
          // Bước 3: Kích hoạt tải xuống
          link.click();
          
          // Dọn dẹp
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
      } catch (error) {
          console.error('Lỗi tải ảnh tự động:', error);
          
          // 🔥 FALLBACK CHO MOBILE (iOS/Android chặn download trực tiếp) 🔥
          // Mở ảnh trong tab mới để người dùng có thể nhấn giữ -> Lưu ảnh
          const win = window.open(qrData.url, '_blank');
          if (win) {
              alert("Trên điện thoại: Hãy NHẤN GIỮ vào ảnh QR đang mở để chọn 'Lưu vào Ảnh' nhé!");
          } else {
              alert("Vui lòng cho phép mở cửa sổ bật lên (Popup) để xem ảnh QR.");
          }
      } finally {
          setIsDownloadingQr(false);
      }
  };

  const handleCopy = (text) => {
      navigator.clipboard.writeText(text);
      alert(`Đã copy: ${text}`);
  };

  const formatCurrency = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  const withdrawFee = 2000;
  const inputAmount = parseInt(withdrawForm.amount) || 0;
  const realReceived = inputAmount > 2000 ? inputAmount - 2000 : 0;

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen pb-20 relative"> 
      
      {/* --- MODAL QR CODE --- */}
      {qrModalOpen && qrData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setQrModalOpen(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                {/* Header Modal */}
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <QrCodeIcon className="w-6 h-6" /> Quét Mã Chuyển Khoản
                    </h3>
                    <button onClick={() => setQrModalOpen(false)} className="hover:bg-blue-700 p-1 rounded"><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <div className="p-6">
                    {/* QR Image */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-2 border-2 border-slate-200 rounded-xl shadow-sm">
                            <img src={qrData.url} alt="QR Code" className="w-56 h-56 object-contain" />
                            
                            {/* 🔥 NÚT TẢI ẢNH CẢI TIẾN 🔥 */}
                            <button 
                                onClick={handleDownloadQr}
                                disabled={isDownloadingQr}
                                className={`w-full mt-2 text-xs font-bold flex items-center justify-center gap-1 py-2 rounded transition-colors ${
                                    isDownloadingQr 
                                    ? 'bg-gray-100 text-gray-400 cursor-wait' 
                                    : 'text-blue-600 hover:bg-blue-50 hover:underline'
                                }`}
                            >
                                {isDownloadingQr ? (
                                    <>
                                        <ArrowPathIcon className="w-3 h-3 animate-spin" /> Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownTrayIcon className="w-3 h-3" /> Tải ảnh QR về máy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions (Nút Copy) */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-500 uppercase font-bold">Số tài khoản</p>
                                <p className="text-lg font-mono font-bold text-slate-800">{qrData.info.account_number}</p>
                            </div>
                            <button 
                                onClick={() => handleCopy(qrData.info.account_number)}
                                className="bg-blue-100 text-blue-700 p-3 rounded-lg hover:bg-blue-200 font-bold text-sm whitespace-nowrap"
                            >
                                Copy
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-500 uppercase font-bold">Số tiền</p>
                                <p className="text-lg font-bold text-red-600">{formatCurrency(qrData.info.amount)}</p>
                            </div>
                            <button 
                                onClick={() => handleCopy(qrData.info.amount)}
                                className="bg-red-100 text-red-700 p-3 rounded-lg hover:bg-red-200 font-bold text-sm whitespace-nowrap"
                            >
                                Copy
                            </button>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                             <div className="flex justify-between items-center mb-1">
                                 <p className="text-xs text-slate-500 uppercase font-bold">Ngân hàng</p>
                                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{qrData.info.bank_name}</span>
                             </div>
                             <p className="text-sm font-bold text-slate-800 uppercase">{qrData.info.account_name}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => setQrModalOpen(false)}
                            className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto pt-6 px-4">
        {/* Card Số Dư */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white shadow-xl mb-8 border border-blue-500/50 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Số dư khả dụng</h2>
                    <div className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md">{formatCurrency(balance)}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                   <div className="text-sm">
                        <p className="text-blue-200 text-xs">Tài khoản</p>
                        <p className="font-mono font-bold">{user ? user.email : 'Chưa đăng nhập'}</p>
                        {profile?.role === 'admin' && <span className="text-yellow-300 font-bold text-xs uppercase border border-yellow-300 px-1 rounded ml-1">Admin</span>}
                   </div>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <div className="grid grid-cols-3 sm:grid-cols-5 border-b-2 border-slate-100">
                {['deposit', 'withdraw', 'history'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-white text-blue-700 border-b-4 border-blue-700 shadow-inner' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                        {tab === 'deposit' && <CreditCardIcon className="w-5 h-5" />}
                        {tab === 'withdraw' && <BanknotesIcon className="w-5 h-5" />}
                        {tab === 'history' && <ClockIcon className="w-5 h-5" />}
                        <span className="hidden sm:inline">{tab === 'deposit' ? 'Nạp Thẻ' : tab === 'withdraw' ? 'Rút Tiền' : 'Lịch Sử'}</span>
                    </button>
                ))}
                {profile?.role === 'admin' && (
                    <>
                        <button onClick={() => setActiveTab('admin_money')} className={`py-4 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'admin_money' ? 'bg-red-50 text-red-700 border-b-4 border-red-700 shadow-inner' : 'bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600'}`}>
                            <UserGroupIcon className="w-5 h-5" /><span className="hidden sm:inline">QL Tiền</span>
                        </button>
                        <button onClick={() => setActiveTab('admin_withdraw')} className={`py-4 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'admin_withdraw' ? 'bg-orange-50 text-orange-700 border-b-4 border-orange-700 shadow-inner' : 'bg-slate-50 text-slate-500 hover:bg-orange-50 hover:text-orange-600'}`}>
                            <CurrencyDollarIcon className="w-5 h-5" /><span className="hidden sm:inline">Duyệt Rút</span>
                        </button>
                    </>
                )}
            </div>

            <div className="p-4 sm:p-8 bg-white">
                {/* --- TAB NẠP THẺ --- */}
                {activeTab === 'deposit' && (
                    <div className="animate-fade-in">
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-800 text-sm rounded-r-lg mb-6">
                            <div className="flex flex-col sm:flex-row sm:gap-8 font-medium"><span>⚡ Garena: <span className="font-bold text-green-600">15%</span></span><span>⚡ Viettel/Vina/Mobi: <span className="font-bold text-green-600">20%</span></span></div>
                            <div className="mt-1 text-red-600 italic text-xs font-bold">* Lưu ý: Chọn sai mệnh giá sẽ bị phạt theo quy định.</div>
                        </div>
                        <div className="space-y-4">
                            {cardsList.map((card, index) => (
                                <div key={card.id} className={`relative p-4 rounded-xl border-2 transition-all ${card.status === 'processing' ? 'border-blue-300 bg-blue-50' : card.status === 'success' ? 'border-green-300 bg-green-50' : card.status === 'error' ? 'border-red-300 bg-red-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                                    <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-slate-400 uppercase">Thẻ #{index + 1}</span>{cardsList.length > 1 && (<button onClick={() => removeCardRow(index)} type="button" className="text-slate-400 hover:text-red-500 transition-colors"><TrashIcon className="w-5 h-5" /></button>)}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:border-blue-500 outline-none" value={card.telco} onChange={e => updateCardRow(index, 'telco', e.target.value)} disabled={card.status === 'success' || card.status === 'processing'}><option value="VIETTEL">Viettel</option><option value="MOBIFONE">Mobifone</option><option value="VINAPHONE">Vinaphone</option><option value="GARENA">Garena</option><option value="GATE">Gate</option></select>
                                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:border-blue-500 outline-none" value={card.amount} onChange={e => updateCardRow(index, 'amount', e.target.value)} disabled={card.status === 'success' || card.status === 'processing'}><option value="10000">10.000 đ</option><option value="20000">20.000 đ</option><option value="50000">50.000 đ</option><option value="100000">100.000 đ</option><option value="200000">200.000 đ</option><option value="500000">500.000 đ</option></select>
                                        <div className="relative"><input type="text" placeholder="Mã thẻ" className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-sm focus:border-blue-500 outline-none" value={card.code} onChange={e => updateCardRow(index, 'code', e.target.value)} disabled={card.status === 'success' || card.status === 'processing'} /><button onClick={() => handlePaste(index, 'code')} type="button" className="absolute right-2 top-2.5 text-slate-400 hover:text-blue-600"><ClipboardDocumentIcon className="w-4 h-4" /></button></div>
                                        <div className="relative"><input type="text" placeholder="Serial" className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-sm focus:border-blue-500 outline-none" value={card.serial} onChange={e => updateCardRow(index, 'serial', e.target.value)} disabled={card.status === 'success' || card.status === 'processing'} /><button onClick={() => handlePaste(index, 'serial')} type="button" className="absolute right-2 top-2.5 text-slate-400 hover:text-blue-600"><ClipboardDocumentIcon className="w-4 h-4" /></button></div>
                                    </div>
                                    {card.msg && <div className={`mt-2 text-xs font-bold flex items-center gap-1 ${card.status === 'success' ? 'text-green-600' : card.status === 'error' ? 'text-red-600' : 'text-blue-600'}`}>{card.status === 'success' && <CheckCircleIcon className="w-4 h-4" />}{card.status === 'error' && <XCircleIcon className="w-4 h-4" />}{card.status === 'processing' && <ArrowPathIcon className="w-4 h-4 animate-spin" />}{card.msg}</div>}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button type="button" onClick={addCardRow} className="flex-1 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"><PlusCircleIcon className="w-6 h-6" /> THÊM DÒNG</button>
                            {cardsList.some(c => c.status === 'success' || c.status === 'error') && <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">LÀM MỚI</button>}
                            <button onClick={handleBulkSubmit} disabled={loading} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">{loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : 'GỬI TẤT CẢ'}</button>
                        </div>
                    </div>
                )}

                {/* --- TAB RÚT TIỀN (CẬP NHẬT AUTO-FILL) --- */}
                {activeTab === 'withdraw' && (
                    <form onSubmit={handleWithdrawSubmit} className="space-y-6 max-w-lg mx-auto animate-fade-in">
                        {isAutoFilled && (
                            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                <CheckCircleIcon className="w-5 h-5" /> Đã tự động điền thông tin cũ
                            </div>
                        )}
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg"><h4 className="font-bold text-red-800 uppercase text-sm mb-1">Thông tin rút tiền</h4><p className="text-red-700 text-sm">Phí cố định: <strong>2.000đ/lần</strong>. Duyệt lúc 13h & 19h.</p></div>
                        <div className="space-y-4">
                             <div><label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Ngân hàng thụ hưởng</label><div className="relative"><select required className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-slate-900 appearance-none bg-white" value={withdrawForm.bank_name} onChange={e => setWithdrawForm({...withdrawForm, bank_name: e.target.value})}><option value="">-- Chọn Ngân hàng / Ví --</option>{BANK_LIST.map((bank, index) => <option key={index} value={bank}>{bank}</option>)}</select></div></div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Số tài khoản</label><input type="text" placeholder="Số TK..." required className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 outline-none font-mono text-slate-900" value={withdrawForm.account_number} onChange={e => setWithdrawForm({...withdrawForm, account_number: e.target.value})} /></div><div><label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Chủ tài khoản</label><input type="text" placeholder="TÊN IN HOA..." required className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-slate-900 uppercase" value={withdrawForm.account_name} onChange={e => setWithdrawForm({...withdrawForm, account_name: e.target.value.toUpperCase()})} /></div></div>
                             <div><label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Số tiền muốn rút (Từ ví)</label><div className="relative"><input type="number" placeholder="Nhập số tiền..." required className="w-full p-3 pr-16 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-xl font-bold text-red-600" value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} /><span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">VNĐ</span></div>{inputAmount > 0 && (<div className="mt-3 bg-slate-100 p-4 rounded-lg border border-slate-200 animate-fade-in"><div className="flex justify-between items-center text-sm text-slate-500 mb-1"><span>Số tiền rút:</span><span className="font-medium">{formatCurrency(inputAmount)}</span></div><div className="flex justify-between items-center text-sm text-slate-500 mb-2 border-b border-slate-200 pb-2"><span>Phí giao dịch:</span><span className="font-medium text-red-500">-{formatCurrency(2000)}</span></div><div className="flex justify-between items-center"><span className="font-bold text-slate-800 uppercase flex items-center gap-1"><CalculatorIcon className="w-4 h-4" />Thực nhận:</span><span className="font-extrabold text-xl text-green-600">{formatCurrency(realReceived)}</span></div></div>)}</div>
                        </div>
                        <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg text-lg transition-transform active:scale-95 mt-4">{loading ? 'ĐANG TẠO LỆNH...' : 'XÁC NHẬN RÚT TIỀN'}</button>
                    </form>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h3 className="font-bold text-lg text-blue-800 border-l-4 border-blue-600 pl-3 mb-4">Lịch Sử Nạp Thẻ</h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm"><table className="min-w-full text-sm text-left"><thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs border-b border-slate-200"><tr><th className="px-4 py-3 whitespace-nowrap">Thời gian</th><th className="px-4 py-3 whitespace-nowrap">Nhà mạng</th><th className="px-4 py-3 whitespace-nowrap">Thông tin thẻ</th><th className="px-4 py-3 text-right whitespace-nowrap">Mệnh giá</th><th className="px-4 py-3 text-right whitespace-nowrap">Thực nhận</th><th className="px-4 py-3 text-center whitespace-nowrap">Trạng thái</th></tr></thead><tbody className="divide-y divide-slate-200">{history.cards.map(item => (<tr key={item.id} className="bg-white hover:bg-blue-50 transition-colors"><td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{new Date(item.created_at).toLocaleString('vi-VN')}</td><td className="px-4 py-3"><span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 text-xs">{item.telco}</span></td><td className="px-4 py-3"><div className="flex flex-col gap-1"><div className="text-xs text-slate-600"><span className="font-semibold text-slate-400 inline-block w-10">Mã:</span> <span className="font-mono font-medium select-all">{item.code}</span></div><div className="text-xs text-slate-600"><span className="font-semibold text-slate-400 inline-block w-10">Seri:</span> <span className="font-mono font-medium select-all">{item.serial}</span></div></div></td><td className="px-4 py-3 text-right font-medium text-slate-600 whitespace-nowrap">{formatCurrency(item.declared_amount)}</td><td className="px-4 py-3 text-right whitespace-nowrap">{item.received_amount > 0 ? <span className="font-bold text-green-600">+{formatCurrency(item.received_amount)}</span> : <span className="text-slate-300">-</span>}</td><td className="px-4 py-3 text-center align-middle whitespace-nowrap">{item.status === 'success' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">✅ Thẻ đúng</span>}{item.status === 'pending' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">⏳ Đang xử lý...</span>}{item.status === 'wrong_amount' && <div className="flex flex-col items-center"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">⚠️ Sai mệnh giá</span><span className="text-[10px] text-yellow-600 mt-1">Phạt còn 1.000đ</span></div>}{item.status === 'failed' && <div className="flex flex-col items-center"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">❌ Thất bại</span><span className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={item.message}>{item.message || 'Thẻ sai/Đã dùng'}</span></div>}</td></tr>))}</tbody></table></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-red-800 border-l-4 border-red-600 pl-3 mb-4">Lịch Sử Rút Tiền</h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg"><table className="min-w-full text-sm text-left"><thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs"><tr><th className="px-4 py-3">Thời gian</th><th className="px-4 py-3">Ngân hàng</th><th className="px-4 py-3 text-right">Số tiền rút</th><th className="px-4 py-3 text-center">Trạng thái</th></tr></thead><tbody className="divide-y divide-slate-200">{history.withdraws.map(item => (<tr key={item.id} className="bg-white hover:bg-red-50"><td className="px-4 py-3 text-slate-500">{new Date(item.created_at).toLocaleString('vi-VN')}</td><td className="px-4 py-3"><div className="font-bold text-slate-800">{item.bank_name}</div><div className="text-xs text-slate-500 font-mono">{item.account_number}</div></td><td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(item.amount)}</td><td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status === 'completed' ? 'Thành công' : item.status === 'rejected' ? 'Hủy' : 'Đang chờ'}</span></td></tr>))}</tbody></table></div>
                        </div>
                    </div>
                )}

                {activeTab === 'admin_money' && profile?.role === 'admin' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex flex-col sm:flex-row gap-2 mb-4"><div className="relative flex-1"><MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Tìm tên, email..." className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" value={adminSearchTerm} onChange={(e) => setAdminSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers(1)} /></div><button onClick={() => handleSearchUsers(1)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">Tìm Kiếm</button></div>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"><div className="grid grid-cols-12 bg-slate-100 p-3 text-xs sm:text-sm font-bold text-slate-700 uppercase"><div className="col-span-5">Người chơi</div><div className="col-span-4 text-center">Số dư (VNĐ)</div><div className="col-span-3 text-right">Thao tác</div></div><div className="max-h-[500px] overflow-y-auto custom-scrollbar divide-y divide-slate-100">{adminUserList.map((u, idx) => (<div key={u.id} className="grid grid-cols-12 p-3 items-center hover:bg-slate-50"><div className="col-span-5 pr-2"><div className="font-bold text-slate-800 truncate">{idx + 1}. {u.character_name}</div><div className="text-xs text-slate-500 truncate">{u.email}</div></div><div className="col-span-4 text-center">{editingUserId === u.id ? (<input type="number" autoFocus className="w-full border border-blue-500 rounded p-1 text-center font-bold text-blue-700 bg-white" value={newBalanceValue} onChange={(e) => setNewBalanceValue(e.target.value)} />) : (<span className="font-mono font-bold text-green-600">{formatCurrency(u.balance)}</span>)}</div><div className="col-span-3 text-right">{editingUserId === u.id ? (<div className="flex gap-1 justify-end"><button onClick={() => handleAdminUpdateBalance(u.id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Lưu</button><button onClick={() => setEditingUserId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">Hủy</button></div>) : (<button onClick={() => { setEditingUserId(u.id); setNewBalanceValue(u.balance); }} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Sửa</button>)}</div></div>))}</div></div>
                        <div className="flex justify-center items-center gap-4 mt-4"><button onClick={() => handleSearchUsers(page - 1)} disabled={page === 1 || loading} className={`px-3 py-1 rounded text-sm font-bold ${page === 1 ? 'bg-slate-200 text-slate-400' : 'bg-white border hover:bg-slate-50'}`}>← Trước</button><span className="text-sm font-bold text-slate-600">Trang {page}</span><button onClick={() => handleSearchUsers(page + 1)} disabled={!hasMore || loading} className={`px-3 py-1 rounded text-sm font-bold ${!hasMore ? 'bg-slate-200 text-slate-400' : 'bg-white border hover:bg-slate-50'}`}>Sau →</button></div>
                    </div>
                )}

                {/* --- TAB ADMIN: DUYỆT RÚT TIỀN (CÓ QR) --- */}
                {activeTab === 'admin_withdraw' && profile?.role === 'admin' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-700 border-l-4 border-orange-500 pl-3">Duyệt Đơn Rút Tiền</h3>
                            <button onClick={fetchAdminWithdraws} className="text-blue-600 hover:underline text-sm flex items-center gap-1"><ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Tải lại</button>
                        </div>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs border-b border-slate-200">
                                        <tr><th className="px-4 py-3">Người rút</th><th className="px-4 py-3">Thông tin nhận</th><th className="px-4 py-3 text-right">Số tiền</th><th className="px-4 py-3 text-center">Trạng thái</th><th className="px-4 py-3 text-right">Hành động</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {adminWithdrawList.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3"><div className="font-bold text-slate-800">{item.profiles?.character_name}</div><div className="text-xs text-slate-500">{item.profiles?.email}</div></td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-blue-700">{item.bank_name}</div>
                                                    <div className="text-xs font-mono text-slate-600">{item.account_number}</div>
                                                    <div className="text-xs font-bold text-slate-500 uppercase">{item.account_name}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-red-600 text-base">{formatCurrency(item.amount)}</td>
                                                <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'}`}>{item.status === 'completed' ? 'Đã duyệt' : item.status === 'rejected' ? 'Đã hủy' : 'Chờ duyệt'}</span></td>
                                                <td className="px-4 py-3 text-right">
                                                    {item.status === 'pending' ? (
                                                        <div className="flex gap-2 justify-end">
                                                            {/* NÚT QR CODE */}
                                                            <button onClick={() => openQrModal(item)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm" title="Quét QR chuyển tiền"><QrCodeIcon className="w-4 h-4" /></button>
                                                            <button onClick={() => handleProcessWithdraw(item.id, 'completed')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">DUYỆT</button>
                                                            <button onClick={() => handleProcessWithdraw(item.id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">HỦY</button>
                                                        </div>
                                                    ) : <span className="text-xs text-slate-400 italic">Đã xử lý</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <style>{` .animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } } `}</style>
    </div>
  );
}