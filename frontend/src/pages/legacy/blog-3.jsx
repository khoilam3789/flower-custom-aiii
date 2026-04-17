export default function Blog3() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 py-16 lg:py-24 font-sans text-slate-800">
      <header className="mb-12 text-center md:text-left border-b border-rose-100 pb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-['Geologica'] text-rose-700 leading-tight mb-6">
          Cách bảo quản hoa tươi: Giữ trọn vẻ đẹp và cảm xúc theo thời gian
        </h1>
        <p className="text-slate-500 font-light text-lg mb-8 italic">
          Những mẹo đơn giản giúp bó hoa tươi lâu hơn và luôn rạng rỡ.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <span className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Ngày đăng: 13/01/2026</span>
        </div>
      </header>

      <article className="prose prose-lg md:prose-xl prose-rose max-w-none text-justify font-light leading-relaxed">
        <p>
          Một bó hoa không chỉ đẹp ở khoảnh khắc được trao đi, mà còn nằm ở cách nó được nâng niu và gìn giữ sau đó. Hoa tươi vốn mong manh,
          chỉ cần vài sai sót nhỏ cũng có thể khiến hoa nhanh héo. Vì vậy, bảo quản đúng cách là chìa khóa để kéo dài vẻ đẹp và cảm xúc mà bó hoa mang lại.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Vì sao bảo quản hoa tươi lại quan trọng?
        </h2>
        <p>
          Khi hoa được chăm đúng cách, thời gian tươi có thể kéo dài thêm nhiều ngày. Điều đó không chỉ giúp không gian sống luôn đẹp mắt,
          mà còn giữ lại ý nghĩa tinh tế của món quà. Mỗi lần nhìn thấy bó hoa vẫn tươi là một lần cảm xúc ban đầu được gợi lại.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Những nguyên nhân khiến hoa nhanh héo
        </h2>
        <p>
          Một số lỗi phổ biến gồm: không cắt lại gốc sau khi nhận hoa, dùng nước bẩn hoặc quên thay nước, để lá ngập trong bình,
          đặt hoa dưới nắng gắt hoặc gần nguồn nhiệt. Ngoài ra, đặt hoa gần trái cây chín cũng có thể làm hoa xuống màu nhanh hơn
          do khí ethylene.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Các bước cơ bản để giữ hoa tươi lâu
        </h2>
        <p>
          Hãy cắt vát gốc hoa khoảng 45 độ bằng kéo sắc, tốt nhất dưới vòi nước để hạn chế bọt khí. Dùng nước sạch ở nhiệt độ phòng,
          thay nước mỗi ngày hoặc cách ngày. Loại bỏ lá ngập nước và cánh hoa héo để hạn chế vi khuẩn phát triển. Đặt bình hoa ở nơi thoáng mát,
          tránh nắng trực tiếp và tránh luồng gió mạnh từ quạt hoặc máy lạnh.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Lời kết
        </h2>
        <p>
          Giữ hoa tươi lâu không chỉ là chăm sóc một món quà, mà còn là cách bạn trân trọng những cảm xúc trong đó. Chỉ với vài thao tác nhỏ,
          bạn đã có thể kéo dài vẻ đẹp của bó hoa và giữ cho ký ức ấy ở lại lâu hơn trong cuộc sống hàng ngày.
        </p>
      </article>

      <div className="mt-16 bg-rose-700 text-white p-8 md:p-12 rounded-[40px] text-center shadow-[0_10px_30px_rgba(225,29,72,0.3)]">
        <h3 className="text-3xl font-['Italianno'] mb-4 text-rose-100">Lời muốn nói, gói trong hoa</h3>
        <p className="font-light mb-8 max-w-lg mx-auto">
          Khám phá thêm nhiều câu chuyện về hoa và thiết kế bó hoa riêng của bạn cùng Dear, Chérie.
        </p>
        <a href="/booth" className="inline-block px-10 py-4 bg-white text-rose-700 font-bold uppercase tracking-widest rounded-full hover:bg-rose-50 transition shadow-lg">
          Tạo Ngay
        </a>
      </div>
    </div>
  );
}
