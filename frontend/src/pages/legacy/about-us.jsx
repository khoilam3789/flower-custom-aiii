export default function AboutUs() {
  return (
    <div className="w-full flex-col bg-Color-3">
      {/* Intro Section */}
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 flex flex-col space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-rose-700 font-['Gowun_Batang'] uppercase drop-shadow-sm">VỀ CHÚNG TÔI</h1>
          <p className="text-xl font-light leading-relaxed text-justify font-['Geologica']">
            <span className="font-bold">“Dear Chérie”</span> được lấy cảm hứng từ sự kết hợp giữa 
            <span className="font-bold"> “Dear”</span> thường xuất hiện ở đầu những lá thư như một lời chào đầy trân trọng và gần gũi trong khi 
            <span className="font-bold"> “Chérie”</span> mang nghĩa “người yêu dấu” hay “người thân thương” trong tiếng Pháp, được dùng để gọi những người mà ta dành nhiều tình cảm đặc biệt.
          </p>
          <p className="text-xl font-light leading-relaxed text-justify font-['Geologica']">
            <span className="font-bold">Dear Chérie</span> được tạo ra với mong muốn rằng mỗi bó hoa không chỉ là một món quà mà như 
            <span className="font-bold"> một lá thư đầy cảm xúc được gửi đến người thân yêu</span>. Bạn có thể tự tay lựa chọn từng loài hoa dựa trên ý nghĩa biểu tượng của chúng, từng loại túi đựng tiện dụng để người nhận có thể nhẹ nhàng mang theo bên mình và viết nên những tấm thiệp mang những câu chuyện riêng.
          </p>
        </div>
        <div className="md:w-1/2 relative flex justify-center">
          <div className="absolute top-10 right-10 w-full h-full bg-slate-500/20 rounded-[50px] -z-10"></div>
          <img 
            src="/images/AboutUS/hero1.png" 
            className="w-full max-w-md h-[400px] md:h-[600px] object-cover rounded-[50px] shadow-xl"
          />
        </div>
      </section>

      {/* Mission Vision Values Section */}
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 pb-24">
        <div className="bg-rose-700 rounded-[50px] p-12 md:p-16 relative shadow-lg overflow-visible">
          {/* Flower decorative img top left */}
          <img
            src="/images/AboutUS/source_snapedit_1775923480189.png"
            alt="Flower decoration"
            className="absolute -top-8 -left-2 md:-top-12 md:left-0 w-48 md:w-64 lg:w-72 h-auto object-contain z-10"
          />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-block px-8 py-2 bg-slate-500 text-white rounded-full text-xl mb-6 shadow">
              Tại Dear, Chérie
            </div>
            <h2 className="relative z-30 text-4xl md:text-5xl text-white font-['Italianno'] text-center max-w-4xl leading-tight mb-16 drop-shadow">
              Chúng tôi giúp bạn gửi những tâm tư của chính mình qua ngôn ngữ của loài hoa.
            </h2>

            <div className="w-full flex justify-center">
              <div className="w-full max-w-5xl flex flex-col gap-6">
                {/* Mission */}
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  <div className="bg-slate-500 text-white font-bold text-xl md:text-2xl w-full md:w-48 h-12 md:h-auto shrink-0 flex items-center justify-center rounded-[32px] shadow-md border border-white/40 px-4">SỨ MỆNH</div>
                  <div className="bg-Color-3 text-black text-sm md:text-base p-5 md:p-6 min-h-16 flex-1 rounded-[32px] shadow-inner font-light leading-relaxed text-center md:text-left">
                    Trở thành <b>nền tảng kỹ thuật số hàng đầu trong lĩnh vực quà tặng hoa cá nhân hóa</b> trong năm đầu tiên hoạt động, để lại ấn tượng lâu dài cho khách hàng thông qua sự <b>sáng tạo, kết nối cảm xúc</b> và những <b>trải nghiệm độc đáo</b>
                  </div>
                </div>

                {/* Vision */}
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  <div className="bg-slate-500 text-white font-bold text-xl md:text-2xl w-full md:w-48 h-12 md:h-auto shrink-0 flex items-center justify-center rounded-[32px] shadow-md border border-white/40 px-4">TẦM NHÌN</div>
                  <div className="bg-Color-3 text-black text-sm md:text-base p-5 md:p-6 min-h-16 flex-1 rounded-[32px] shadow-inner font-light leading-relaxed text-center md:text-left">
                    Đặt <b>cảm xúc và những câu chuyện cá nhân vào trung tâm của mỗi bó hoa</b> bằng cách cho phép khách hàng tự do lựa chọn từng chi tiết theo ý nghĩa riêng của họ.
                  </div>
                </div>

                {/* Values */}
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  <div className="bg-slate-500 text-white font-bold text-xl md:text-2xl w-full md:w-48 h-12 md:h-auto shrink-0 flex items-center justify-center rounded-[32px] shadow-md border border-white/40 px-4">GIÁ TRỊ</div>
                  <div className="bg-Color-3 text-black text-sm md:text-base p-5 md:p-6 min-h-16 flex-1 rounded-[32px] shadow-inner font-light leading-relaxed text-center md:text-left">
                    <b>Mỗi sản phẩm đều mang một bản sắc và câu chuyện độc đáo</b>, được lưu giữ qua từng bước trong quá trình lựa chọn của khách hàng.<br/> <b>Khuyến khích khách hàng tự do thiết kế</b> từng chi tiết của bó hoa dựa trên câu chuyện và ý nghĩa biểu tượng của riêng họ.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 pb-32">
        <h2 className="text-4xl font-bold text-center mb-16 uppercase tracking-widest text-[#1E1E1E]">OUR TEAM</h2>
        
        <div className="relative w-full max-w-5xl mx-auto flex justify-center">
          <img 
            src="/images/AboutUS/OUR TEAM.png" 
            alt="Dear Cherie Team" 
            className="w-full h-auto object-contain"
          />
          
          <div className="absolute inset-0 pointer-events-none">
             {/* ROW 1 */}
             <div className="absolute top-[49%] left-[14.5%] -translate-x-1/2 flex justify-center w-[30%]">
                <span className="font-bold text-[9px] sm:text-[11px] md:text-sm lg:text-[17px] uppercase tracking-widest text-center text-zinc-900 drop-shadow-sm leading-tight">Trần Thiên Phúc</span>
             </div>
             <div className="absolute top-[49%] left-[50%] -translate-x-1/2 flex justify-center w-[30%]">
                <span className="font-bold text-[9px] sm:text-[11px] md:text-sm lg:text-[17px] uppercase tracking-widest text-center text-zinc-900 drop-shadow-sm leading-tight">Lê Thị Phương Vi</span>
             </div>
             <div className="absolute top-[49%] left-[85.5%] -translate-x-1/2 flex justify-center w-[30%]">
                <span className="font-bold text-[9px] sm:text-[11px] md:text-sm lg:text-[17px] uppercase tracking-widest text-center text-zinc-900 drop-shadow-sm leading-tight">Nguyễn Thị Lê Na</span>
             </div>

             {/* ROW 2 */}
             <div className="absolute top-[98%] md:top-[99%] left-[14.5%] -translate-x-1/2 flex justify-center w-[30%]">
                <span className="font-bold text-[9px] sm:text-[11px] md:text-sm lg:text-[17px] uppercase tracking-widest text-center text-zinc-900 drop-shadow-sm leading-tight">Trần Phối Kim</span>
             </div>
             <div className="absolute top-[98%] md:top-[99%] left-[50%] -translate-x-1/2 flex justify-center w-[30%]">
                <span className="font-bold text-[9px] sm:text-[11px] md:text-sm lg:text-[17px] uppercase tracking-widest text-center text-zinc-900 drop-shadow-sm leading-tight">Lý Tú Trân</span>
             </div>
             <div className="absolute top-[98%] md:top-[99%] left-[85.5%] -translate-x-1/2 flex justify-center w-[30%]">
                <span className="font-bold text-[9px] sm:text-[11px] md:text-sm lg:text-[17px] uppercase tracking-widest text-center text-zinc-900 drop-shadow-sm leading-tight">Phan Minh Thúy Trâm</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
