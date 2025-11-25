// 📂 src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/solid';

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
      // --- XỬ LÝ LỖI TIẾNG VIỆT ---
      let thongBaoLoi = 'Đăng nhập thất bại: ' + error.message;

      // 1. Trường hợp chưa xác thực Email
      if (error.message.includes("Email not confirmed")) {
        thongBaoLoi = "⚠️ Tài khoản chưa kích hoạt!\n\nVui lòng mở Email (kiểm tra cả mục Spam/Rác) để xác nhận trước khi đăng nhập.";
      } 
      // 2. Trường hợp Sai mật khẩu HOẶC Tài khoản chưa đăng ký (Quan trọng)
      else if (error.message.includes("Invalid login credentials")) {
        thongBaoLoi = "❌ Đăng nhập thất bại!\n\nCó thể do:\n1. Email này chưa được đăng ký.\n2. Hoặc bạn đã nhập sai mật khẩu.\n\nVui lòng kiểm tra lại hoặc nhấn 'Đăng ký ngay'.";
      }

      alert(thongBaoLoi);
      // --- KẾT THÚC XỬ LÝ ---
      
      setLoading(false);
    } else {
      navigate('/cho-troi', { 
        state: { showWelcomeRules: true } 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      
      <Link 
        to="/" 
        title="Quay về trang chủ"
        className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition-colors"
      >
        <HomeIcon className="h-6 w-6 text-gray-700" />
      </Link>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-green-600">Đăng Nhập</h2>
        
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
          className="w-full p-2 border rounded" 
        />
        
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Mật khẩu" 
          required 
          className="w-full p-2 border rounded" 
        />

        <button disabled={loading} type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors">
          {loading ? 'Đang tải...' : 'Đăng Nhập'}
        </button>

        <p className="text-center text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-blue-500 hover:underline">Đăng ký ngay</Link>
        </p>
        
      </form>
    </div>
  );
}