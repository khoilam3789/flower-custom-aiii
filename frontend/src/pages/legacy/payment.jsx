import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleCheckout = (e) => {
    e.preventDefault();
    navigate("/payment-success");
  };

  const handleAddToCart = async () => {
    try {
      const selectionKeys = ["flowerSelection", "leafSelection", "bagSelection", "cardSelection"];
      const blocks = selectionKeys
        .map((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          return {
            key,
            subtotal: Number(parsed?.subtotal) || 0,
            items: Array.isArray(parsed?.items) ? parsed.items : []
          };
        })
        .filter(Boolean);

      const itemPrice = blocks.reduce((sum, block) => sum + block.subtotal, 0);
      const customDetails = {
        source: "payment-page",
        blocks: blocks.map((block) => ({
          key: block.key,
          items: block.items.map((item) => ({
            label: item.label,
            quantity: item.quantity,
            lineTotal: item.lineTotal
          }))
        }))
      };

      if (itemPrice > 0) {
        await addToCart(customDetails, 1, itemPrice);
      }
    } catch (_error) {
      // Fallback: still navigate so user is not stuck on payment page.
    } finally {
      navigate("/cart");
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-20 min-h-screen">
      
      {/* Checkout Stepper (Decorative) */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12 text-sm md:text-base font-['Geologica'] uppercase tracking-widest text-slate-400 font-semibold">
         <span className="text-rose-700">Giỏ Hàng</span>
         <span>----</span>
         <span className="text-rose-700">Thanh Toán</span>
         <span>----</span>
         <span>Hoàn Tất</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Checkout Form */}
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-10">
            
            {/* Customer Info */}
            <section className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold font-['Geologica'] mb-6 text-slate-800 uppercase tracking-widest">Thông tin khách hàng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-600 uppercase">Họ và tên *</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-700 transition" placeholder="Nguyễn Văn A" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-600 uppercase">Số điện thoại *</label>
                  <input required type="tel" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-700 transition" placeholder="090 123 4567" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <label className="text-sm font-bold text-slate-600 uppercase">Email (Tuỳ chọn)</label>
                <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-700 transition" placeholder="example@mail.com" />
              </div>

              <div className="flex flex-col gap-2 mb-6">
                <label className="text-sm font-bold text-slate-600 uppercase">Địa chỉ giao hàng *</label>
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-700 transition" placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-600 uppercase">Ghi chú cho đơn hàng</label>
                <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-700 transition min-h-[100px]" placeholder="Thời gian giao hàng mong muốn, lời nhắn..."></textarea>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold font-['Geologica'] mb-6 text-slate-800 uppercase tracking-widest">Phương thức thanh toán</h2>
              
              <div className="space-y-4">
                <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'cod' ? 'border-rose-700 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-rose-600 focus:ring-rose-500" />
                  <div className="ml-4 flex flex-col">
                    <span className="font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm text-slate-500">Thanh toán bằng tiền mặt khi shipper giao tới.</span>
                  </div>
                </label>

                <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'qr' ? 'border-rose-700 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="w-5 h-5 text-rose-600 focus:ring-rose-500" />
                  <div className="ml-4 flex flex-col">
                    <span className="font-bold text-slate-800">Mã QR (MoMo / VNPay / ZaloPay)</span>
                    <span className="text-sm text-slate-500">Quét mã QR để thanh toán an toàn, tự động duyệt.</span>
                  </div>
                </label>

                <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'card' ? 'border-rose-700 bg-rose-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-rose-600 focus:ring-rose-500" />
                  <div className="ml-4 flex flex-col">
                    <span className="font-bold text-slate-800">Thẻ Tín dụng / Ghi nợ</span>
                    <span className="text-sm text-slate-500">Hỗ trợ Visa, Mastercard, JCB qua cổng thanh toán.</span>
                  </div>
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm sticky top-32">
            <h2 className="text-2xl font-bold font-['Geologica'] mb-6 text-slate-800 uppercase tracking-widest">Tóm tắt đơn hàng</h2>
            
            {/* Items */}
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-200 shrink-0">
                  <img src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Sản phẩm" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 line-clamp-2">Bó hoa hồng tự chọn AI (Mã: #DH1093)</h4>
                  <p className="text-slate-500 text-sm">SL: 1</p>
                </div>
                <div className="font-bold text-rose-700">450.000₫</div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mb-6 flex flex-col space-y-4">
              <div className="flex justify-between text-slate-600">
                <span className="font-light">Tạm tính</span>
                <span className="font-semibold text-slate-800">450.000₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-light">Phí vận chuyển</span>
                <span className="font-semibold text-slate-800">30.000₫</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between items-start gap-4 bg-rose-50 -mx-8 px-8 py-6 rounded-b-3xl -mb-8">
               <span className="text-xl font-bold font-['Geologica'] text-slate-800 uppercase flex-1">Tổng cộng</span>
               <div className="text-right flex-1">
                  <div className="text-3xl font-extrabold text-rose-700 mb-1">480.000₫</div>
                  <div className="text-xs text-rose-700/60 font-semibold uppercase tracking-wider">(Đã bao gồm VAT)</div>
               </div>
            </div>

            <div className="mt-10 space-y-4">
              <button form="checkout-form" type="submit" className="w-full text-center px-8 py-5 bg-rose-700 text-white font-bold text-xl rounded-full hover:bg-rose-800 transition shadow-xl uppercase tracking-widest shadow-rose-700/30">
                XÁC NHẬN THANH TOÁN
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="block w-full text-center px-8 py-4 bg-white text-rose-700 border-2 border-rose-700 font-bold text-base rounded-full hover:bg-rose-50 transition uppercase tracking-widest"
              >
                BỎ VÀO GIỎ HÀNG
              </button>

              <div className="text-center">
                <Link to="/cart" className="text-slate-500 hover:text-rose-700 font-semibold uppercase tracking-wider text-sm transition">
                  &larr; Quay lại Giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
