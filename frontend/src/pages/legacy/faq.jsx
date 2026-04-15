export default function FAQ() {
  return (
    <div className="w-full flex-col bg-Color-3">
      {/* FAQ Banner */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('/images/FAQ/nen.png')] bg-cover bg-center opacity-30 blur-sm"
        ></div>
        <div className="relative z-10 bg-rose-700/80 px-16 py-6 border border-white/50 shadow-lg rounded-2xl backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl text-white font-bold tracking-widest uppercase">CÂU HỎI THƯỜNG GẶP</h1>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="w-full bg-slate-500 text-white py-24 relative">
        <div className="max-w-[1280px] mx-auto px-12 md:px-24 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 items-start relative">
            
            {/* Center Image overlapping */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block z-10 w-72 h-72">
               <img src="/images/FAQ/anh2ogiua.png" alt="Center decor" className="w-full h-full object-contain drop-shadow-xl" />
            </div>

            {/* Q1 */}
            <div className="flex flex-col pr-8 md:pr-20">
              <h3 className="text-2xl font-bold mb-4 leading-snug">GIAO HÀNG TRONG NGÀY CÓ ĐƯỢC ĐẢM BẢO KHÔNG?</h3>
              <p className="font-light opacity-90 leading-relaxed text-justify">
                Chúng tôi chấp nhận đơn hàng giao nhanh (trong vòng tối đa 3 giờ). Tuy nhiên, việc giao đúng giờ không được cam kết tuyệt đối trong các trường hợp: đơn hàng tại khu vực xa nội thành, địa điểm có bảo vệ/an ninh nghiêm ngặt, hoặc trong các dịp lễ cao điểm (Lễ Tình nhân, Ngày của Mẹ,...)
              </p>
            </div>

            {/* Q2 */}
            <div className="flex flex-col pl-8 md:pl-20">
              <h3 className="text-2xl font-bold mb-4 leading-snug">CÁC SỰ KIỆN QUAN TRỌNG CÓ ĐƯỢC ĐẢM BẢO GIAO HÀNG ĐÚNG GIỜ KHÔNG?</h3>
              <p className="font-light opacity-90 leading-relaxed text-justify">
                Đối với các sự kiện như tang lễ, tiệc cưới, hội nghị, <b>Dear, Chérie</b> không cam kết chính xác từng phút do yếu tố khách quan. Nếu có sự cố chậm trễ, chúng tôi sẽ chủ động liên hệ để cập nhật tình trạng đơn hàng cho bạn.
              </p>
            </div>

            {/* Q3 */}
            <div className="flex flex-col pr-8 md:pr-20 pt-10">
              <h3 className="text-2xl font-bold mb-4 leading-snug">LÀM THẾ NÀO ĐỂ THAY ĐỔI HOẶC HỦY ĐƠN HÀNG?</h3>
              <p className="font-light opacity-90 leading-relaxed text-justify">
                Bạn có thể yêu cầu thay đổi/hủy đơn khi đơn hàng chưa vào quy trình giao. Vui lòng liên hệ hotline hoặc gửi email (kèm Mã đơn hàng ở tiêu đề) để được hỗ trợ kịp thời.
              </p>
            </div>

            {/* Q4 */}
            <div className="flex flex-col pl-8 md:pl-20 pt-10">
              <h3 className="text-2xl font-bold mb-4 leading-snug">XỬ LÝ THẾ NÀO NẾU NGƯỜI NHẬN KHÔNG THỂ CÓ MẶT TẠI THỜI ĐIỂM GIAO HÀNG?</h3>
              <p className="font-light opacity-90 leading-relaxed text-justify">
                Nhân viên sẽ liên lạc qua điện thoại hoặc gửi lại quầy lễ tân/bảo vệ nếu an toàn. Trường hợp phải giao lại nhiều lần do sai thông tin từ phía người đặt, phụ phí có thể được áp dụng.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Policies Banner */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=1600&h=600&fit=crop')] bg-cover bg-center opacity-30 blur-sm"
        ></div>
        <div className="relative z-10 bg-rose-700/80 px-24 py-6 border border-white/50 shadow-lg rounded-2xl backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl text-white font-bold tracking-widest uppercase">CHÍNH SÁCH</h1>
        </div>
      </section>

      {/* Policy Content Cards */}
      <section className="w-full bg-Color-3 py-24">
        <div className="max-w-[1280px] mx-auto px-12 md:px-24 flex flex-col space-y-16">
          
          {/* Card 1: Giao Hang */}
          <div className="bg-white rounded-[30px] p-12 shadow-md border border-zinc-200">
            <h2 className="text-3xl text-rose-700 font-bold mb-10 text-center uppercase">CHÍNH SÁCH GIAO HÀNG</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-rose-700 font-bold text-lg mb-1">Khu vực giao hàng</h3>
                <p className="text-sm font-light text-black/80 leading-relaxed text-justify">Đặt hoa tươi và giao hoa tận nơi tại TP HCM và 63 tỉnh - thành phố tại Việt Nam.<br/>Tuy nhiên, những địa điểm giao hàng đặc biệt như chung cư, tòa nhà có bảo vệ gây cản trở giao hàng, trung tâm hội nghị... chúng tôi sẽ liên lạc với người nhận để sắp xếp địa điểm giao hoa thuận lợi nhất.</p>
              </div>
              <div>
                <h3 className="text-rose-700 font-bold text-lg mb-1">Theo dõi đơn hàng</h3>
                <p className="text-sm font-light text-black/80 leading-relaxed text-justify">Mã vận đơn sẽ được hiển thị ngay sau khi đơn được đặt, và có thể theo dõi trong phần Giỏ hàng.</p>
              </div>
              <div>
                <h3 className="text-rose-700 font-bold text-lg mb-1">Thời gian giao hàng</h3>
                <p className="text-sm font-light text-black/80 leading-relaxed text-justify">Cam kết giao hoa sớm nhất sau 02 giờ kể từ khi khách hàng đặt hoa và tiến hành thanh toán thành công.<br/>Thời gian giao hàng từ 7h30 sáng đến 20h. Với những đơn đặt hàng sau 20h sẽ được giao vào sáng ngày kế tiếp.<br/>Tuy nhiên, trong một số trường hợp như mưa bão hoặc không liên lạc được với người nhận, chúng tôi sẽ liên lạc lại để sắp xếp.</p>
              </div>
              <div>
                <h3 className="text-rose-700 font-bold text-lg mb-1">Phí giao hàng</h3>
                <p className="text-sm font-light text-black/80 leading-relaxed text-justify">Dear, Chérie miễn phí giao hoa trong khu vực trung tâm TP.HCM. Phí giao khu vực ngoại thành TP.HCM là 35.000đ.<br/>Những ngày lễ, ngày đặc biệt việc giao hàng sẽ được thực hiện sớm nhất có thể và các yêu cầu chính xác thời gian cụ thể sẽ không được đảm bảo.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Doi Tra */}
          <div className="bg-white rounded-[30px] p-12 shadow-md border border-zinc-200">
            <h2 className="text-3xl text-rose-700 font-bold mb-10 text-center uppercase">CHÍNH SÁCH ĐỔI TRẢ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-rose-700 font-bold text-lg mb-1">Quy trình Khiếu nại</h3>
                <p className="text-sm font-light text-black/80 leading-relaxed text-justify">Để được hỗ trợ nhanh nhất, quý khách vui lòng chụp ảnh sản phẩm lỗi và gửi kèm yêu cầu về cho Dear, Chérie.<br/>Thời gian tiếp nhận:<br/>- Vấn đề chất lượng: Trong vòng 12h kể từ khi nhận hàng.<br/>- Đơn hàng không tới nơi: Trong vòng 24h kể từ thời điểm dự kiến giao.<br/>- Các khiếu nại khác: Trong vòng 03 ngày.<br/><span className="italic">Lưu ý: Chúng tôi chỉ giải quyết hoàn tiền hoặc đổi mới khi có hình ảnh minh chứng hoặc quý khách còn giữ sản phẩm lỗi.</span></p>
              </div>
              <div>
                <h3 className="text-rose-700 font-bold text-lg mb-1">Quy định về thay thế sản phẩm</h3>
                <p className="text-sm font-light text-black/80 leading-relaxed text-justify">Dear, Chérie sẽ thay thế sản phẩm mới (trong vòng 24h sau khi giao) nếu gặp các vấn đề: giao nhầm mẫu, sai sót do lỗi kỹ thuật, sản phẩm bị hư hỏng trong quá trình vận chuyển.<br/>Do đặc thù cắm hoa, nếu loại hoa không có sẵn, chúng tôi sẽ chủ động thay thế bằng loại hoa khác có màu sắc và giá trị tương đương (Ưu tiên bố cục, và giá trị tương đương hoặc cao hơn).</p>
              </div>
              <div>
                <h3 className="text-rose-700 font-bold text-lg mb-1">Chính sách Hoàn tiền</h3>
                <p className="text-sm font-light text-black/80 leading-relaxed text-justify">Tùy vào mức độ sai sót, mức hoàn tiền sẽ được áp dụng theo 3 mức:<br/>- Hoàn trả 100%: Cho các lỗi nghiêm trọng từ phía của hàng.<br/>- Hoàn trả 50%: Theo thỏa thuận giữa hai bên.<br/>- Không hoàn trả: Với các trường hợp không có minh chứng hoặc quá thời gian quy định.<br/>Tiền sẽ được hoàn trả qua thẻ tín dụng, chuyển khoản ngân hàng mà quý khách đã sử dụng.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
