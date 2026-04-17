export default function Blog2() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-6 md:px-12 py-16 lg:py-24 font-sans text-slate-800">
      <header className="mb-12 text-center md:text-left border-b border-rose-100 pb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-['Geologica'] text-rose-700 leading-tight mb-6">
          Túi hoa tự thiết kế: Khi việc mang hoa trở thành một trải nghiệm trọn vẹn
        </h1>
        <p className="text-slate-500 font-light text-lg mb-8 italic">
          Bạn muốn chọn một bó hoa độc đáo để tặng cho người thương?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <span className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Ngày đăng: 24/02/2026</span>
        </div>
      </header>

      <article className="prose prose-lg md:prose-xl prose-rose max-w-none text-justify font-light leading-relaxed">
        <p>
          Một bó hoa luôn mang theo những cảm xúc đẹp: đó có thể là lời yêu, sự trân trọng, hay đơn giản là một khoảnh khắc muốn lưu giữ.
          Nhưng thực tế, việc mang theo một bó hoa trong suốt cả ngày lại không hề dễ dàng như chúng ta tưởng. Những bất tiện đó vô tình
          làm gián đoạn trải nghiệm vốn dĩ rất lãng mạn.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Khi việc tặng hoa không chỉ dừng lại ở bó hoa
        </h2>
        <p>
          Ngày nay, người tặng hoa không chỉ muốn mua một bó hoa đẹp có sẵn mà còn muốn tạo ra một bó hoa mang dấu ấn của riêng mình.
          Mỗi mối quan hệ là một câu chuyện khác nhau: bó hoa dành cho người yêu sẽ khác với bó hoa tặng mẹ, bạn thân hay đồng nghiệp.
          Vì thế, khả năng tự tay lựa chọn và phối hợp các thành phần của bó hoa giúp món quà trở nên tinh tế và cá nhân hơn rất nhiều.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Tại sao nên tự thiết kế bó hoa?
        </h2>
        <p>
          Tự thiết kế giúp bạn chủ động chọn loại hoa, tông màu, số lượng và cả phong cách gói phù hợp với người nhận. Không chỉ là thao tác
          chọn sản phẩm, đó còn là một quá trình sáng tạo. Bạn nhìn thấy món quà dần hoàn thiện theo từng quyết định nhỏ, và chính điều này làm
          cho khoảnh khắc trao tặng trở nên ý nghĩa hơn.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Trải nghiệm chọn túi hoa theo phong cách riêng
        </h2>
        <p>
          Ở bước chọn túi hoa, quá trình thiết kế trở nên trực quan hơn nhờ hình ảnh minh họa rõ ràng. Mỗi mẫu túi mang một tinh thần riêng,
          từ nhẹ nhàng, đáng yêu cho đến thanh lịch, tối giản. Bên cạnh đó, phần tạm tính giúp người dùng theo dõi ngân sách theo thời gian thực,
          từ đó dễ so sánh các lựa chọn và kiểm soát chi phí tốt hơn.
        </p>

        <h2 className="text-2xl font-bold font-['Geologica'] text-slate-800 mt-12 mb-6">
          Lời kết
        </h2>
        <p>
          Một bó hoa đáng nhớ không nằm ở số lượng bông hoa, mà nằm ở câu chuyện và sự chăm chút trong từng chi tiết. Khi bạn tự tay thiết kế,
          món quà trở thành một thông điệp cá nhân hóa trọn vẹn, và người nhận sẽ cảm nhận được điều đó ngay từ khoảnh khắc đầu tiên.
        </p>
      </article>

      <div className="mt-16 bg-rose-700 text-white p-8 md:p-12 rounded-[40px] text-center shadow-[0_10px_30px_rgba(225,29,72,0.3)]">
        <h3 className="text-3xl font-['Italianno'] mb-4 text-rose-100">Lời muốn nói, gói trong hoa</h3>
        <p className="font-light mb-8 max-w-lg mx-auto">
          Tự tay tạo bó hoa của chính mình cùng Dear, Chérie ngay hôm nay để gửi gắm lời yêu thương hoàn hảo nhất.
        </p>
        <a href="/booth" className="inline-block px-10 py-4 bg-white text-rose-700 font-bold uppercase tracking-widest rounded-full hover:bg-rose-50 transition shadow-lg">
          Tạo Ngay
        </a>
      </div>
    </div>
  );
}
