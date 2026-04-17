import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/'); // Điều hướng về trang chủ
      } else {
        setError(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  return (
    <div className="relative w-full h-[800px] md:h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden">
      {/* Background Image Area */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/Login/c1a1569b0ba0fa37deb05ef12ace071a53985e5a.png')" }}
      ></div>

      <div className="relative z-10 w-full max-w-[550px] flex flex-col items-center mt-[-40px]">
        <h2 className="text-4xl md:text-[45px] font-extrabold text-rose-700 mb-6 drop-shadow-sm uppercase font-['Geologica']">
          ĐĂNG KÝ
        </h2>
        
        {error && <p className="text-red-600 bg-red-100 px-4 py-2 rounded-lg font-bold mb-4">{error}</p>}
        
        <form className="w-full flex flex-col space-y-4 px-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Họ và Tên</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white px-8 py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white px-8 py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Mật khẩu</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white px-8 py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white px-8 py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>

          <p className="text-center text-xs font-semibold text-black/90 pt-1">
            Đã có tài khoản? <Link to="/login" className="text-rose-700 hover:underline">Đăng nhập</Link>
          </p>

          <div className="pt-4 flex justify-center">
            <button 
              type="submit"
              className="bg-rose-700 text-white font-bold text-lg px-20 py-3 rounded-[100px] hover:bg-rose-800 transition shadow-lg"
            >
              TẠO TÀI KHOẢN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
