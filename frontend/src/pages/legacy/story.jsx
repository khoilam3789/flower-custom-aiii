import { Link } from "react-router-dom";

export default function Story() {
  const peonyColors = [
    { color: "Xanh", icon: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=50&h=50&fit=crop", shadow: "shadow-blue-200", desc: "- sự tươi mát, êm đềm, niềm tin, hy vọng" },
    { color: "Hồng", icon: "https://images.unsplash.com/photo-1549472350-dfd358178122?w=50&h=50&fit=crop", shadow: "shadow-pink-200", desc: "- tình mẫu tử, sự bao dung của lòng mẹ, lòng nhân ái, và sự thấu hiểu." },
    { color: "Đỏ", icon: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=50&h=50&fit=crop", shadow: "shadow-red-300", desc: "- sự may mắn, giàu sang, quyền lực" },
    { color: "Trắng", icon: "https://images.unsplash.com/photo-1490750967868-88cb44cb2ecd?w=50&h=50&fit=crop", shadow: "shadow-slate-200", desc: "- sự tinh khôi, thuần khiết, chân thành, mong cầu hạnh phúc" },
    { color: "Tím", icon: "https://images.unsplash.com/photo-1626065525997-6a1dd32d0c26?w=50&h=50&fit=crop", shadow: "shadow-purple-200", desc: "- sự thủy chung, sắt son" },
    { color: "Vàng", icon: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=50&h=50&fit=crop", shadow: "shadow-yellow-200", desc: "- tuổi thanh xuân diệu kỳ, đam mê, khát vọng" },
  ];

  const exploreMore = [
    "Linh Lan", "Hoa Sen", "Hoa Ly", "Hoa Tulip",
    "Cẩm Tú Cầu", "Hướng Dương", "Cúc Đồng Tiền", "Hoa Hồng"
  ];

  return (
    <div className="w-full flex-col bg-Color-3 pb-24">
      {/* Header Info */}
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 py-16 flex flex-col items-center text-center">
        <div className="mb-8 w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-slate-500/20">
          <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop" alt="Blue Peony" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-6xl md:text-7xl text-rose-700 font-['Italianno'] mb-4 leading-none">Ý nghĩa của hoa mẫu đơn</h1>
        <p className="text-xl md:text-2xl font-light text-black/80 font-['Geologica'] drop-shadow-sm">
          Sự nở rộ của hạnh phúc, hoàn mỹ, thịnh vượng và phú quý
        </p>
      </section>

      {/* The Story Box */}
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 relative z-10">
         {/* Decorative shapes behind */}
         <div className="absolute -top-10 -left-10 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl"></div>
         <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-rose-700/10 rounded-full blur-2xl"></div>
         
         <div className="bg-gradient-to-br from-white via-[#fcf6f8] to-[#f2ecf3] rounded-3xl p-12 md:p-16 shadow-lg border border-red-50 relative">
            {/* Title Tag */}
            <div className="absolute -top-6 left-12 flex">
              <div className="w-4 h-12 bg-rose-700 mr-3"></div>
              <h2 className="text-4xl text-rose-700 font-['Geologica'] flex items-end font-light">Câu chuyện</h2>
            </div>
            
            <p className="text-justify font-light text-black/80 font-['Geologica'] leading-loose mb-10 text-lg mt-6">
              Tương truyền rằng, Trung Quốc ngày xưa chỉ có trong cung của vua chúa mới được trồng loài hoa này, qua những chiếc mũ đội đầu của công chúa, phi tần thời ấy. Ngoài ý nghĩa về sự vương giả, mẫu đơn tại Nhật còn được xem là loài hoa của hạnh phúc gia đình. Trong văn hóa phương Tây, chúng thường được liên kết với sự lãng mạn, thịnh vượng và e thẹn.
            </p>

            <div className="text-center italic font-light font-['Geologica'] space-y-2 text-black/80">
              <p className="font-medium text-rose-700">Bài thơ: Mẫu đơn - 牡丹 (Vương Cốc - 王轂)</p>
              <p>Mẫu đơn yêu diễm loạn nhân tâm,</p>
              <p>Nhất quốc như cuồng bất tích kim.</p>
              <p>Hạt nhược đông viên đào dữ lý,</p>
              <p>Quả thành vô ngữ tự thuỳ âm.</p>
            </div>
         </div>
      </section>

      {/* Colors Section */}
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 mt-24">
         <div className="flex mb-12">
            <div className="w-4 h-12 bg-rose-700 mr-3"></div>
            <h2 className="text-4xl text-rose-700 font-['Geologica'] flex items-end">Các sắc màu của mẫu đơn</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {peonyColors.map((item, index) => (
              <div key={index} className={`flex items-center bg-white rounded-full p-2 pr-6 shadow-lg border border-white/40 shadow hover:scale-[1.02] transition cursor-default ${item.shadow}`}>
                <img src={item.icon} alt={item.color} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                <p className="ml-4 font-light text-black/80 text-sm md:text-base">
                  <span className="font-bold">{item.color} </span> {item.desc}
                </p>
              </div>
            ))}
         </div>
      </section>

      {/* Explore More */}
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 mt-32 text-center">
         <h2 className="text-5xl text-[#598CBC] font-['Italianno'] mb-12">Khám phá thêm về</h2>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {exploreMore.map((fl, index) => (
              <Link to="/story" key={index} className="bg-white/80 py-4 rounded-xl border border-rose-700/30 border-dashed text-black/80 font-bold hover:bg-rose-700 hover:text-white transition shadow-sm hover:shadow-md">
                {fl}
              </Link>
            ))}
         </div>
      </section>
    </div>
  );
}
