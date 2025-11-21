// 📂 src/main.jsx (hoặc index.jsx)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Quan trọng: Import BrowserRouter
import App from './App';
import './index.css'; // File css tailwind của bạn

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Bắt buộc phải có BrowserRouter ở đây
      vì App.jsx đã gộp của chúng ta đang dùng Routes 
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);