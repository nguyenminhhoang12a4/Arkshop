import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { HomeIcon, BanknotesIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

export default function CardPage() {
  const [activeTab, setActiveTab] = useState('deposit'); // deposit, withdraw, history
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Form States
  const [cardForm, setCardForm] = useState({ telco: 'VIETTEL', amount: '10000', serial: '', code: '' });
  const [withdrawForm, setWithdrawForm] = useState({ bank_name: '', account_number: '', account_name: '', amount: '' });

  // History Data
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchUserAndBalance();
  }, []);

  useEffect(() => {
    if (user) fetchHistory();
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
    if (!user) return;
    let data = [];
    if (activeTab === 'history') {
      // Lấy cả lịch sử nạp và rút (đơn giản hoá: lấy 20 giao dịch gần nhất mỗi loại)
      const { data: cards } = await supabase.from('card_transactions').select('*').order('created_at', { ascending: false }).limit(20);
      const { data: withdraws } = await supabase.from('withdraw_requests').select('*').order('created_at', { ascending: false }).limit(20);
      
      // Gộp lại để hiển thị (hoặc bạn có thể tách 2 bảng riêng)
      setHistory({ cards: cards || [], withdraws: withdraws || [] });
    }
  };

  // --- XỬ LÝ NẠP THẺ ---
  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi Edge Function thay vì gọi trực tiếp doithe1s
      const { data, error } = await supabase.functions.invoke('card-proxy', {
        body: { ...cardForm, user_id: user.id }
      });

      if (error) throw error;

      if (data.status == 99) {
        alert("Đã gửi thẻ! Vui lòng đợi hệ thống xử lý trong giây lát.");
        setCardForm({ ...cardForm, serial: '', code: '' }); // Reset form
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
    
    // Validate số tiền (phải > 10k chẳng hạn)
    if (parseInt(withdrawForm.amount) < 10000) {
        alert("Số tiền rút tối thiểu là 10.000đ");
        setLoading(false);
        return;
    }

    try {
        // Gọi RPC function an toàn trong Database
        const { data, error } = await supabase.rpc('create_withdraw_request', {
            p_amount: parseInt(withdrawForm.amount),
            p_bank_name: withdrawForm.bank_name,
            p_account_number: withdrawForm.account_number,
            p_account_name: withdrawForm.account_name
        });

        if (error) throw error;
        
        alert("Tạo lệnh rút thành công! Admin sẽ duyệt vào lúc 11h hoặc 17h.");
        setWithdrawForm({ bank_name: '', account_number: '', account_name: '', amount: '' });
        fetchUserAndBalance(); // Cập nhật lại số dư hiển thị
    } catch (err) {
        alert("Lỗi: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
       <Link to="/" className="absolute top-4 left-4 p-2 bg-white rounded-full shadow hover:bg-gray-200">
        <HomeIcon className="h-6 w-6 text-gray-700" />
      </Link>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-10">
        
        {/* Header Số dư */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
            <h2 className="text-xl font-bold">VÍ CỦA BẠN</h2>
            <div className="text-4xl font-extrabold mt-2">{formatCurrency(balance)}</div>
            <p className="text-sm opacity-80 mt-1">ID: {user?.email}</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b">
            <button onClick={() => setActiveTab('deposit')} className={`flex-1 p-4 font-bold ${activeTab === 'deposit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                NẠP THẺ (AUTO)
            </button>
            <button onClick={() => setActiveTab('withdraw')} className={`flex-1 p-4 font-bold ${activeTab === 'withdraw' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}>
                RÚT TIỀN
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 p-4 font-bold ${activeTab === 'history' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}>
                LỊCH SỬ
            </button>
        </div>

        <div className="p-6">
            {/* --- TAB NẠP THẺ --- */}
            {activeTab === 'deposit' && (
                <form onSubmit={handleCardSubmit} className="space-y-4 max-w-lg mx-auto">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="text-sm text-yellow-700">
                            <strong>Lưu ý:</strong> <br/>
                            - Garena: Nhận <strong>85%</strong> mệnh giá.<br/>
                            - Viettel/Mobi/Vina...: Nhận <strong>80%</strong> mệnh giá.<br/>
                            - Chọn sai mệnh giá sẽ bị phạt theo quy định nhà mạng.
                        </p>
                    </div>

                    <select className="w-full p-3 border rounded" value={cardForm.telco} onChange={e => setCardForm({...cardForm, telco: e.target.value})}>
                        <option value="VIETTEL">Viettel</option>
                        <option value="MOBIFONE">Mobifone</option>
                        <option value="VINAPHONE">Vinaphone</option>
                        <option value="GARENA">Garena (Zing)</option>
                        <option value="GATE">Gate</option>
                    </select>

                    <select className="w-full p-3 border rounded" value={cardForm.amount} onChange={e => setCardForm({...cardForm, amount: e.target.value})}>
                        <option value="10000">10.000 đ</option>
                        <option value="20000">20.000 đ</option>
                        <option value="50000">50.000 đ</option>
                        <option value="100000">100.000 đ</option>
                        <option value="200000">200.000 đ</option>
                        <option value="500000">500.000 đ</option>
                    </select>

                    <input type="text" placeholder="Mã thẻ (Code)" required className="w-full p-3 border rounded" 
                        value={cardForm.code} onChange={e => setCardForm({...cardForm, code: e.target.value})} />
                    
                    <input type="text" placeholder="Số Serial" required className="w-full p-3 border rounded" 
                        value={cardForm.serial} onChange={e => setCardForm({...cardForm, serial: e.target.value})} />

                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded shadow">
                        {loading ? 'Đang xử lý...' : 'NẠP NGAY'}
                    </button>
                </form>
            )}

            {/* --- TAB RÚT TIỀN --- */}
            {activeTab === 'withdraw' && (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4 max-w-lg mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <p className="text-sm text-red-700">
                            Phí rút tiền cố định: <strong>2.000đ / lần</strong>.<br/>
                            Ví dụ rút 100k, tài khoản bị trừ 102k.<br/>
                            Xử lý vào <strong>11h00</strong> và <strong>17h00</strong> hàng ngày.
                        </p>
                    </div>

                    <input type="text" placeholder="Tên Ngân Hàng (VD: Vietcombank, Momo...)" required 
                        className="w-full p-3 border rounded"
                        value={withdrawForm.bank_name} onChange={e => setWithdrawForm({...withdrawForm, bank_name: e.target.value})} />

                    <input type="text" placeholder="Số Tài Khoản" required 
                        className="w-full p-3 border rounded"
                        value={withdrawForm.account_number} onChange={e => setWithdrawForm({...withdrawForm, account_number: e.target.value})} />

                    <input type="text" placeholder="Tên Chủ Tài Khoản (Viết Hoa Không Dấu)" required 
                        className="w-full p-3 border rounded"
                        value={withdrawForm.account_name} onChange={e => setWithdrawForm({...withdrawForm, account_name: e.target.value.toUpperCase()})} />

                    <div className="relative">
                        <input type="number" placeholder="Số tiền cần rút" required 
                            className="w-full p-3 border rounded pr-12"
                            value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} />
                        <span className="absolute right-4 top-3 text-gray-500">VNĐ</span>
                    </div>

                    <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded shadow">
                        {loading ? 'Đang xử lý...' : 'TẠO LỆNH RÚT'}
                    </button>
                </form>
            )}

            {/* --- TAB LỊCH SỬ --- */}
            {activeTab === 'history' && history.cards && (
                <div className="space-y-8">
                    <div>
                        <h3 className="font-bold text-lg mb-2 text-blue-600">Lịch Sử Nạp Thẻ</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Thời gian</th>
                                        <th className="px-4 py-2">Loại</th>
                                        <th className="px-4 py-2">Mệnh giá</th>
                                        <th className="px-4 py-2">Thực nhận</th>
                                        <th className="px-4 py-2">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.cards.map(item => (
                                        <tr key={item.id} className="bg-white border-b">
                                            <td className="px-4 py-2">{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                                            <td className="px-4 py-2">{item.telco}</td>
                                            <td className="px-4 py-2">{formatCurrency(item.declared_amount)}</td>
                                            <td className="px-4 py-2 font-bold text-green-600">
                                                {item.received_amount > 0 ? formatCurrency(item.received_amount) : '-'}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    item.status === 'success' ? 'bg-green-100 text-green-800' : 
                                                    item.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                                {item.message && <div className="text-xs text-red-500">{item.message}</div>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2 text-red-600">Lịch Sử Rút Tiền</h3>
                         <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Thời gian</th>
                                        <th className="px-4 py-2">Ngân hàng</th>
                                        <th className="px-4 py-2">Số tiền rút</th>
                                        <th className="px-4 py-2">Phí</th>
                                        <th className="px-4 py-2">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.withdraws.map(item => (
                                        <tr key={item.id} className="bg-white border-b">
                                            <td className="px-4 py-2">{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                                            <td className="px-4 py-2">{item.bank_name} <br/> <span className="text-xs">{item.account_number}</span></td>
                                            <td className="px-4 py-2 font-bold">{formatCurrency(item.amount)}</td>
                                            <td className="px-4 py-2">{formatCurrency(item.fee)}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                    item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.status === 'completed' ? 'Thành công' : 
                                                     item.status === 'rejected' ? 'Bị từ chối' : 'Đang chờ'}
                                                </span>
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
  );
}