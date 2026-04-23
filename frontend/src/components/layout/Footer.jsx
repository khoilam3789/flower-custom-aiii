import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

export default function Footer() {
  const { user } = useAuth();
  
  const [emailSub, setEmailSub] = useState("");
  
  useEffect(() => {
    if (user?.email) {
      setEmailSub(user.email);
    }
  }, [user]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    alert("Đăng ký nhận bản tin thành công! Cám ơn bạn đã quan tâm.");
    setEmailSub("");
  };

  return (
    <footer id="contact-footer" className="w-full bg-slate-500 pb-12 pt-12 md:pt-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-white gap-10 lg:gap-8 border-[10px] border-slate-500 rounded-lg">
        
        {/* Branch 1: Logo & Mission */}
        <div className="flex flex-col space-y-6 pr-0 lg:pr-8">
          <div className="flex items-center space-x-4">
            <img src="/images/home/temfooter.png" alt="Dear Cherie Stamp" className="w-24 md:w-28 h-auto object-contain" />
          </div>
          <h2 className="font-['Italianno'] text-4xl md:text-5xl">Dear, Chérie</h2>
          <p className="text-sm font-light leading-relaxed opacity-90">
            Mỗi bó hoa không chỉ là một món quà, mà là một lá thư đầy cảm xúc được gửi đến người thân yêu
          </p>
        </div>

        {/* Branch 2: Contact Info */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg md:text-xl uppercase tracking-wider mb-2">Thông Tin Liên Hệ</h3>
          <div>
            <p className="text-rose-700 font-bold text-sm">HOTLINE:</p>
            <p className="font-light">1900-6868</p>
          </div>
          <div>
            <p className="text-rose-700 font-bold text-sm">EMAIL:</p>
            <a href="mailto:dearcherie.info@gmail.com" className="font-bold underline hover:opacity-80 transition break-all">dearcherie.info@gmail.com</a>
          </div>
          <div>
            <p className="text-rose-700 font-bold text-sm">KẾT NỐI:</p>
            <a href="https://www.facebook.com/share/1B3jHU9noi/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="font-light hover:underline block">Facebook</a>
            <a href="https://www.threads.com/@dearcherie_flower_bag?igshid=NTc4MTIwNjQ2YQ==" target="_blank" rel="noreferrer" className="font-light hover:underline block">Threads</a>
          </div>
        </div>

        {/* Branch 3: Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg md:text-xl uppercase tracking-wider mb-2">Trang Chủ</h3>
          <Link to="/about" onClick={() => window.scrollTo(0,0)} className="font-light hover:underline">Về Chúng Tôi</Link>
          <Link to="/custom-flowers" onClick={() => window.scrollTo(0,0)} className="font-light hover:underline">Thiết Kế Túi</Link>
          <Link to="/story" onClick={() => window.scrollTo(0,0)} className="font-light hover:underline">Ngôn Ngữ Hoa</Link>
          <a href="#contact-footer" className="font-light hover:underline">Liên Hệ</a>
          <Link to="/faq" onClick={() => window.scrollTo(0,0)} className="font-light hover:underline">Câu hỏi thường gặp</Link>
          <Link to="/faq" onClick={() => window.scrollTo(0,0)} className="font-light hover:underline">Chính sách</Link>
        </div>

        {/* Branch 4: Newsletter & Addr */}
        <div className="flex flex-col space-y-6">
          <h3 className="font-bold text-lg md:text-xl uppercase tracking-wider mb-2">Đăng Ký</h3>
          <p className="font-light text-sm opacity-90 leading-relaxed">
            Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên khi đăng ký bản tin của chúng tôi
          </p>
          <form onSubmit={handleSubscribe} className="flex w-full overflow-hidden rounded-sm">
            <input 
              type="email" 
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="Email của bạn..." 
              required
              className="px-4 py-3 w-full bg-zinc-300 text-rose-700 placeholder:text-rose-700/60 focus:outline-none"
            />
            <button type="submit" className="bg-rose-700 text-white font-bold px-5 hover:bg-rose-800 transition">
              GỬI
            </button>
          </form>
          <p className="font-extralight text-xs mt-4 lg:mt-8 opacity-80">
            10 Xuân Thuỷ, P. Thảo Điền, Quận 2, TP. HCM
          </p>
        </div>

      </div>
    </footer>
  );
}
