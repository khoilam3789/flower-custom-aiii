import { Link } from "react-router-dom";

export default function Home() {
  const flowerLanguages = [
    { name: "Hướng Dương", desc: "Sự trung thành, kiên định & sức sống mãnh liệt", img: "/images/home/huongduong.png" },
    { name: "Cẩm Tú Cầu", desc: "Lòng biết ơn, sự chân thành & lời xin lỗi", img: "/images/home/camtucau.png" },
    { name: "Cúc Đồng Tiền", desc: "Khởi đầu mới & tình yêu thật sự", img: "/images/home/hoadongtien.png" },
    { name: "Mẫu Đơn", desc: "Hạnh phúc, hoàn mỹ & thịnh vượng", img: "/images/home/maudon.png" },
    { name: "Hoa Ly", desc: "Lòng chung thuỷ & cao thượng", img: "/images/home/hoaly.png" },
    { name: "Hoa Sen", desc: "Sự thanh cao, kiên cường và giác ngộ", img: "/images/home/sen.png" },
    { name: "Linh Lan", desc: "Sự trở lại của hạnh phúc", img: "/images/home/linhlan.png" },
  ];

  return (
    <div className="w-full flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-Color-3 flex">
        {/* Left background flower creeping up */}
        <img src="/images/home/leftHerosection.png" alt="Flower decor" className="absolute bottom-0 left-0 h-[50%] md:h-[65%] object-contain z-0 pointer-events-none" />
        
        <div className="w-full flex flex-col md:flex-row items-stretch relative z-10 min-h-[500px]">
          {/* Left Text Box */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20 px-12 md:pl-24 md:pr-16 py-20">
            <h2 className="text-rose-700 text-2xl font-light font-['Geologica'] leading-7 mb-2">Gửi trao cảm xúc qua</h2>
            <h1 className="text-rose-700 text-6xl sm:text-7xl md:text-[80px] lg:text-[100px] font-normal font-['Italiana'] leading-[1] my-4 drop-shadow-sm ml-0 md:ml-10">TÚI HOA</h1>
            <p className="text-Color text-lg md:text-xl font-light font-['Geologica'] leading-7 mb-8 md:mb-16 italic ml-0 md:ml-20">để mang lời thương toả khắp lối</p>
            <div className="flex gap-4 flex-wrap justify-center md:justify-start ml-0 md:ml-32 mt-4 md:mt-0">
              <a href="http://localhost:5173/custom-flowers" className="px-6 py-3 bg-slate-500 text-white rounded-[100px] text-sm font-light font-['Geologica'] transition hover:bg-slate-500/80 uppercase shadow-sm">
                THIẾT KẾ NGAY
              </a>
              <Link to="/about" className="px-6 py-3 bg-Color-3 text-Color border border-slate-500 rounded-[100px] text-sm font-light font-['Geologica'] transition hover:bg-zinc-300 uppercase shadow-sm">
                TÌM HIỂU THÊM
              </Link>
            </div>
          </div>

          {/* Right Image Box (Splits the screen 50/50 with blue) */}
          <div className="md:w-1/2 relative bg-Color-2 flex flex-col justify-center items-center w-full min-h-[400px] overflow-hidden">
            <img src="/images/home/rightHerosection.png" alt="Bouquet" className="w-[80%] md:w-[66%] h-auto object-contain z-0 mt-12 md:mt-12 transform -translate-x-4 md:-translate-x-32" />
            <div className="absolute top-6 md:top-12 right-6 md:right-24 text-white text-3xl md:text-5xl font-normal font-['Italianno'] leading-[1.3] text-right drop-shadow-md z-10">
              Lời muốn nói,<br/>gói trong hoa
            </div>
          </div>
        </div>
      </section>

      {/* Flower Language Ribbon */}
      <section className="w-full">
        <div className="w-full bg-rose-700 py-6 text-center shadow-md">
          <h2 className="text-Color-3 text-2xl font-extrabold font-['Geologica'] leading-7 uppercase">KHÁM PHÁ NGÔN NGỮ CỦA LOÀI HOA</h2>
        </div>
        <div className="bg-white pb-20 pt-12 text-center flex flex-col items-center">
          <p className="text-rose-700 text-base font-light font-['Geologica'] leading-6 mb-16 px-4 max-w-3xl">
            Tại Pháp, trước khi lời yêu kịp cất tiếng, cảm xúc đã được gửi thông qua những đóa hoa
          </p>
          {/* Flower Horizontal Scroll */}
          <div className="w-full max-w-[1280px] mx-auto px-12 md:px-24 mb-16">
            <div className="flex overflow-x-auto gap-x-12 pb-8 scroll-smooth scrollbar-hide snap-x">
              {flowerLanguages.map((f, i) => (
                <div key={i} className="flex-none flex flex-col items-center group cursor-pointer w-32 snap-center">
                  <div className="w-32 h-32 bg-zinc-100 rounded-full shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-slate-300">
                    <img src={f.img} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-slate-500 text-sm font-black font-['Geologica'] leading-5 mt-4 text-center">{f.name}</h3>
                  <p className="text-black text-xs font-thin font-['Geologica'] leading-4 mt-2 text-center whitespace-normal">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <Link to="/story" className="px-8 py-4 bg-slate-500 text-white rounded-[100px] text-lg font-extralight font-['Geologica'] leading-7 transition hover:bg-slate-500/80 inline-block shadow-md uppercase">
            ĐỌC CHI TIẾT NGÔN NGỮ HOA
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-slate-500 py-32 text-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-12 md:px-24 text-center relative z-10">
          <h2 className="text-white text-5xl font-bold font-['Geologica'] leading-[69.60px] mb-24 drop-shadow-md uppercase">GỬI TÂM TƯ CHỈ QUA MỘT CHIẾC TÚI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left Features */}
            <div className="flex flex-col space-y-24 text-right pr-8">
              <div>
                <h3 className="text-white text-3xl font-bold font-['Geologica'] leading-10 mb-4 drop-shadow">DỄ DÀNG MANG THEO</h3>
                <p className="text-white text-xl font-extralight font-['Geologica'] leading-7">Thiết kế giúp cố định bó hoa gọn gàng, rảnh tay hơn khi di chuyển, ăn uống hay tham gia các hoạt động</p>
              </div>
              <div>
                <h3 className="text-white text-3xl font-bold font-['Geologica'] leading-10 mb-4 drop-shadow">BẢO VỆ NHỮNG ĐOÁ HOA</h3>
                <p className="text-white text-xl font-extralight font-['Geologica'] leading-7">Giữ form hoa luôn đẹp, hạn chế dập nát hay xô lệch trong suốt cả ngày</p>
              </div>
            </div>

            {/* Center Image */}
            <div className="flex justify-center relative my-12 md:my-0">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-150 -z-10"></div>
              <img src="/images/home/Gemini_Generated_Image_93he6993he6993he-Photoroom 1.png" alt="Bag feature" className="w-[300px] h-auto object-cover rounded-[30px] shadow-2xl z-10" />
            </div>

            {/* Right Features */}
            <div className="flex flex-col space-y-24 text-left pl-8">
              <div>
                <h3 className="text-white text-3xl font-bold font-['Geologica'] leading-10 mb-4 drop-shadow">TÍNH CÁ NHÂN HOÁ</h3>
                <p className="text-white text-xl font-extralight font-['Geologica'] leading-7">Có thể tuỳ chỉnh theo phong cách, trang phục hoặc dịp sử dụng, biến bó hoa thành một điểm nhấn thời trang</p>
              </div>
              <div>
                <h3 className="text-white text-3xl font-bold font-['Geologica'] leading-10 mb-4 drop-shadow">ĐỂ HOA THAY LỜI MUỐN NÓI</h3>
                <p className="text-white text-xl font-extralight font-['Geologica'] leading-7">Mọi thông điệp đều được gửi đi một cách tinh tế, trọn vẹn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="w-full bg-Color-3 py-24">
        <div className="max-w-[1280px] mx-auto px-12 md:px-24">
          <div className="text-center mb-16">
            <h2 className="text-rose-700 text-6xl font-normal font-['Italianno'] leading-[70.40px]">Dear, Chérie’s Blog</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
            {/* Blog 1 */}
            <div className="bg-red-400 rounded-[30px] overflow-hidden shadow-lg transform transition hover:-translate-y-2 flex flex-col p-8 pb-10">
              <img src="/images/home/1.jpg" className="w-full h-48 object-cover rounded-[15px] opacity-90 mb-6" />
              <div className="text-white flex flex-col flex-grow">
                <span className="text-white text-[10px] font-thin font-['Geologica'] leading-3 mb-4 opacity-80 border border-white/30 px-2 py-1 self-start rounded">12/3/2026</span>
                <h3 className="text-white text-base font-extrabold font-['Geologica'] leading-5 mb-4">Ý nghĩa các loài hoa trong ngày Valentine: Chọn hoa tặng người thương sao cho đúng?</h3>
                <p className="text-white text-xs font-extralight font-['Geologica'] leading-4 opacity-90 mb-6 flex-grow">Valentine không chỉ là dịp để trao đi những bó hoa đẹp, mà còn là cách để gửi gắm những cảm xúc khó nói thành lời. Mỗi loài hoa đều mang trong mình một ý nghĩa riêng - từ tình yêu mãnh liệt, sự dịu dàng, đến những lời hứa thầm lặng. Vì vậy, chọn đúng loại hoa cũng chính là chọn đúng thông điệp bạn muốn gửi đến người thương.</p>
                <Link to="/blog-1" className="text-white text-base font-semibold font-['Geologica'] leading-4 underline underline-offset-4 hover:opacity-80">Đọc chi tiết</Link>
              </div>
            </div>

            {/* Blog 2 */}
            <div className="bg-slate-500 rounded-[30px] overflow-hidden shadow-lg transform transition hover:-translate-y-2 mt-8 md:mt-24 flex flex-col p-8 pb-10">
              <img src="/images/home/2.png" className="w-full h-48 object-cover rounded-[15px] opacity-90 mb-6" />
              <div className="text-white flex flex-col flex-grow">
                <span className="text-white text-[10px] font-thin font-['Geologica'] leading-3 mb-4 opacity-80 border border-white/30 px-2 py-1 self-start rounded">24/2/2026</span>
                <h3 className="text-white text-base font-extrabold font-['Geologica'] leading-5 mb-4">Túi hoa tự thiết kế: Khi việc mang hoa trở thành một trải nghiệm trọn vẹn</h3>
                <p className="text-white text-xs font-extralight font-['Geologica'] leading-4 opacity-90 mb-6 flex-grow">Một bó hoa luôn mang theo những cảm xúc đẹp - đó có thể là lời yêu, sự trân trọng, hay đơn giản là một khoảnh khắc muốn lưu giữ. Nhưng thực tế, việc mang theo một bó hoa trong suốt cả ngày lại không hề dễ dàng như chúng ta tưởng. Những bất tiện đó vô tình làm gián đoạn trải nghiệm vốn dĩ rất lãng mạn.</p>
                <Link to="/blog-2" className="text-white text-base font-semibold font-['Geologica'] leading-4 underline underline-offset-4 hover:opacity-80">Đọc chi tiết</Link>
              </div>
            </div>

            {/* Blog 3 */}
            <div className="bg-red-400 rounded-[30px] overflow-hidden shadow-lg transform transition hover:-translate-y-2 flex flex-col p-8 pb-10">
              <img src="/images/home/3.png" className="w-full h-48 object-cover rounded-[15px] opacity-90 mb-6" />
              <div className="text-white flex flex-col flex-grow">
                <span className="text-white text-[10px] font-thin font-['Geologica'] leading-3 mb-4 opacity-80 border border-white/30 px-2 py-1 self-start rounded">20/12/2026</span>
                <h3 className="text-white text-base font-extrabold font-['Geologica'] leading-5 mb-4">Cách bảo quản hoa tươi: Giữ trọn vẻ đẹp và cảm xúc theo thời gian</h3>
                <p className="text-white text-xs font-extralight font-['Geologica'] leading-4 opacity-90 mb-6 flex-grow">Một bó hoa không chỉ đẹp ở khoảnh khắc được trao đi, mà còn nằm ở cách nó được nâng niu và gìn giữ sau đó. Tuy nhiên, hoa tươi lại rất “mong manh” chỉ cần một vài sai sót nhỏ cũng có thể khiến hoa nhanh héo, mất đi vẻ rạng rỡ ban đầu.<br/><br/>Vì vậy, việc bảo quản đúng cách sẽ giúp bạn kéo dài tuổi thọ của hoa, đồng thời giữ trọn ý nghĩa mà bó hoa mang lại.</p>
                <Link to="/blog-3" className="text-white text-base font-semibold font-['Geologica'] leading-4 underline underline-offset-4 hover:opacity-80">Đọc chi tiết</Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-24">
            <Link to="/blog-1" className="inline-block px-12 py-4 bg-transparent border-2 border-rose-700 text-rose-700 text-lg font-extralight font-['Geologica'] leading-7 rounded-[100px] hover:bg-rose-700 hover:text-white transition uppercase tracking-wider">
              ĐỌC CÁC BÀI VIẾT KHÁC
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="w-full bg-Color-3 pb-32 px-6 relative">
          <div className="max-w-[1280px] mx-auto px-12 md:px-24">
            <h2 className="text-Color-2 text-3xl md:text-4xl font-bold font-['Geologica'] mb-12 drop-shadow-sm uppercase text-left pl-8">ĐÁNH GIÁ TỪ HỘI YÊU HOA</h2>
            
            <div className="flex flex-col space-y-6 max-w-5xl mx-auto">
              {/* Review 1 */}
              <div className="relative w-full max-w-4xl mx-auto mb-10">
                <div className="w-[85%] pr-12 md:pr-20 text-right mb-2">
                  <h4 className="text-rose-700 text-lg md:text-xl font-bold font-['Geologica']">Đỗ Thị Hà - 22 tuổi</h4>
                </div>
                <div className="relative flex items-center justify-start">
                  <div className="bg-[#E5E5E5] rounded-xl p-8 md:p-8 pr-28 md:pr-36 w-[88%] md:w-[85%] shadow-sm">
                    <p className="text-[#444] text-sm md:text-[15px] font-light font-['Geologica'] italic leading-loose text-justify">
                      Túi giữ form hoa rất tốt, nhìn gọn gàng và tinh tế hơn nhiều. Mình mang đi chụp ảnh thấy tổng thể đẹp hơn hẳn, không còn cảm giác cầm bó hoa bị “lạc quẻ” nữa. Quan trọng là bó hoa vẫn giữ được vẻ đẹp ban đầu, nhìn lúc nào cũng chỉn chu.
                    </p>
                  </div>
                  <div className="absolute right-0 md:right-4 flex flex-col items-center">
                    <img src="/images/anhnguoi/1.jpg" className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full object-cover border-[6px] border-[#FBFAF7] shadow-sm mb-2" />
                    <span className="text-rose-700 text-sm md:text-[15px] font-bold font-['Geologica'] mt-1">Sinh viên</span>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="relative w-full max-w-4xl mx-auto mb-10">
                <div className="w-full flex justify-end">
                  <div className="w-[88%] md:w-[85%] pl-12 md:pl-20 text-left mb-2">
                    <h4 className="text-rose-700 text-lg md:text-xl font-bold font-['Geologica']">Trần Thanh Tú - 25 tuổi</h4>
                  </div>
                </div>
                <div className="relative flex items-center justify-end">
                  <div className="bg-[#E5E5E5] rounded-xl p-8 md:p-8 pl-28 md:pl-36 w-[88%] md:w-[85%] shadow-sm">
                    <p className="text-[#444] text-sm md:text-[15px] font-light font-['Geologica'] italic leading-loose text-center">
                      Lần đầu tặng hoa mà thấy thật sự có ý nghĩa. Mình chọn hoa hồng đỏ vì muốn nói điều mà bình thường khó nói thành lời. Lúc trao hoa, thấy người ấy hiểu ngay ý mình mà không cần nói nhiều. Có thêm túi nên mọi thứ gọn gàng, tinh tế hơn với bạn ấy, không cần cầm cả bó vướng víu.
                    </p>
                  </div>
                  <div className="absolute left-0 md:left-4 flex flex-col items-center">
                    <img src="/images/anhnguoi/2.jpg" className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full object-cover border-[6px] border-[#FBFAF7] shadow-sm mb-2" />
                    <span className="text-rose-700 text-sm md:text-[15px] font-bold font-['Geologica'] mt-1">Lập trình viên</span>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="relative w-full max-w-4xl mx-auto mb-10">
                <div className="w-[85%] pr-12 md:pr-20 text-right mb-2">
                  <h4 className="text-rose-700 text-lg md:text-xl font-bold font-['Geologica']">Ngô Thuỳ Linh - 30 tuổi</h4>
                </div>
                <div className="relative flex items-center justify-start">
                  <div className="bg-[#E5E5E5] rounded-xl p-8 md:p-8 pr-28 md:pr-36 w-[88%] md:w-[85%] shadow-sm">
                    <p className="text-[#444] text-sm md:text-[15px] font-light font-['Geologica'] italic leading-loose text-justify">
                      Ban đầu mình chỉ định đặt nhanh một bó hoa thôi, nhưng lúc được tự mình chọn từng loại hoa, màu sắc với ý nghĩa, tự nhiên thấy rất thú vị. Cảm giác như mình đang tự tay “thiết kế” một bó hoa mang đúng thông điệp của mình vậy.
                    </p>
                  </div>
                  <div className="absolute right-0 md:right-4 flex flex-col items-center">
                    <img src="/images/anhnguoi/3.jpg" className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full object-cover border-[6px] border-[#FBFAF7] shadow-sm mb-2" />
                    <span className="text-rose-700 text-sm md:text-[15px] font-bold font-['Geologica'] mt-1">Doanh nhân</span>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </section>

    </div>
  );
}
