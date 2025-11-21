// 📂 src/pages/CreateListing.jsx
import { useState } from 'react'; // Đã có sẵn
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { addDays } from 'date-fns';

// (Imports Icons... không đổi)
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  TagIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function CreateListing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  
  // 👇 THÊM MỚI 1: State cho Modal Zoom
  const [isZoomed, setIsZoomed] = useState(false);
  
  const [form, setForm] = useState({
    item_name: '',
    price: '',
    description: ''
  });

  // (Hàm handleImageChange và clearImage không đổi)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (file) {
      alert("Vui lòng chọn một file ảnh hợp lệ.");
      setImageFile(null);
      setImagePreview(null);
    }
  };
  
  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    document.getElementById('file-upload').value = null;
  };

  // (Hàm handleSubmit của bạn không đổi)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profile?.is_banned) {
      alert("Tài khoản của bạn đã bị KHÓA do vi phạm quy định. Bạn không thể đăng tin mới.");
      return;
    }
    if (!imageFile) return alert("Vui lòng chọn ảnh vật phẩm!");
    setLoading(true);
    try {
      const limit = profile?.custom_post_limit || 1;
      const { count, error: countError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true }) 
        .eq('user_id', user.id)
        .eq('status', 'active');
      if (countError) throw countError;
      if (count >= limit) {
        alert(`Bạn đã đạt giới hạn đăng tin (${count}/${limit}). Vui lòng xóa bớt tin cũ hoặc liên hệ Admin.`);
        setLoading(false); 
        return; 
      }
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; 
      const filePath = `${user.id}/${fileName}`; 	
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);
      const expiresAt = addDays(new Date(), 3);
      const deleteAt = addDays(new Date(), 4);
      const { error: insertError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          item_name: form.item_name,
          price: parseInt(form.price),
          description: form.description,
          image_url: publicUrl,
          status: 'active',
          expires_at: expiresAt,
          delete_at: deleteAt
        });
      if (insertError) throw insertError;
      alert("Đăng tin thành công!");
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* (Header điều hướng không đổi) */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link 
            to="/cho-troi" 
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
            title="Quay về trang chủ"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Đăng Tin Mới</h1>
        </div>
      </header>

      {/* (Main Content / Form... không đổi) */}
      <main className="max-w-4xl mx-auto p-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full space-y-8">
          
          {/* PHẦN 1: THÔNG TIN VẬT PHẨM (Không đổi) */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Thông tin vật phẩm
            </h2>
            <div className="space-y-4">
              {/* Tên vật phẩm (với Icon) */}
              <div>
                <label htmlFor="item_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên vật phẩm
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    id="item_name"
                    required
                    className="mt-1 w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Kiếm Rồng +15"
                    value={form.item_name}
                    onChange={(e) => setForm({...form, item_name: e.target.value})}
                  />
                </div>
              </div>

              {/* Giá bán (với Icon) */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá mong muốn (VNĐ)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BanknotesIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="number" 
                    id="price"
                    required
                    className="mt-1 w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500000"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                  />
                </div>
              </div>

              {/* Mô tả */}
              {/* <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea 
                  id="description"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Giao dịch tại Lorencia server 1, chỉ số..."
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                ></textarea>
              </div> */}
            </div>
          </div>

          {/* PHẦN 2: HÌNH ẢNH */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Hình ảnh vật phẩm
            </h2>
            
            <div className="mt-2 w-full">
              {imagePreview ? (
                // Nếu ĐÃ CÓ ảnh xem trước
                <div className="relative group">
                  {/* 👇 THAY ĐỔI 2: Thêm <button> bọc ảnh và cursor-zoom-in */}
                  <button 
                    type="button" 
                    onClick={() => setIsZoomed(true)}
                    className="w-full cursor-zoom-in rounded-md"
                  >
                    <img 
                      src={imagePreview} 
                      alt="Xem trước" 
                      className="w-full max-h-96 object-contain rounded-md border border-gray-300 bg-gray-100" 
                    />
                  </button>
                  <button 
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-lg opacity-60 group-hover:opacity-100 transition-opacity z-10"
                    title="Xóa ảnh"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                // (Khung upload... không đổi)
                <label 
                  htmlFor="file-upload" 
                  className="relative flex justify-center w-full h-64 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1 text-center m-auto">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Nhấn để tải ảnh lên
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (Tối đa 5MB)</p>
                  </div>
                </label>
              )}
            </div>
            
            {/* (Input file ẩn... không đổi) */}
            <input 
              id="file-upload"
              name="file-upload"
              type="file" 
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
            
            {imagePreview && (
              <button
                type="button"
                onClick={() => document.getElementById('file-upload').click()}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Đổi ảnh khác
              </button>
            )}
          </div>

          {/* NÚT ĐĂNG TIN (Không đổi) */}
          <div className="pt-6 border-t border-gray-200">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full flex justify-center bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Tin Ngay'}
            </button>
          </div>

        </form>
      </main>

      {/* 👇 THÊM MỚI 3: MODAL ZOOM ẢNH 👇 */}
      {isZoomed && imagePreview && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setIsZoomed(false)} // Click nền mờ để đóng
        >
          {/* Nút đóng (X) ở góc */}
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            title="Đóng"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
          
          {/* Container ảnh */}
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()} // Ngăn click vào ảnh bị đóng modal
          >
            <img 
              src={imagePreview} 
              alt="Zoom ảnh vật phẩm"
              className="block max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
      {/* 👆 KẾT THÚC MODAL ZOOM ẢNH 👆 */}

    </div>
  );
}