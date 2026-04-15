export default function Login() {
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
        
        <form className="w-full flex flex-col space-y-5 px-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Email</label>
            <input 
              type="email" 
              className="w-full bg-white px-8 py-3 md:py-4 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-black font-bold text-[13px] mb-2 pl-4">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full bg-white px-8 py-3 md:py-4 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-2 focus:ring-rose-700/50"
            />
          </div>

          <p className="text-center text-xs md:text-[13px] font-semibold italic text-black/90 pt-2">
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
