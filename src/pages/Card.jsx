import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { BanknotesIcon, ClockIcon, CreditCardIcon, CalculatorIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';

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
  const [activeTab, setActiveTab] = useState('deposit'); 
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Form States
  const [cardForm, setCardForm] = useState({ telco: 'VIETTEL', amount: '10000', serial: '', code: '' });
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
        
        setHistory({ 
            cards: cards || [], 
            withdraws: withdraws || [] 
        });
    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
    }
  };

  // --- HÀM XỬ LÝ DÁN (PASTE) ---
  const handlePaste = async (field) => {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            setCardForm(prev => ({ ...prev, [field]: text }));
        }
    } catch (err) {
        alert('Không thể truy cập bộ nhớ đệm. Vui lòng nhập tay.');
    }
  };

  // --- XỬ LÝ NẠP THẺ ---
  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('card-proxy', {
        body: { ...cardForm, user_id: user.id }
      });

      if (error) throw error;

      if (data.status == 99) {
        alert("Đã gửi thẻ! Vui lòng đợi hệ thống xử lý trong giây lát.");
        setCardForm({ ...cardForm, serial: '', code: '' }); 
      } else {
        alert(`Phản hồi: ${data.message}`);
      }
    } catch (err) {
      alert("Lỗi kết nối: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ RÚT TIỀN ---
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const withdrawAmount = parseInt(withdrawForm.amount);
    if (withdrawAmount < 10000) { alert("Số tiền rút tối thiểu là 10.000đ"); setLoading(false); return; }
    if (withdrawAmount > balance) { alert("Số dư không đủ!"); setLoading(false); return; }
    if (!withdrawForm.bank_name) { alert("Vui lòng chọn ngân hàng!"); setLoading(false); return; }

    try {
        const { error } = await supabase.rpc('create_withdraw_request', {
            p_amount: withdrawAmount,
            p_bank_name: withdrawForm.bank_name,
            p_account_number: withdrawForm.account_number,
            p_account_name: withdrawForm.account_name
        });

        if (error) throw error;
        
        alert("Tạo lệnh rút thành công! Admin sẽ duyệt vào lúc 13h hoặc 19h trong ngày.");
        setWithdrawForm({ bank_name: '', account_number: '', account_name: '', amount: '' });
        fetchUserAndBalance(); 
    } catch (err) {
        alert("Lỗi: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Tính toán hiển thị (Calculator)
  const withdrawFee = 2000;
  const inputAmount = parseInt(withdrawForm.amount) || 0;
  const realReceived = inputAmount > withdrawFee ? inputAmount - withdrawFee : 0;

  return (
    <div className="font-sans text-slate-900"> 
      <div className="max-w-4xl mx-auto">
        
        {/* --- Card Số dư --- */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white shadow-xl mb-8 border border-blue-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Số dư khả dụng</h2>
                    <div className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                        {formatCurrency(balance)}
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg flex items-center gap-3">
                   <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                   <div className="text-sm">
                        <p className="text-blue-200 text-xs">Tài khoản</p>
                        <p className="font-mono font-bold">{user?.email}</p>
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
                         <span className="sm:hidden">
                            {tab === 'deposit' ? 'Nạp' : tab === 'withdraw' ? 'Rút' : 'Lịch sử'}
                        </span>
                    </button>
                ))}
            </div>

            <div className="p-4 sm:p-8 bg-white">
                {/* --- TAB NẠP THẺ --- */}
                {activeTab === 'deposit' && (
                    <form onSubmit={handleCardSubmit} className="space-y-6 max-w-lg mx-auto animate-fade-in">
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-800 text-sm rounded-r-lg">
                            <p className="font-bold">Chiết khấu:</p>
                            <div className="flex flex-col sm:flex-row sm:gap-4">
                                <span>- Garena: <span className="font-bold text-green-600">15%</span></span>
                                <span>- Viettel/Vina/Mobi: <span className="font-bold text-green-600">20%</span></span>
                            </div>
                            <div className="mt-1 text-red-600 italic text-xs font-bold">* Lưu ý: Chọn sai mệnh giá sẽ bị phạt theo quy định.</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">NHÀ MẠNG</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                                    value={cardForm.telco} onChange={e => setCardForm({...cardForm, telco: e.target.value})}>
                                    <option value="VIETTEL">Viettel</option>
                                    <option value="MOBIFONE">Mobifone</option>
                                    <option value="VINAPHONE">Vinaphone</option>
                                    <option value="GARENA">Garena</option>
                                    <option value="GATE">Gate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">MỆNH GIÁ</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-800"
                                    value={cardForm.amount} onChange={e => setCardForm({...cardForm, amount: e.target.value})}>
                                    <option value="10000">10.000 đ</option>
                                    <option value="20000">20.000 đ</option>
                                    <option value="50000">50.000 đ</option>
                                    <option value="100000">100.000 đ</option>
                                    <option value="200000">200.000 đ</option>
                                    <option value="500000">500.000 đ</option>
                                </select>
                            </div>
                        </div>

                        {/* --- UI MỚI: MÃ THẺ (Paste Icon bên trong) --- */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">MÃ THẺ</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Nhập mã thẻ..." 
                                    required 
                                    className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono tracking-wider text-lg text-slate-800 placeholder:text-slate-400 placeholder:font-sans placeholder:text-base" 
                                    value={cardForm.code} 
                                    onChange={e => setCardForm({...cardForm, code: e.target.value})} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handlePaste('code')} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full" 
                                    title="Dán mã thẻ"
                                >
                                    <ClipboardDocumentIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        {/* --- UI MỚI: SERIAL (Paste Icon bên trong) --- */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">SERIAL</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Nhập số serial..." 
                                    required 
                                    className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono tracking-wider text-lg text-slate-800 placeholder:text-slate-400 placeholder:font-sans placeholder:text-base" 
                                    value={cardForm.serial} 
                                    onChange={e => setCardForm({...cardForm, serial: e.target.value})} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handlePaste('serial')} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full" 
                                    title="Dán serial"
                                >
                                    <ClipboardDocumentIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-lg shadow-lg text-lg transition-transform active:scale-95">
                            {loading ? 'ĐANG XỬ LÝ...' : 'NẠP THẺ NGAY'}
                        </button>
                    </form>
                )}

                {/* --- TAB RÚT TIỀN --- */}
                {activeTab === 'withdraw' && (
                    <form onSubmit={handleWithdrawSubmit} className="space-y-6 max-w-lg mx-auto animate-fade-in">
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
                             <h4 className="font-bold text-red-800 uppercase text-sm mb-1">Thông tin rút tiền</h4>
                             <p className="text-red-700 text-sm">Phí cố định: <strong>2.000đ/lần</strong>. Duyệt lúc 13h & 19h.</p>
                        </div>

                        <div className="space-y-4">
                             {/* --- TÍCH HỢP LIST NGÂN HÀNG --- */}
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
                                    {/* Mũi tên custom cho select */}
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
                                    <input 
                                        type="text" 
                                        placeholder="Số TK..." 
                                        required 
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono text-slate-900 placeholder:text-slate-400" 
                                        value={withdrawForm.account_number} 
                                        onChange={e => setWithdrawForm({...withdrawForm, account_number: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Chủ tài khoản</label>
                                    <input 
                                        type="text" 
                                        placeholder="TÊN IN HOA..." 
                                        required 
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 uppercase placeholder:normal-case placeholder:text-slate-400" 
                                        value={withdrawForm.account_name} 
                                        onChange={e => setWithdrawForm({...withdrawForm, account_name: e.target.value.toUpperCase()})} 
                                    />
                                </div>
                            </div>

                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase">Số tiền muốn rút (Từ ví)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        placeholder="Nhập số tiền..." 
                                        required 
                                        className="w-full p-3 pr-16 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xl font-bold text-red-600 placeholder:text-slate-300 placeholder:text-base placeholder:font-normal" 
                                        value={withdrawForm.amount} 
                                        onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">VNĐ</span>
                                </div>

                                {/* Box tính toán */}
                                {inputAmount > 0 && (
                                     <div className="mt-3 bg-slate-100 p-4 rounded-lg border border-slate-200 animate-fade-in">
                                        <div className="flex justify-between items-center text-sm text-slate-500 mb-1">
                                            <span>Số tiền rút:</span>
                                            <span className="font-medium">{formatCurrency(inputAmount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-slate-500 mb-2 border-b border-slate-200 pb-2">
                                            <span>Phí giao dịch:</span>
                                            <span className="font-medium text-red-500">-{formatCurrency(withdrawFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-slate-800 uppercase flex items-center gap-1">
                                                <CalculatorIcon className="w-4 h-4" />
                                                Thực nhận:
                                            </span>
                                            <span className="font-extrabold text-xl text-green-600">
                                                {formatCurrency(realReceived)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg text-lg transition-transform active:scale-95 mt-4">
                            {loading ? 'ĐANG TẠO LỆNH...' : 'XÁC NHẬN RÚT TIỀN'}
                        </button>
                    </form>
                )}

                {/* --- TAB LỊCH SỬ (Giữ nguyên) --- */}
                {activeTab === 'history' && (
                    <div className="space-y-8 animate-fade-in">
                         {/* Bảng Nạp Thẻ */}
                        <div>
                            <h3 className="font-bold text-lg text-blue-800 border-l-4 border-blue-600 pl-3 mb-4">Lịch Sử Nạp Thẻ</h3>
                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
                                        <tr><th className="px-4 py-3">Thời gian</th><th className="px-4 py-3">Nhà mạng</th><th className="px-4 py-3 text-right">Mệnh giá</th><th className="px-4 py-3 text-right">Thực nhận</th><th className="px-4 py-3 text-center">Trạng thái</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {history.cards && history.cards.length > 0 ? (
                                            history.cards.map(item => (
                                                <tr key={item.id} className="bg-white hover:bg-blue-50">
                                                    <td className="px-4 py-3 text-slate-500">{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{item.telco}</td>
                                                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.declared_amount)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-green-600">{item.received_amount > 0 ? formatCurrency(item.received_amount) : '-'}</td>
                                                    <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'success' ? 'bg-green-100 text-green-700' : item.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                                                </tr>
                                            ))
                                        ) : (<tr><td colSpan="5" className="p-4 text-center text-slate-500">Chưa có giao dịch nào</td></tr>)}
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