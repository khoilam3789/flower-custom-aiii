import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (res.ok) {
        login(data);
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (_err) {
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

      {/* Login Content Area (No white box, floating directly on background) */}
      <div className="relative z-10 w-full max-w-[550px] flex flex-col items-center mt-[-40px]">
        <h2 className="text-4xl md:text-[45px] font-extrabold text-rose-700 mb-10 drop-shadow-sm uppercase font-['Geologica']">
          ĐĂNG NHẬP
        </h2>
        
        {error && <p className="text-red-600 bg-red-100 px-4 py-2 rounded-lg font-bold mb-4">{error}</p>}
        
        <form className="w-full flex flex-col space-y-5 px-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white px-8 py-3 md:py-4 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white px-8 py-3 md:py-4 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>

          <p className="text-center text-xs md:text-[13px] font-semibold text-black/90 pt-1">
            Chưa có tài khoản? <Link to="/register" className="text-rose-700 hover:underline cursor-pointer">Đăng ký ngay</Link>
          </p>

          <p className="text-center text-xs md:text-[13px] font-semibold italic text-black/90 pt-1">
            Bằng cách nhập email, bạn đồng ý nhận email marketing từ Dear, Chérie
          </p>

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              className="bg-rose-700 text-white font-bold text-lg md:text-xl px-20 py-3 rounded-[100px] hover:bg-rose-800 transition shadow-lg"
            >
              TIẾP TỤC
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
