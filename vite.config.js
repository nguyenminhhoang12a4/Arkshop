// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 1. Import thư viện vừa cài
import obfuscator from 'rollup-plugin-javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Kiểm tra xem đang chạy lệnh 'build' hay 'dev'
  const isBuild = command === 'build';

  return {
    plugins: [
      react(),
      // 2. Cấu hình Obfuscator (Chỉ chạy khi Build sản phẩm)
      isBuild && obfuscator({
        options: {
          compact: true, // Nén code thành 1 dòng
          controlFlowFlattening: true, // Làm phẳng luồng code (if/else)
          controlFlowFlatteningThreshold: 1,
          numbersToExpressions: true, // Chuyển số thành biểu thức tính toán
          simplify: true,
          stringArray: true, // Mã hóa chuỗi
          stringArrayEncoding: ['base64'], 
          splitStrings: true, 
          
          // --- Chống Debug & F12 ---
          debugProtection: true, // Treo trình duyệt nếu mở F12
          debugProtectionInterval: 4000,
          disableConsoleOutput: true, // Tắt console.log
          
          // --- Đổi tên biến khó đọc ---
          identifierNamesGenerator: 'hexadecimal', 
          deadCodeInjection: true, // Chèn code giả
          deadCodeInjectionThreshold: 0.2,
        },
      }),
    ],
    build: {
      // 3. QUAN TRỌNG: Tắt bản đồ code (Source Map)
      // Nếu để true, người ta có thể dịch ngược lại code gốc dễ dàng.
      sourcemap: false, 
    },
  };
});