import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 py-16 lg:py-24 min-h-[70vh] flex flex-col items-center justify-center">
      
      {/* Checkout Stepper (Decorative) */}
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12 text-sm md:text-base font-['Geologica'] uppercase tracking-widest text-slate-400 font-semibold w-full">
         <span>Giỏ Hàng</span>
         <span>----</span>
         <span>Thanh Toán</span>
         <span>----</span>
         <span className="text-rose-700">Hoàn Tất</span>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-[40px] shadow-sm border border-slate-200 p-8 md:p-16 flex flex-col items-center text-center">
        
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 border-4 border-green-50 shadow-inner">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold font-['Geologica'] mb-6 text-slate-800 uppercase tracking-tight">ĐẶT HÀNG THÀNH CÔNG!</h1>
        
        <p className="text-slate-600 text-lg md:text-xl font-light mb-12 leading-relaxed max-w-2xl bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100">
           Chào bạn, cảm ơn bạn đã tin tưởng và lựa chọn <span className="font-bold text-rose-700">Dear, Chérie</span>.<br/><br/>
           Chúng mình rất trân trọng sự quan tâm của bạn dành cho thương hiệu. Tuy nhiên, đây là một dự án phục vụ môn học, nên thật tiếc là chúng mình chưa thể trao tận tay bạn sản phẩm thật.<br/><br/>
           Mong rằng bạn đã có những phút giây trải nghiệm trang web thật tuyệt vời. Một lần nữa, cảm ơn bạn đã giúp dự án của chúng mình trở nên ý nghĩa hơn!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link to="/" className="px-8 py-4 rounded-full bg-rose-700 text-white font-bold text-lg hover:bg-rose-800 transition shadow-lg shadow-rose-700/30 uppercase tracking-widest text-center">
            VỀ TRANG CHỦ
          </Link>
          <Link to="/cart" className="px-8 py-4 rounded-full border-2 border-slate-800 text-slate-800 font-bold text-lg hover:bg-slate-800 hover:text-white transition uppercase tracking-widest text-center shadow-sm">
            XEM LẠI GIỎ HÀNG
          </Link>
        </div>
      </div>
    </div>
  );
}
