import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { 
    BanknotesIcon, ClockIcon, CreditCardIcon, 
    CalculatorIcon, ClipboardDocumentIcon, PlusCircleIcon, TrashIcon,
    CheckCircleIcon, XCircleIcon, ArrowPathIcon
} from '@heroicons/react/24/solid';

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

  // --- STATE MỚI: QUẢN LÝ DANH SÁCH THẺ ---
  // Mỗi thẻ là một object có id riêng để quản lý trạng thái
  const [cardsList, setCardsList] = useState([
    { id: 1, telco: 'VIETTEL', amount: '10000', code: '', serial: '', status: 'idle', msg: '' }
  ]);

  // Form Rút tiền
  const [withdrawForm, setWithdrawForm] = useState({ bank_name: '', account_number: '', account_name: '', amount: '' });

  // State lịch sử
  const [history, setHistory] = useState({ cards: [], withdraws: [] });

  useEffect(() => {
    fetchUserAndBalance();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'history') {
        fetchHistory();
    }
  }, [activeTab, user]);

  const fetchUserAndBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data } = await supabase.from('profiles').select('balance').eq('id', user.id).single();
      if (data) setBalance(data.balance);
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

  // --- CÁC HÀM QUẢN LÝ DANH SÁCH THẺ (Thêm/Sửa/Xóa) ---

  const addCardRow = () => {
    setCardsList([...cardsList, { 
        id: Date.now(), // Tạo ID ngẫu nhiên
        telco: 'VIETTEL', amount: '10000', code: '', serial: '', status: 'idle', msg: '' 
    }]);
  };

  const removeCardRow = (index) => {
    if (cardsList.length === 1) return; // Giữ lại ít nhất 1 dòng
    const newList = [...cardsList];
    newList.splice(index, 1);
    setCardsList(newList);
  };

  const updateCardRow = (index, field, value) => {
    const newList = [...cardsList];
    newList[index][field] = value;
    // Reset trạng thái nếu người dùng sửa lại
    if (field === 'code' || field === 'serial') {
        newList[index].status = 'idle';
        newList[index].msg = '';
    }
    setCardsList(newList);
  };

  const handlePaste = async (index, field) => {
    try {
        const text = await navigator.clipboard.readText();
        if (text) updateCardRow(index, field, text);
    } catch (err) {
        alert('Không thể truy cập bộ nhớ đệm.');
    }
  };

  // --- XỬ LÝ GỬI NHIỀU THẺ (Bulk Submit) ---
  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
        const confirmLogin = confirm("Bạn cần đăng nhập để nạp thẻ. Đăng nhập ngay?");
        if (confirmLogin) navigate('/login');
        return; 
    }

    // Kiểm tra xem có thẻ nào chưa nhập đủ không
    const isValid = cardsList.every(card => card.code && card.serial);
    if (!isValid) {
        alert("Vui lòng nhập đầy đủ Mã thẻ và Serial cho tất cả các dòng.");
        return;
    }

    setLoading(true);

    // Duyệt qua từng thẻ và gửi đi
    let successCount = 0;
    let currentList = [...cardsList];

    for (let i = 0; i < currentList.length; i++) {
        const card = currentList[i];

        // Chỉ xử lý những thẻ chưa thành công
        if (card.status === 'success') continue;

        // Cập nhật trạng thái đang chạy
        currentList[i].status = 'processing';
        setCardsList([...currentList]); // Update UI ngay lập tức

        try {
            const { data, error } = await supabase.functions.invoke('card-proxy', {
                body: { 
                    telco: card.telco, 
                    amount: card.amount, 
                    code: card.code, 
                    serial: card.serial, 
                    user_id: user.id 
                }
            });

            if (error) throw error;

            if (data.status == 99) {
                currentList[i].status = 'success';
                currentList[i].msg = 'Đã gửi thành công';
                successCount++;
            } else {
                currentList[i].status = 'error';
                currentList[i].msg = data.message || 'Lỗi không xác định';
            }
        } catch (err) {
            currentList[i].status = 'error';
            currentList[i].msg = err.message;
        }

        // Update UI sau mỗi lần lặp
        setCardsList([...currentList]);
    }

    setLoading(false);
    if (successCount > 0) {
        alert(`Đã gửi thành công ${successCount} thẻ! Vui lòng chờ hệ thống duyệt.`);
    }
  };

  // Nút Reset form
  const resetForm = () => {
    setCardsList([{ id: Date.now(), telco: 'VIETTEL', amount: '10000', code: '', serial: '', status: 'idle', msg: '' }]);
  };

  // --- XỬ LÝ RÚT TIỀN ---
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert("Bạn cần đăng nhập."); navigate('/login'); return; }
    setLoading(true);
    
    const withdrawAmount = parseInt(withdrawForm.amount);
    if (withdrawAmount < 10000) { alert("Tối thiểu 10.000đ"); setLoading(false); return; }
    if (withdrawAmount > balance) { alert("Số dư không đủ!"); setLoading(false); return; }
    if (!withdrawForm.bank_name) { alert("Chọn ngân hàng!"); setLoading(false); return; }

    try {
        const { error } = await supabase.rpc('create_withdraw_request', {
            p_amount: withdrawAmount,
            p_bank_name: withdrawForm.bank_name,
            p_account_number: withdrawForm.account_number,
            p_account_name: withdrawForm.account_name
        });
        if (error) throw error;
        alert("Tạo lệnh rút thành công!");
        setWithdrawForm({ bank_name: '', account_number: '', account_name: '', amount: '' });
        fetchUserAndBalance(); 
    } catch (err) {
        alert("Lỗi: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  const withdrawFee = 2000;
  const inputAmount = parseInt(withdrawForm.amount) || 0;
  const realReceived = inputAmount > withdrawFee ? inputAmount - withdrawFee : 0;

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen pb-20"> 
      <div className="max-w-5xl mx-auto pt-6 px-4">
        
        {/* --- Card Số dư --- */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white shadow-xl mb-8 border border-blue-500/50 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Số dư khả dụng</h2>
                    <div className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                        {formatCurrency(balance)}
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                   <div className="text-sm">
                        <p className="text-blue-200 text-xs">Tài khoản</p>
                        <p className="font-mono font-bold">{user ? user.email : 'Chưa đăng nhập'}</p>
                   </div>
                </div>
            </div>
        </div>

        {/* --- Main Content Container --- */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            
            {/* Tabs Navigation */}
            <div className="grid grid-cols-3 border-b-2 border-slate-100">
                {['deposit', 'withdraw', 'history'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`py-4 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
                            ${activeTab === tab 
                                ? 'bg-white text-blue-700 border-b-4 border-blue-700 shadow-inner' 
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                        {tab === 'deposit' && <CreditCardIcon className="w-5 h-5" />}
                        {tab === 'withdraw' && <BanknotesIcon className="w-5 h-5" />}
                        {tab === 'history' && <ClockIcon className="w-5 h-5" />}
                        <span className="hidden sm:inline">
                            {tab === 'deposit' ? 'Nạp Thẻ' : tab === 'withdraw' ? 'Rút Tiền' : 'Lịch Sử'}
                        </span>
                    </button>
                ))}
            </div>

            <div className="p-4 sm:p-8 bg-white">
                {/* --- TAB NẠP THẺ (MULTI CARD) --- */}
                {activeTab === 'deposit' && (
                    <div className="animate-fade-in">
                        {/* Bảng thông báo chiết khấu */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-800 text-sm rounded-r-lg mb-6">
                            <div className="flex flex-col sm:flex-row sm:gap-8 font-medium">
                                <span>⚡ Garena: <span className="font-bold text-green-600">15%</span></span>
                                <span>⚡ Viettel/Vina/Mobi: <span className="font-bold text-green-600">20%</span></span>
                            </div>
                            <div className="mt-1 text-red-600 italic text-xs font-bold">* Lưu ý: Chọn sai mệnh giá sẽ bị phạt theo quy định.</div>
                        </div>

                        {/* --- DANH SÁCH THẺ NHẬP --- */}
                        <div className="space-y-4">
                            {cardsList.map((card, index) => (
                                <div key={card.id} className={`relative p-4 rounded-xl border-2 transition-all ${
                                    card.status === 'processing' ? 'border-blue-300 bg-blue-50' :
                                    card.status === 'success' ? 'border-green-300 bg-green-50' :
                                    card.status === 'error' ? 'border-red-300 bg-red-50' :
                                    'border-slate-100 bg-white hover:border-blue-200'
                                }`}>
                                    {/* Header dòng: Số thứ tự + Nút xóa */}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Thẻ #{index + 1}</span>
                                        {cardsList.length > 1 && (
                                            <button onClick={() => removeCardRow(index)} type="button" className="text-slate-400 hover:text-red-500 transition-colors">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Grid Input */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {/* 1. Loại thẻ */}
                                        <select 
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:border-blue-500 outline-none"
                                            value={card.telco} 
                                            onChange={e => updateCardRow(index, 'telco', e.target.value)}
                                            disabled={card.status === 'success' || card.status === 'processing'}
                                        >
                                            <option value="VIETTEL">Viettel</option>
                                            <option value="MOBIFONE">Mobifone</option>
                                            <option value="VINAPHONE">Vinaphone</option>
                                            <option value="GARENA">Garena</option>
                                            <option value="GATE">Gate</option>
                                        </select>

                                        {/* 2. Mệnh giá */}
                                        <select 
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:border-blue-500 outline-none"
                                            value={card.amount} 
                                            onChange={e => updateCardRow(index, 'amount', e.target.value)}
                                            disabled={card.status === 'success' || card.status === 'processing'}
                                        >
                                            <option value="10000">10.000 đ</option>
                                            <option value="20000">20.000 đ</option>
                                            <option value="50000">50.000 đ</option>
                                            <option value="100000">100.000 đ</option>
                                            <option value="200000">200.000 đ</option>
                                            <option value="500000">500.000 đ</option>
                                        </select>

                                        {/* 3. Mã thẻ */}
                                        <div className="relative">
                                            <input 
                                                type="text" placeholder="Mã thẻ" 
                                                className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-sm focus:border-blue-500 outline-none"
                                                value={card.code}
                                                onChange={e => updateCardRow(index, 'code', e.target.value)}
                                                disabled={card.status === 'success' || card.status === 'processing'}
                                            />
                                            <button onClick={() => handlePaste(index, 'code')} type="button" className="absolute right-2 top-2.5 text-slate-400 hover:text-blue-600">
                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* 4. Serial */}
                                        <div className="relative">
                                            <input 
                                                type="text" placeholder="Serial" 
                                                className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-sm focus:border-blue-500 outline-none"
                                                value={card.serial}
                                                onChange={e => updateCardRow(index, 'serial', e.target.value)}
                                                disabled={card.status === 'success' || card.status === 'processing'}
                                            />
                                            <button onClick={() => handlePaste(index, 'serial')} type="button" className="absolute right-2 top-2.5 text-slate-400 hover:text-blue-600">
                                                <ClipboardDocumentIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Thông báo trạng thái từng dòng */}
                                    {card.msg && (
                                        <div className={`mt-2 text-xs font-bold flex items-center gap-1 ${
                                            card.status === 'success' ? 'text-green-600' : 
                                            card.status === 'error' ? 'text-red-600' : 'text-blue-600'
                                        }`}>
                                            {card.status === 'success' && <CheckCircleIcon className="w-4 h-4" />}
                                            {card.status === 'error' && <XCircleIcon className="w-4 h-4" />}
                                            {card.status === 'processing' && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                                            {card.msg}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* --- BUTTONS ACTION --- */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button 
                                type="button" 
                                onClick={addCardRow}
                                className="flex-1 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <PlusCircleIcon className="w-6 h-6" />
                                THÊM DÒNG
                            </button>

                            {cardsList.some(c => c.status === 'success' || c.status === 'error') && (
                                <button 
                                    type="button" 
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                                >
                                    LÀM MỚI
                                </button>
                            )}

                            <button 
                                onClick={handleBulkSubmit}
                                disabled={loading} 
                                className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : 'GỬI TẤT CẢ'}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- TAB RÚT TIỀN --- */}
                {activeTab === 'withdraw' && (
                    <form onSubmit={handleWithdrawSubmit} className="space-y-6 max-w-lg mx-auto animate-fade-in">
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
                             <h4 className="font-bold text-red-800 uppercase text-sm mb-1">Thông tin rút tiền</h4>
                             <p className="text-red-700 text-sm">Phí cố định: <strong>2.000đ/lần</strong>. Duyệt lúc 13h & 19h.</p>
                        </div>

                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Ngân hàng thụ hưởng</label>
                                <div className="relative">
                                    <select 
                                        required 
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 appearance-none bg-white" 
                                        value={withdrawForm.bank_name} 
                                        onChange={e => setWithdrawForm({...withdrawForm, bank_name: e.target.value})}
                                    >
                                        <option value="">-- Chọn Ngân hàng / Ví --</option>
                                        {BANK_LIST.map((bank, index) => (
                                            <option key={index} value={bank}>{bank}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Số tài khoản</label>
                                    <input type="text" placeholder="Số TK..." required className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 outline-none font-mono text-slate-900" 
                                        value={withdrawForm.account_number} onChange={e => setWithdrawForm({...withdrawForm, account_number: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Chủ tài khoản</label>
                                    <input type="text" placeholder="TÊN IN HOA..." required className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-slate-900 uppercase" 
                                        value={withdrawForm.account_name} onChange={e => setWithdrawForm({...withdrawForm, account_name: e.target.value.toUpperCase()})} />
                                </div>
                            </div>

                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Số tiền muốn rút (Từ ví)</label>
                                <div className="relative">
                                    <input type="number" placeholder="Nhập số tiền..." required className="w-full p-3 pr-16 border border-slate-300 rounded-lg focus:border-blue-500 outline-none text-xl font-bold text-red-600" 
                                        value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">VNĐ</span>
                                </div>
                                {inputAmount > 0 && (
                                     <div className="mt-3 bg-slate-100 p-4 rounded-lg border border-slate-200 animate-fade-in">
                                        <div className="flex justify-between items-center text-sm text-slate-500 mb-1"><span>Số tiền rút:</span><span className="font-medium">{formatCurrency(inputAmount)}</span></div>
                                        <div className="flex justify-between items-center text-sm text-slate-500 mb-2 border-b border-slate-200 pb-2"><span>Phí giao dịch:</span><span className="font-medium text-red-500">-{formatCurrency(withdrawFee)}</span></div>
                                        <div className="flex justify-between items-center"><span className="font-bold text-slate-800 uppercase flex items-center gap-1"><CalculatorIcon className="w-4 h-4" />Thực nhận:</span><span className="font-extrabold text-xl text-green-600">{formatCurrency(realReceived)}</span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg text-lg transition-transform active:scale-95 mt-4">
                            {loading ? 'ĐANG TẠO LỆNH...' : 'XÁC NHẬN RÚT TIỀN'}
                        </button>
                    </form>
                )}

                {/* --- TAB LỊCH SỬ MỚI --- */}
                {activeTab === 'history' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Bảng Nạp Thẻ */}
                        <div>
                            <h3 className="font-bold text-lg text-blue-800 border-l-4 border-blue-600 pl-3 mb-4">Lịch Sử Nạp Thẻ</h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 whitespace-nowrap">Thời gian</th>
                                            <th className="px-4 py-3 whitespace-nowrap">Nhà mạng</th>
                                            <th className="px-4 py-3 whitespace-nowrap">Thông tin thẻ</th> {/* Cột Mới */}
                                            <th className="px-4 py-3 text-right whitespace-nowrap">Mệnh giá</th>
                                            <th className="px-4 py-3 text-right whitespace-nowrap">Thực nhận</th>
                                            <th className="px-4 py-3 text-center whitespace-nowrap">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {history.cards && history.cards.length > 0 ? (
                                            history.cards.map(item => (
                                                <tr key={item.id} className="bg-white hover:bg-blue-50 transition-colors">
                                                    {/* 1. Thời gian */}
                                                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                                                        {new Date(item.created_at).toLocaleString('vi-VN')}
                                                    </td>

                                                    {/* 2. Nhà mạng */}
                                                    <td className="px-4 py-3">
                                                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 text-xs">
                                                            {item.telco}
                                                        </span>
                                                    </td>

                                                    {/* 3. Thông tin thẻ (Mới thêm Mã & Seri) */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-xs text-slate-600">
                                                                <span className="font-semibold text-slate-400 inline-block w-10">Mã:</span> 
                                                                <span className="font-mono font-medium select-all">{item.code}</span>
                                                            </div>
                                                            <div className="text-xs text-slate-600">
                                                                <span className="font-semibold text-slate-400 inline-block w-10">Seri:</span> 
                                                                <span className="font-mono font-medium select-all">{item.serial}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* 4. Mệnh giá */}
                                                    <td className="px-4 py-3 text-right font-medium text-slate-600 whitespace-nowrap">
                                                        {formatCurrency(item.declared_amount)}
                                                    </td>

                                                    {/* 5. Thực nhận */}
                                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                                        {item.received_amount > 0 ? (
                                                            <span className="font-bold text-green-600">+{formatCurrency(item.received_amount)}</span>
                                                        ) : (
                                                            <span className="text-slate-300">-</span>
                                                        )}
                                                    </td>

                                                    {/* 6. Trạng thái */}
                                                    <td className="px-4 py-3 text-center align-middle whitespace-nowrap">
                                                        {item.status === 'success' && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                                ✅ Thẻ đúng
                                                            </span>
                                                        )}
                                                        {item.status === 'pending' && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
                                                                ⏳ Đang xử lý...
                                                            </span>
                                                        )}
                                                        {item.status === 'wrong_amount' && (
                                                            <div className="flex flex-col items-center">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                                    ⚠️ Sai mệnh giá
                                                                </span>
                                                                <span className="text-[10px] text-yellow-600 mt-1">Phạt còn 1.000đ</span>
                                                            </div>
                                                        )}
                                                        {item.status === 'failed' && (
                                                            <div className="flex flex-col items-center">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                                    ❌ Thất bại
                                                                </span>
                                                                <span className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={item.message}>
                                                                    {item.message || 'Thẻ sai/Đã dùng'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="p-8 text-center text-slate-500 italic">
                                                    Chưa có giao dịch nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Bảng Rút Tiền */}
                        <div>
                            <h3 className="font-bold text-lg text-red-800 border-l-4 border-red-600 pl-3 mb-4">Lịch Sử Rút Tiền</h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
                                            <tr><th className="px-4 py-3">Thời gian</th><th className="px-4 py-3">Ngân hàng</th><th className="px-4 py-3 text-right">Số tiền rút</th><th className="px-4 py-3 text-center">Trạng thái</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                            {history.withdraws && history.withdraws.length > 0 ? (
                                                history.withdraws.map(item => (
                                                    <tr key={item.id} className="bg-white hover:bg-red-50">
                                                        <td className="px-4 py-3 text-slate-500">{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                                                        <td className="px-4 py-3"><div className="font-bold text-slate-800">{item.bank_name}</div><div className="text-xs text-slate-500 font-mono">{item.account_number}</div></td>
                                                        <td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(item.amount)}</td>
                                                        <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status === 'completed' ? 'Thành công' : item.status === 'rejected' ? 'Hủy' : 'Đang chờ'}</span></td>
                                                    </tr>
                                                ))
                                            ) : (<tr><td colSpan="4" className="p-4 text-center text-slate-500">Chưa có giao dịch nào</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}