import { Link } from "react-router-dom";

const bagRows = [
  {
    title: "Túi Petalé",
    bgClass: "bg-[#F9EEEC]",
    cards: [
      "/images/bag/1.png",
      "/images/bag/2.png",
      "/images/bag/3.png"
    ]
  },
  {
    title: "Túi Blooming Heart",
    bgClass: "bg-white",
    cards: [
      "/images/bag/4.png",
      "/images/bag/5.png",
      "/images/bag/6.png"
    ]
  },
  {
    title: "Túi La vie en rose",
    bgClass: "bg-[#F9EEEC]",
    cards: [
      "/images/bag/7.png",
      "/images/bag/8.png",
      "/images/bag/9.png"
    ]
  }
];

export default function BagGalleryPage() {
  return (
    <div className="w-full bg-Color-3 text-[#1E1E1E]">
      <div className="mx-auto w-full max-w-[1440px] bg-[#FBFAF7]">
        <header className="relative border-b border-[#D9D9D9] bg-[#FBFAF7] px-4 sm:px-8 lg:px-10">
          <div className="flex h-[92px] items-center justify-between gap-4">
            <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[12px] lg:text-[14px] font-medium font-['Geologica'] text-[#AF2E38] whitespace-nowrap">
              <Link to="/" className="hover:opacity-80">Trang Chủ</Link>
              <Link to="/about" className="hover:opacity-80">Về Chúng Tôi</Link>
              <Link to="/custom-bags" className="hover:opacity-80">Thiết Kế Túi</Link>
            </nav>

            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-[#598CBC] text-4xl sm:text-5xl lg:text-6xl font-normal font-['Italianno'] leading-none">
                Dear, Chérie
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[12px] lg:text-[14px] font-medium font-['Geologica'] text-[#AF2E38] whitespace-nowrap ml-auto">
              <Link to="/story" className="hover:opacity-80">Ngôn Ngữ Hoa</Link>
              <a href="#contact-footer" className="hover:opacity-80">Liên Hệ</a>
            </nav>

            <div className="ml-auto flex items-center gap-3 md:gap-4 text-[#1E1E1E]">
              <button aria-label="Tài khoản" className="p-1">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#1E1E1E] text-[11px] font-semibold">◔</span>
              </button>
              <button aria-label="Giỏ hàng" className="p-1">
                <span className="inline-flex h-6 w-6 items-center justify-center border border-[#1E1E1E] text-[11px] font-semibold">🛒</span>
              </button>
            </div>
          </div>

          <div className="absolute left-1/2 top-[58px] hidden md:block w-[772px] max-w-[calc(100%-24px)] -translate-x-1/2 bg-[#F2BEBE] px-5 py-2 text-center text-white text-[13px] lg:text-[14px] font-light font-['Geologica'] leading-6">
            Đây là website phục vụ môn học Digital Marketing và không nhằm mục đích thương mại
          </div>
        </header>

        <main>
          <section className={`${bagRows[0].bgClass} px-4 sm:px-6 lg:px-10 pt-8 pb-12`}>
            <h2 className="text-center text-[#AF2E38] text-5xl lg:text-6xl font-normal font-['Italianno'] leading-[1.05] tracking-[2.56px]">
              {bagRows[0].title}
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 items-end gap-8 lg:gap-10">
              {bagRows[0].cards.map((image, index) => (
                <div key={`petale-${index}`} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Túi Petalé mẫu ${index + 1}`}
                    className="h-[260px] sm:h-[320px] lg:h-[360px] w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white px-4 sm:px-6 lg:px-10 pt-8 pb-12">
            <h2 className="text-center text-[#AF2E38] text-5xl lg:text-6xl font-normal font-['Italianno'] leading-[1.05] tracking-[2.56px]">
              {bagRows[1].title}
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 items-end gap-8 lg:gap-10">
              {bagRows[1].cards.map((image, index) => (
                <div key={`blooming-${index}`} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Túi Blooming Heart mẫu ${index + 1}`}
                    className="h-[260px] sm:h-[320px] lg:h-[360px] w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className={`${bagRows[2].bgClass} px-4 sm:px-6 lg:px-10 pt-8 pb-12`}>
            <h2 className="text-center text-[#AF2E38] text-5xl lg:text-6xl font-normal font-['Italianno'] leading-[1.05] tracking-[2.56px]">
              {bagRows[2].title}
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 items-end gap-8 lg:gap-10">
              {bagRows[2].cards.map((image, index) => (
                <div key={`la-vie-${index}`} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Túi La vie en rose mẫu ${index + 1}`}
                    className="h-[260px] sm:h-[320px] lg:h-[360px] w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer id="contact-footer" className="bg-[#598CBC] text-white border-[10px] border-[#598CBC] px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
            <div>
              <img src="/images/home/temfooter.png" alt="Dear, Chérie" className="h-32 w-32 object-contain" />
              <div className="mt-2 text-5xl font-normal font-['Italianno'] leading-[1.1]">Dear, Chérie</div>
              <p className="mt-2 max-w-[280px] text-sm font-thin font-['Geologica'] leading-5">
                Mỗi bó hoa không chỉ là một món quà, mà là một lá thư đầy cảm xúc được gửi đến người thân yêu
              </p>
            </div>

            <div className="pt-2">
              <div className="text-xl font-extrabold font-['Geologica'] leading-9 uppercase">THÔNG TIN LIÊN HỆ</div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-[#AF2E38] text-base font-extrabold font-['Geologica'] leading-6">HOTLINE:</div>
                  <div className="text-white text-xl font-extralight font-['Geologica'] leading-7">1900-6868</div>
                </div>
                <div>
                  <div className="text-[#AF2E38] text-base font-extrabold font-['Geologica'] leading-6">EMAIL</div>
                  <a href="mailto:dearcherie.info@gmail.com" className="block text-white text-base font-extrabold font-['Geologica'] underline leading-6 break-all">
                    dearcherie.info@gmail.com
                  </a>
                </div>
                <div>
                  <div className="text-[#AF2E38] text-base font-extrabold font-['Geologica'] leading-6">KẾT NỐI</div>
                  <div className="text-white text-xl font-normal font-['Geologica'] leading-7">Facebook</div>
                  <div className="text-white text-xl font-normal font-['Geologica'] leading-7">TikTok</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-white text-xl font-extralight font-['Geologica'] leading-7">Về Chúng Tôi</div>
              <div className="mt-3 space-y-2 text-white text-xl font-extralight font-['Geologica'] leading-7">
                <div>Thiết Kế Túi</div>
                <div>Ngôn Ngữ Hoa</div>
                <div>Liên Hệ</div>
                <div>Câu hỏi thường gặp</div>
                <div>Chính sách</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-white text-xl font-extralight font-['Geologica'] leading-7">Nhận ngay ưu đãi 10% cho đơn hàng đầu tiên khi đăng ký bản tin của chúng tôi</div>
              <div className="mt-4 bg-[#D9D9D9] px-4 py-3 text-[#AF2E38] text-sm font-thin font-['Geologica'] leading-5">
                Email của bạn....
              </div>
              <div className="mt-6 text-white text-base font-thin font-['Geologica'] leading-6">
                10 Xuân Thuỷ, P. Thảo Điền, Quận 2, TP. HCM
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
