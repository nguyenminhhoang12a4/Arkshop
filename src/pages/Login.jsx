// 📂 src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/solid'; // Icon cho nút Home

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Đăng nhập thất bại: ' + error.message);
      setLoading(false); // Dừng loading nếu có lỗi
    } else {
      // Đăng nhập thành công:
      // 1. Điều hướng đến '/cho-troi'
      // 2. Gửi tín hiệu 'showWelcomeRules' để trang Chợ Trời mở Modal
      navigate('/cho-troi', { 
        state: { showWelcomeRules: true } 
      });
      // Component sẽ bị unmount, không cần gọi setLoading(false) ở đây
    }
  };

  return (
    // Thêm 'relative' để định vị nút Home
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      
      {/* NÚT HOME (Phương án 2) */}
      <Link 
        to="/" 
        title="Quay về trang chủ"
        className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition-colors"
      >
        <HomeIcon className="h-6 w-6 text-gray-700" />
      </Link>
      {/* KẾT THÚC NÚT HOME */}

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-green-600">Đăng Nhập</h2>
        
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" required className="w-full p-2 border rounded" />
        
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
          placeholder="Mật khẩu" required className="w-full p-2 border rounded" />

        <button disabled={loading} type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {loading ? 'Đang tải...' : 'Đăng Nhập'}
        </button>

        <p className="text-center text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-blue-500">Đăng ký ngay</Link>
        </p>
        
      </form>
    </div>
  );
}