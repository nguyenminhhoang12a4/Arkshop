// 📂 src/pages/Register.jsx
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
// 👇 1. Import icon Home
import { HomeIcon } from '@heroicons/react/24/solid';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', character_name: '', zalo_contact: '', server: 'VN_Game'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Gửi thông tin đăng ký kèm Metadata
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { // QUAN TRỌNG: Dữ liệu này sẽ được Trigger dùng để tạo Profile
          character_name: formData.character_name,
          zalo_contact: formData.zalo_contact,
          server: formData.server,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Đăng ký thành công! Hãy kiểm tra email để xác thực (nếu bật Confirm Email) hoặc Đăng nhập ngay.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    // 👇 2. Thêm 'relative' vào div cha
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      
      {/* 👇 3. THÊM NÚT HOME VÀO ĐÂY 👇 */}
      <Link 
        to="/" 
        title="Quay về trang chủ"
        className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition-colors"
      >
        <HomeIcon className="h-6 w-6 text-gray-700" />
      </Link>
      {/* 👆 KẾT THÚC NÚT HOME 👆 */}

      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-600">Đăng Ký Chợ Trời</h2>
        
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} 
          className="w-full p-2 border rounded" />
        
        <input type="password" name="password" placeholder="Mật khẩu" required onChange={handleChange} 
          className="w-full p-2 border rounded" />

        <div className="grid grid-cols-2 gap-2">
          <input type="text" name="character_name" placeholder="Tên Nhân Vật" required onChange={handleChange} 
            className="w-full p-2 border rounded" />
          
          <select name="server" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="VN_Game">VN_Game</option>
            <option value="VN_YenBinh">VN_YenBinh</option>
            <option value="VN_ToiChoi">VN_ToiChoi</option>
          </select>
        </div>

        <input type="text" name="zalo_contact" placeholder="Số Zalo liên hệ" required onChange={handleChange} 
          className="w-full p-2 border rounded" />

        <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {loading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>

        <p className="text-center text-sm">
          Đã có tài khoản? <Link to="/login" className="text-blue-500">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}