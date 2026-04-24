import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../api";

const defaultReviewSection = {
  sectionTitle: "ĐÁNH GIÁ TỪ HỘI YÊU HOA",
  reviews: [
    {
      name: "Đỗ Thị Hà",
      age: 22,
      role: "Sinh viên",
      imageUrl: "/images/anhnguoi/1.jpg",
      content:
        "Túi giữ form hoa rất tốt, nhìn gọn gàng và tinh tế hơn nhiều. Mình mang đi chụp ảnh thấy tổng thể đẹp hơn hẳn, không còn cảm giác cầm bó hoa bị lạc quẻ nữa. Quan trọng là bó hoa vẫn giữ được vẻ đẹp ban đầu, nhìn lúc nào cũng chỉn chu."
    },
    {
      name: "Trần Thanh Tú",
      age: 25,
      role: "Lập trình viên",
      imageUrl: "/images/anhnguoi/2.jpg",
      content:
        "Lần đầu tặng hoa mà thấy thật sự có ý nghĩa. Mình chọn hoa hồng đỏ vì muốn nói điều mà bình thường khó nói thành lời. Lúc trao hoa, thấy người ấy hiểu ngay ý mình mà không cần nói nhiều. Có thêm túi nên mọi thứ gọn gàng, tinh tế hơn với bạn ấy, không cần cầm cả bó vướng víu."
    },
    {
      name: "Ngô Thuỳ Linh",
      age: 30,
      role: "Doanh nhân",
      imageUrl: "/images/anhnguoi/3.jpg",
      content:
        "Ban đầu mình chỉ định đặt nhanh một bó hoa thôi, nhưng lúc được tự mình chọn từng loại hoa, màu sắc với ý nghĩa, tự nhiên thấy rất thú vị. Cảm giác như mình đang tự tay thiết kế một bó hoa mang đúng thông điệp của mình vậy."
    }
  ]
};

export default function Home() {
  const flowerSliderRef = useRef(null);
  const [reviewSection, setReviewSection] = useState(defaultReviewSection);

  const [blogs, setBlogs] = useState([]);

  const flowerLanguages = [
    { name: "Hoa Hồng", desc: "Tình yêu, sự lãng mạn và sắc đẹp", img: "/images/home/hoahong.png" },
    { name: "Hoa Ly", desc: "Lòng chung thuỷ & cao thượng", img: "/images/home/hoaly.png" },
    { name: "Hướng Dương", desc: "Sự trung thành, kiên định & sức sống mãnh liệt", img: "/images/home/huongduong.png" },
    { name: "Cẩm Tú Cầu", desc: "Lòng biết ơn, sự chân thành & lời xin lỗi", img: "/images/home/camtucau.png" },
    { name: "Cúc Đồng Tiền", desc: "Khởi đầu mới & tình yêu thật sự", img: "/images/home/hoadongtien.png" },
    { name: "Mẫu Đơn", desc: "Hạnh phúc, hoàn mỹ & thịnh vượng", img: "/images/home/maudon.png" },
    { name: "Hoa Tulip", desc: "Lời tỏ tình tinh tế", img: "/images/home/tulip.png" },
    { name: "Linh Lan", desc: "Sự trở lại của hạnh phúc", img: "/images/home/linhlan.png" },
    { name: "Hoa Sen", desc: "Sự thanh cao, kiên cường và giác ngộ", img: "/images/home/hoasen.png" },
  ];

  const scrollFlowerSlider = (direction) => {
    if (!flowerSliderRef.current) return;
    const amount = direction === "left" ? -360 : 360;
    flowerSliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const loadHomeReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/home-reviews`);
        if (!res.ok) return;

        const data = await res.json();
        const nextReviews = Array.isArray(data?.reviews) ? data.reviews : [];
        if (nextReviews.length === 0) return;

        setReviewSection({
          sectionTitle: data.sectionTitle || defaultReviewSection.sectionTitle,
          reviews: nextReviews
        });
      } catch (_error) {
        // Keep fallback static content when API is unavailable.
      }
    };

    const loadBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs?showOnHome=true&isPublished=true`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.slice(0, 3)); // Display up to 3 blogs
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadHomeReviews();
    loadBlogs();
  }, []);

  return (
    <div className="w-full flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-Color-3 flex">
        {/* Left background flower creeping up */}
        <img src="/images/home/leftHerosection.png" alt="Flower decor" className="absolute bottom-0 left-0 h-[50%] md:h-[65%] object-contain z-0 pointer-events-none" />
        
        <div className="w-full flex flex-col md:flex-row items-stretch relative z-10 min-h-[500px]">
          {/* Left Text Box */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-20 px-6 md:px-12 lg:pl-24 md:pr-16 py-12 md:py-20">
            <h2 className="text-rose-700 text-xl md:text-2xl font-light font-['Geologica'] leading-7 mb-2">Gửi trao cảm xúc qua</h2>
            <h1 className="text-rose-700 text-5xl sm:text-7xl md:text-[80px] lg:text-[100px] font-normal font-['Italiana'] leading-[1] my-4 drop-shadow-sm ml-0 md:ml-10">TÚI HOA</h1>
            <p className="text-Color text-base md:text-xl font-light font-['Geologica'] leading-7 mb-8 md:mb-16 italic ml-0 md:ml-20">để mang lời thương toả khắp lối</p>
            <div className="flex gap-4 flex-wrap justify-center md:justify-start ml-0 md:ml-32 mt-4 md:mt-0">
                    <a href="/custom-flowers" className="px-6 py-3 bg-slate-500 text-white rounded-[100px] text-sm font-light font-['Geologica'] transition hover:bg-slate-500/80 uppercase shadow-sm">
                THIẾT KẾ NGAY
              </a>
              <Link to="/about" className="px-6 py-3 bg-Color-3 text-Color border border-slate-500 rounded-[100px] text-sm font-light font-['Geologica'] transition hover:bg-zinc-300 uppercase shadow-sm">
                TÌM HIỂU THÊM
              </Link>
            </div>
          </div>

          {/* Right Image Box (Splits the screen 50/50 with blue) */}
          <div className="md:w-1/2 relative bg-Color-2 flex flex-col justify-center items-center w-full min-h-[300px] md:min-h-[400px] overflow-hidden">
            <img src="/images/home/rightHerosection.png" alt="Bouquet" className="w-[80%] md:w-[66%] h-auto object-contain z-0 md:mt-12 transform md:-translate-x-32" />
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
          <div className="w-full max-w-[1280px] mx-auto px-2 md:px-10 mb-16">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                type="button"
                aria-label="Kéo sang trái"
                onClick={() => scrollFlowerSlider("left")}
                className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-500 text-white text-2xl leading-none hover:bg-slate-600 transition"
              >
                ‹
              </button>

              <div
                ref={flowerSliderRef}
                className="flex-1 flex overflow-x-auto gap-x-8 md:gap-x-12 pb-8 scroll-smooth scrollbar-hide snap-x"
              >
              {flowerLanguages.map((f, i) => (
                <div key={i} className="flex-none flex flex-col items-center group cursor-pointer w-40 md:w-44 snap-center">
                  <div className="w-40 h-40 md:w-44 md:h-44 bg-zinc-100 rounded-full shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-slate-300">
                    <img src={f.img} alt={f.name} className="w-full h-full object-contain p-2 md:p-3" />
                  </div>
                  <h3 className="text-slate-500 text-base font-black font-['Geologica'] leading-5 mt-4 text-center">{f.name}</h3>
                  <p className="text-black text-sm font-thin font-['Geologica'] leading-5 mt-2 text-center whitespace-normal">{f.desc}</p>
                </div>
              ))}

              </div>

              <button
                type="button"
                aria-label="Kéo sang phải"
                onClick={() => scrollFlowerSlider("right")}
                className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-500 text-white text-2xl leading-none hover:bg-slate-600 transition"
              >
                ›
              </button>
            </div>
          </div>
          <Link to="/story" className="px-8 py-4 bg-slate-500 text-white rounded-[100px] text-lg font-extralight font-['Geologica'] leading-7 transition hover:bg-slate-500/80 inline-block shadow-md uppercase">
            ĐỌC CHI TIẾT NGÔN NGỮ HOA
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-slate-500 py-16 md:py-32 text-white relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 text-center relative z-10">
          <h2 className="text-white text-3xl md:text-5xl font-bold font-['Geologica'] leading-tight md:leading-[69.60px] mb-12 md:mb-24 drop-shadow-md uppercase">GỬI TÂM TƯ CHỈ QUA MỘT CHIẾC TÚI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left Features */}
            <div className="flex flex-col space-y-12 md:space-y-24 text-center md:text-right md:pr-8">
              <div>
                <h3 className="text-white text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold font-['Geologica'] leading-tight md:leading-10 mb-2 md:mb-4 drop-shadow md:whitespace-nowrap">DỄ DÀNG MANG THEO</h3>
                <p className="text-white text-base md:text-xl font-extralight font-['Geologica'] leading-6 md:leading-7">Thiết kế giúp cố định bó hoa gọn gàng, rảnh tay hơn khi di chuyển, ăn uống hay tham gia các hoạt động</p>
              </div>
              <div>
                <h3 className="text-white text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold font-['Geologica'] leading-tight md:leading-10 mb-2 md:mb-4 drop-shadow md:whitespace-nowrap">BẢO VỆ NHỮNG ĐOÁ HOA</h3>
                <p className="text-white text-base md:text-xl font-extralight font-['Geologica'] leading-6 md:leading-7">Giữ form hoa luôn đẹp, hạn chế dập nát hay xô lệch trong suốt cả ngày</p>
              </div>
            </div>

            {/* Center Image */}
            <div className="flex justify-center relative my-8 md:my-0 order-first md:order-none">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-150 -z-10"></div>
              <img src="/images/home/Gemini_Generated_Image_93he6993he6993he-Photoroom 1.png" alt="Bag feature" className="w-[200px] md:w-[300px] h-auto object-cover rounded-[30px] shadow-2xl z-10" />
            </div>

            {/* Right Features */}
            <div className="flex flex-col space-y-12 md:space-y-24 text-center md:text-left md:pl-8">
              <div>
                <h3 className="text-white text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold font-['Geologica'] leading-tight md:leading-10 mb-2 md:mb-4 drop-shadow md:whitespace-nowrap">TÍNH CÁ NHÂN HOÁ</h3>
                <p className="text-white text-base md:text-xl font-extralight font-['Geologica'] leading-6 md:leading-7">Có thể tuỳ chỉnh theo phong cách, trang phục hoặc dịp sử dụng, biến bó hoa thành một điểm nhấn thời trang</p>
              </div>
              <div>
                <h3 className="text-white text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold font-['Geologica'] leading-tight md:leading-10 mb-2 md:mb-4 drop-shadow md:whitespace-nowrap">ĐỂ HOA THAY LỜI MUỐN NÓI</h3>
                <p className="text-white text-base md:text-xl font-extralight font-['Geologica'] leading-6 md:leading-7">Mọi thông điệp đều được gửi đi một cách tinh tế, trọn vẹn</p>
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
            {blogs.map((blog, idx) => (
              <div key={blog._id} className={`${idx % 2 === 0 ? 'bg-red-400' : 'bg-slate-500'} rounded-[30px] overflow-hidden shadow-lg transform transition hover:-translate-y-2 flex flex-col p-8 pb-10 ${idx === 1 ? 'mt-0 md:mt-24' : ''}`}>
                <img src={blog.coverImage} className="w-full h-48 object-cover rounded-[15px] opacity-90 mb-6" alt={blog.title} />
                <div className="text-white flex flex-col flex-grow">
                  <span className="text-white text-[10px] font-thin font-['Geologica'] leading-3 mb-4 opacity-80 border border-white/30 px-2 py-1 self-start rounded">{blog.date}</span>
                  <h3 className="text-white text-base font-extrabold font-['Geologica'] leading-5 mb-4">{blog.title}</h3>
                  <p className="text-white text-xs font-extralight font-['Geologica'] leading-4 opacity-90 mb-6 flex-grow whitespace-pre-line line-clamp-6">{blog.summary}</p>
                  <Link to={`/blog/${blog.slug}`} className="text-white text-base font-semibold font-['Geologica'] leading-4 underline underline-offset-4 hover:opacity-80">Đọc chi tiết</Link>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="col-span-1 md:col-span-3 text-center text-slate-500 py-10 font-['Geologica']">Chưa có bài viết nào</div>
            )}
          </div>
          
          <div className="text-center mt-24">
            <Link to="/story" className="inline-block px-12 py-4 bg-transparent border-2 border-rose-700 text-rose-700 text-lg font-extralight font-['Geologica'] leading-7 rounded-[100px] hover:bg-rose-700 hover:text-white transition uppercase tracking-wider">
              ĐỌC CÁC BÀI VIẾT KHÁC
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="w-full bg-Color-3 pb-32 px-4 md:px-6 relative">
          <div className="max-w-[1280px] mx-auto px-4 md:px-24">
            <h2 className="text-Color-2 text-2xl md:text-4xl font-bold font-['Geologica'] mb-12 drop-shadow-sm uppercase text-center md:text-left md:pl-8">{reviewSection.sectionTitle}</h2>
            
            <div className="flex flex-col space-y-12 md:space-y-6 max-w-5xl mx-auto">
              {reviewSection.reviews.map((review, index) => {
                const isOddLayout = index % 2 === 1;
                const heading = review?.age ? `${review.name} - ${review.age} tuổi` : review.name;

                return (
                  <div key={`${review.name}-${index}`} className={`relative w-full max-w-4xl mx-auto ${index === reviewSection.reviews.length - 1 ? "mb-10" : "mb-16"}`}>
                    <div className={`text-center mb-4 md:w-4/5 ${isOddLayout ? "md:text-left md:ml-auto md:pl-12 lg:pl-20" : "md:text-right md:pr-12 lg:pr-20"}`}>
                      <h4 className="text-rose-700 text-lg md:text-xl font-bold font-['Geologica']">{heading}</h4>
                    </div>

                    <div className={`relative w-full flex flex-col md:flex-row items-center ${isOddLayout ? "md:justify-end" : "md:justify-start"}`}>
                      <div className={`relative z-10 flex flex-col items-center md:absolute md:top-1/2 md:-translate-y-1/2 ${isOddLayout ? "md:left-0 lg:left-4" : "md:right-0 lg:right-4"}`}>
                        <img src={review.imageUrl} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-[4px] border-[#FBFAF7] shadow-sm mb-2" alt={review.name} />
                        <span className="text-rose-700 text-xs md:text-[15px] font-bold font-['Geologica']">{review.role}</span>
                      </div>

                      <div className={`bg-zinc-100/90 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full md:w-4/5 shadow-md -mt-12 md:mt-0 relative z-0 border border-zinc-200/50 ${isOddLayout ? "md:pl-40" : "md:pr-40"}`}>
                        <p className="text-slate-700 text-sm md:text-base font-light font-['Geologica'] italic leading-loose text-justify md:text-left pt-14 md:pt-0">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
         </div>
      </section>

    </div>
  );
}
