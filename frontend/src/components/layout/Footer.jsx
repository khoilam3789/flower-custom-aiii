import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-500 pb-12 pt-12 md:pt-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row justify-between text-white gap-10 lg:gap-8 border-[10px] border-slate-500 rounded-lg">
        
        {/* Branch 1: Logo & Mission */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/4 pr-0 lg:pr-8">
          <div className="flex items-center space-x-4">
            <img src="/images/home/temfooter.png" alt="Dear Cherie Stamp" className="w-24 md:w-28 h-auto object-contain" />
          </div>
          <h2 className="font-['Italianno'] text-4xl md:text-5xl">Dear, Chérie</h2>
          <p className="text-sm font-light leading-relaxed opacity-90">
            Mỗi bó hoa không chỉ là một món quà, mà là một lá thư đầy cảm xúc được gửi đến người thân yêu
          </p>
        </div>

        {/* Branch 2: Contact Info */}
        <div className="flex flex-col space-y-4 w-full lg:w-1/4">
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
            <a href="#" className="font-light hover:underline block">Facebook</a>
            <a href="#" className="font-light hover:underline block">TikTok</a>
          </div>
        </div>

        {/* Branch 3: Quick Links */}
        <div className="flex flex-col space-y-4 w-full lg:w-1/4">
          <h3 className="font-bold text-lg md:text-xl uppercase tracking-wider mb-2">Trang Chủ</h3>
          <Link to="/about" className="font-light hover:underline">Về Chúng Tôi</Link>
          <Link to="/custom-flowers" className="font-light hover:underline">Thiết Kế Túi</Link>
          <Link to="/story" className="font-light hover:underline">Ngôn Ngữ Hoa</Link>
          <Link to="/faq" className="font-light hover:underline">Liên Hệ</Link>
          <Link to="/faq" className="font-light hover:underline">Câu hỏi thường gặp</Link>
          <Link to="/faq" className="font-light hover:underline">Chính sách</Link>
        </div>

        {/* Branch 4: Newsletter & Addr */}
        <div className="flex flex-col space-y-6 w-full lg:w-1/4">
          <h3 className="font-bold text-lg md:text-xl uppercase tracking-wider mb-2">Đăng Ký</h3>
          <p className="font-light text-sm opacity-90 leading-relaxed">
            Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên khi đăng ký bản tin của chúng tôi
          </p>
          <div className="flex w-full">
            <input 
              type="email" 
              placeholder="Email của bạn..." 
              className="px-4 py-2 w-full bg-zinc-300 text-rose-700 placeholder:text-rose-700/60 focus:outline-none rounded-sm"
            />
          </div>
          <p className="font-extralight text-xs mt-4 lg:mt-8 opacity-80">
            10 Xuân Thuỷ, P. Thảo Điền, Quận 2, TP. HCM
          </p>
        </div>

      </div>
    </footer>
  );
}
