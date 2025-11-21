import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
// KẾT NỐI SUPABASE THẬT
import { supabase } from '../supabase'; 

import { 
    CreditCard, Wallet, ArrowRightLeft, AlertCircle, CheckCircle, 
    Loader2, Lock, LogIn, User, UserPlus, Server, Phone, 
    ChevronLeft, History, Clock, XCircle 
} from 'lucide-react';
import { HomeIcon } from '@heroicons/react/24/solid'; 

// ==========================================
// UTILS (TIỆN ÍCH)
// ==========================================
const Utils = {
  formatCurrency: (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0),
  formatDate: (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleString('vi-VN', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });
  },
  calculateReceived: (telco, amount) => {
    const val = parseInt(amount);
    // Garena 15%, Thẻ khác 20%
    const discount = telco === 'GARENA' ? 0.15 : 0.20;
    return val * (1 - discount);
  }
};

// ==========================================
// COMPONENT CHÍNH: CARD PAGE
// ==========================================
const CardPage = () => {
  const [activeTab, setActiveTab] = useState('exchange');
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Hàm tải dữ liệu người dùng thật
  const refreshUserData = async () => {
    setLoadingAuth(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          fetchBalance(session.user.id);
          
          // Lắng nghe thay đổi số dư Realtime
          const channel = supabase.channel('balance_update')
            .on('postgres_changes', { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'profiles', 
              filter: `id=eq.${session.user.id}` 
            }, 
            (payload) => {
                if (payload.new && payload.new.balance !== undefined) {
                    setBalance(payload.new.balance);
                }
            })
            .subscribe();

          return () => supabase.removeChannel(channel);
        } else {
            setUser(null);
            setBalance(0);
        }
    } catch (error) {
        console.error("Lỗi Auth:", error);
    } finally {
        setLoadingAuth(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const fetchBalance = async (userId) => {
    const { data } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    if (data) setBalance(data.balance);
  };

  if (loadingAuth) {
    return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans animate-fade-in">
      <Link to="/" title="Quay về trang chủ" className="fixed top-4 left-4 lg:absolute lg:top-6 lg:-left-16 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition-colors z-50">
        <HomeIcon className="h-6 w-6 text-gray-700" />
      </Link>

      {/* Header Balance */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Hệ Thống Giao Dịch</h1>
          <p className="text-sm opacity-80">Tự động - An toàn - Bảo mật</p>
        </div>
        {user && (
            <div className="text-right bg-white/10 p-3 rounded-xl backdrop-blur-sm relative z-10 border border-white/10">
                <p className="text-xs uppercase opacity-70">Số dư khả dụng</p>
                <p className="text-2xl font-bold text-yellow-300">{Utils.formatCurrency(balance)}</p>
            </div>
        )}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-xl overflow-x-auto">
        {[
            { id: 'exchange', label: 'Đổi Thẻ Cào', icon: ArrowRightLeft, color: 'text-blue-600' },
            { id: 'withdraw', label: 'Rút Tiền', icon: Wallet, color: 'text-green-600' },
            { id: 'history', label: 'Lịch sử GD', icon: History, color: 'text-purple-600' }
        ].map((tab) => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`flex-1 py-3 rounded-lg font-medium flex justify-center items-center transition-all whitespace-nowrap px-2
                ${activeTab === tab.id ? `bg-white ${tab.color} shadow-sm` : 'text-gray-500 hover:bg-gray-200'}`}
            >
                <tab.icon className="w-5 h-5 mr-2"/> {tab.label}
            </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 relative min-h-[500px]">
        {!user ? (
          <AuthContainer onLoginSuccess={refreshUserData} />
        ) : (
           <>
             <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 border-b pb-2">
                <User className="w-4 h-4"/> Xin chào, <span className="font-bold text-gray-700">{user.email}</span>
                <button onClick={async () => { await supabase.auth.signOut(); refreshUserData(); }} className="ml-auto text-red-500 hover:underline text-xs font-medium">Đăng xuất</button>
             </div>

             {activeTab === 'exchange' && <ExchangeForm />}
             {activeTab === 'withdraw' && <WithdrawForm balance={balance} />}
             {activeTab === 'history' && <HistorySection userId={user.id} />}
           </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// TAB LỊCH SỬ GIAO DỊCH (QUAN TRỌNG)
// ==========================================
const HistorySection = ({ userId }) => {
    const [activeSubTab, setActiveSubTab] = useState('cards'); // 'cards' | 'withdraws'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu thật từ Supabase
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let result;
            
            if (activeSubTab === 'cards') {
                result = await supabase.from('card_transactions')
                    .select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20);
            } else {
                result = await supabase.from('withdraw_requests')
                    .select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20);
            }

            if (result.data) setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, [activeSubTab, userId]);

    const getStatusBadge = (status) => {
        switch(status) {
            case 'success': case 'completed': return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold"><CheckCircle className="w-3 h-3 mr-1"/> Thành công</span>;
            case 'pending': return <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold"><Clock className="w-3 h-3 mr-1"/> Đang xử lý</span>;
            case 'wrong_amount': return <span className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold"><AlertCircle className="w-3 h-3 mr-1"/> Sai mệnh giá</span>;
            default: return <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold"><XCircle className="w-3 h-3 mr-1"/> Thất bại/Hủy</span>;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex gap-2 mb-4">
                <button onClick={() => setActiveSubTab('cards')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSubTab === 'cards' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>Thẻ Cào</button>
                <button onClick={() => setActiveSubTab('withdraws')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSubTab === 'withdraws' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>Rút Tiền</button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-400"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2"/>Đang tải dữ liệu...</div>
            ) : data.length === 0 ? (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">Chưa có giao dịch nào</div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="p-3 min-w-[100px]">Thời gian</th>
                                <th className="p-3 min-w-[120px]">{activeSubTab === 'cards' ? 'Loại/Seri' : 'Ngân hàng'}</th>
                                <th className="p-3 text-right min-w-[100px]">Số tiền</th>
                                <th className="p-3 text-center min-w-[100px]">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-gray-500 text-xs">{Utils.formatDate(item.created_at)}</td>
                                    <td className="p-3">
                                        {activeSubTab === 'cards' ? (
                                            <div>
                                                <span className="font-bold block text-blue-600">{item.telco}</span>
                                                <span className="text-xs text-gray-400 font-mono">{item.serial}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="font-bold block text-green-600">{item.bank_name}</span>
                                                <span className="text-xs text-gray-400 font-mono">{item.account_number}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 text-right font-medium">
                                        {activeSubTab === 'cards' ? (
                                            <>
                                                <div className="text-gray-400 line-through text-xs">{Utils.formatCurrency(item.declared_amount)}</div>
                                                <div className="text-blue-600">{Utils.formatCurrency(item.received_amount)}</div>
                                            </>
                                        ) : (
                                            <span className="text-red-500">-{Utils.formatCurrency(item.amount)}</span>
                                        )}
                                    </td>
                                    <td className="p-3 flex justify-center">
                                        {getStatusBadge(item.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ==========================================
// AUTH CONTAINER (LOGIN/REGISTER)
// ==========================================
const AuthContainer = ({ onLoginSuccess }) => {
    const [view, setView] = useState('prompt'); 

    if (view === 'login') return <InlineLoginForm onSuccess={onLoginSuccess} onBack={() => setView('prompt')} switchToRegister={() => setView('register')} />;
    if (view === 'register') return <InlineRegisterForm onBack={() => setView('prompt')} switchToLogin={() => setView('login')} />;

    return (
        <div className="text-center py-16 animate-fade-in">
            <div className="bg-gray-100 p-6 rounded-full mb-6 shadow-inner inline-block"><Lock className="w-10 h-10 text-gray-400" /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Yêu cầu đăng nhập</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Vui lòng đăng nhập để thực hiện giao dịch và xem lịch sử.</p>
            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <button onClick={() => setView('login')} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg flex items-center justify-center"><LogIn className="w-5 h-5 mr-2" />Đăng nhập ngay</button>
                <button onClick={() => setView('register')} className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 flex items-center justify-center"><UserPlus className="w-5 h-5 mr-2" />Đăng ký tài khoản</button>
            </div>
        </div>
    );
};

const InlineLoginForm = ({ onSuccess, onBack, switchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); setLoading(true); setErrorMsg('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setErrorMsg(error.message); setLoading(false); } else { onSuccess(); }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in">
            <button onClick={onBack} className="mb-4 flex items-center text-gray-500 hover:text-gray-800 text-sm"><ChevronLeft className="w-4 h-4 mr-1"/> Quay lại</button>
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-4"><h3 className="text-xl font-bold text-green-600">Đăng Nhập</h3></div>
                {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {errorMsg}</div>}
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                <button disabled={loading} className="w-full bg-green-600 text-white p-2.5 rounded-lg font-bold hover:bg-green-700 flex justify-center items-center">{loading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Đăng Nhập'}</button>
                <p className="text-center text-sm text-gray-600">Chưa có tài khoản? <button type="button" onClick={switchToRegister} className="text-blue-600 hover:underline">Đăng ký ngay</button></p>
            </form>
        </div>
    );
};

const InlineRegisterForm = ({ onBack, switchToLogin }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', character_name: '', zalo_contact: '', server: 'VN_Game' });
    const [msg, setMsg] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault(); setLoading(true); setMsg(null);
        const { error } = await supabase.auth.signUp({
            email: formData.email, password: formData.password,
            options: { data: { character_name: formData.character_name, zalo_contact: formData.zalo_contact, server: formData.server } }
        });
        setLoading(false);
        if (error) setMsg({ type: 'error', text: error.message });
        else { setMsg({ type: 'success', text: 'Đăng ký thành công! Đang chuyển sang đăng nhập...' }); setTimeout(switchToLogin, 2000); }
    };

    return (
        <div className="max-w-md mx-auto animate-fade-in">
            <button onClick={onBack} className="mb-4 flex items-center text-gray-500 hover:text-gray-800 text-sm"><ChevronLeft className="w-4 h-4 mr-1"/> Quay lại</button>
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-center mb-4"><h3 className="text-xl font-bold text-blue-600">Đăng Ký</h3></div>
                {msg && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg.text}</div>}
                <input name="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="password" name="password" placeholder="Mật khẩu" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="grid grid-cols-2 gap-3">
                    <input name="character_name" placeholder="Tên NV" required onChange={e => setFormData({...formData, character_name: e.target.value})} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    <select name="server" onChange={e => setFormData({...formData, server: e.target.value})} className="w-full p-2.5 border rounded-lg bg-white">
                        <option value="VN_Game">VN_Game</option><option value="VN_YenBinh">VN_YenBinh</option><option value="VN_ToiChoi">VN_ToiChoi</option>
                    </select>
                </div>
                <input name="zalo_contact" placeholder="Zalo" required onChange={e => setFormData({...formData, zalo_contact: e.target.value})} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <button disabled={loading} className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center">{loading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Đăng Ký'}</button>
            </form>
        </div>
    );
};

// ==========================================
// CÁC FORM CHỨC NĂNG (REAL SUPABASE)
// ==========================================
const ExchangeForm = () => {
  const [form, setForm] = useState({ telco: '', amount: '', serial: '', code: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg(null); setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('card-proxy', { body: { action: 'submit_card', ...form } });
      if (error || data?.error) throw new Error(error?.message || data?.message || 'Lỗi hệ thống');
      setMsg({ type: 'success', text: `Gửi thẻ thành công! Mã: ${data.request_id}.` });
      setForm({ ...form, serial: '', code: '' });
    } catch (err) { setMsg({ type: 'error', text: err.message }); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <div className="flex justify-between items-center pb-2 border-b"><h3 className="font-bold text-lg flex items-center"><CreditCard className="w-6 h-6 mr-2 text-blue-600"/> Nạp Thẻ</h3></div>
      {msg && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg.text}</div>}
      <div className="grid grid-cols-2 gap-4">
        <select className="p-3 border rounded-lg w-full" required onChange={e => setForm({...form, telco: e.target.value})} value={form.telco}>
            <option value="">Nhà mạng</option><option value="VIETTEL">Viettel</option><option value="VINAPHONE">Vinaphone</option><option value="MOBIFONE">Mobifone</option><option value="GARENA">Garena</option><option value="ZING">Zing</option>
        </select>
        <select className="p-3 border rounded-lg w-full" required onChange={e => setForm({...form, amount: e.target.value})} value={form.amount}>
            <option value="">Mệnh giá</option>{[10000, 20000, 50000, 100000, 200000, 500000].map(v => <option key={v} value={v}>{v.toLocaleString()}</option>)}
        </select>
      </div>
      {form.amount && form.telco && <div className="bg-blue-50 p-3 rounded text-blue-800 text-sm flex justify-between font-bold"><span>Thực nhận:</span><span>{Utils.formatCurrency(Utils.calculateReceived(form.telco, form.amount))}</span></div>}
      <div className="grid grid-cols-2 gap-4">
          <input placeholder="Số Serial" className="p-3 border rounded-lg w-full" required onChange={e => setForm({...form, serial: e.target.value})} value={form.serial} />
          <input placeholder="Mã thẻ" className="p-3 border rounded-lg w-full" required onChange={e => setForm({...form, code: e.target.value})} value={form.code} />
      </div>
      <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center">{loading ? <Loader2 className="animate-spin mr-2"/> : 'NẠP NGAY'}</button>
    </form>
  );
};

const WithdrawForm = ({ balance }) => {
    const [form, setForm] = useState({ bankName: '', accNum: '', accName: '', amount: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleWithdraw = async (e) => {
        e.preventDefault(); setLoading(true); setMsg(null);
        try {
            const { error } = await supabase.rpc('create_withdraw_request', {
                p_amount: parseInt(form.amount), p_bank_name: form.bankName, p_account_number: form.accNum, p_account_name: form.accName
            });
            if (error) throw error;
            setMsg({ type: 'success', text: 'Tạo lệnh rút thành công! Vui lòng chờ xử lý.' });
            setForm({...form, amount: ''});
        } catch (err) { setMsg({ type: 'error', text: err.message }); } 
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleWithdraw} className="space-y-5 animate-fade-in">
             <div className="flex justify-between items-center pb-2 border-b"><h3 className="font-bold text-lg flex items-center"><Wallet className="w-6 h-6 mr-2 text-green-600"/> Rút Tiền</h3><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Min 10k</span></div>
             {msg && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg.text}</div>}
             <select className="w-full p-3 border rounded-lg" required onChange={e => setForm({...form, bankName: e.target.value})} value={form.bankName}>
                 <option value="">Ngân hàng</option><option value="MBBANK">MB Bank</option><option value="MOMO">Momo</option><option value="VIETCOMBANK">Vietcombank</option>
             </select>
             <div className="grid grid-cols-2 gap-4">
                <input placeholder="Số TK" className="p-3 border rounded-lg w-full" required onChange={e => setForm({...form, accNum: e.target.value})} value={form.accNum}/>
                <input placeholder="Tên chủ TK" className="p-3 border rounded-lg w-full uppercase" required onChange={e => setForm({...form, accName: e.target.value.toUpperCase()})} value={form.accName}/>
             </div>
             <div className="relative">
                 <input type="number" placeholder="Số tiền rút" className="p-3 border rounded-lg w-full pl-4" required onChange={e => setForm({...form, amount: e.target.value})} value={form.amount}/>
                 <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-bold">VNĐ</span>
             </div>
             <p className="text-xs text-gray-500">Phí: <strong className="text-red-500">2,000đ</strong> | Tổng trừ: <strong>{form.amount ? Utils.formatCurrency(parseInt(form.amount)+2000) : '0đ'}</strong></p>
             <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex justify-center items-center">{loading ? <Loader2 className="animate-spin mr-2"/> : 'RÚT TIỀN'}</button>
        </form>
    );
};

export default CardPage;