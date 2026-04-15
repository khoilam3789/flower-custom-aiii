import { Link } from "react-router-dom";

export default function Cart() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 py-12 lg:py-20 min-h-screen">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Geologica'] mb-10 text-slate-800 uppercase text-center md:text-left">
        Đơn Hàng Của Tôi
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Cart Items List */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
          
          {/* Header Row (Hidden on mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 mb-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">Mã đơn hàng</div>
            <div className="col-span-6 text-center">Sản phẩm</div>
            <div className="col-span-3 text-right">Trạng thái</div>
          </div>

          {/* Cart Item Placeholder */}
          <div className="flex flex-col md:grid md:grid-cols-12 items-center gap-6 py-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition rounded-xl px-2 md:px-0">
            {/* Mobile Header Label for Order ID */}
            <div className="md:hidden w-full text-left font-bold text-slate-500 text-sm uppercase">Mã đơn hàng: #DH1093</div>
            
            <div className="hidden md:block col-span-3 font-semibold text-rose-700">#DH1093</div>
            
            <div className="col-span-6 flex justify-center w-full">
              <div className="w-full max-w-[200px] md:max-w-xs rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative pt-[100%]">
                 <img src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=400&auto=format&fit=crop" className="absolute top-0 left-0 w-full h-full object-cover" alt="Bouquet" />
              </div>
            </div>
            
            <div className="col-span-3 flex md:justify-end w-full md:w-auto">
               <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mx-auto md:mx-0">
                 Đang xử lý
               </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
            <button className="px-8 py-3 rounded-full border-2 border-slate-800 text-slate-800 font-bold hover:bg-slate-800 hover:text-white transition w-full sm:w-auto text-center uppercase tracking-wider text-sm">
              Huỷ Đơn
            </button>
            <Link to="/" className="px-8 py-3 rounded-full bg-rose-700 text-white font-bold hover:bg-rose-800 transition shadow-md w-full sm:w-auto text-center uppercase tracking-wider text-sm">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-32">
            <h2 className="text-2xl font-bold font-['Geologica'] mb-6 text-slate-800 uppercase tracking-wider">Tổng Quan</h2>
            
            <div className="flex flex-col space-y-4 mb-6 text-slate-600">
              <div className="flex justify-between">
                <span className="font-light">Tạm tính</span>
                <span className="font-semibold text-slate-800">450.000₫</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light">Phí vận chuyển</span>
                <span className="font-semibold text-slate-800">30.000₫</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mb-8 flex justify-between items-center">
               <span className="text-xl font-bold font-['Geologica'] text-slate-800 uppercase">Tổng cộng</span>
               <span className="text-2xl font-bold text-rose-700">480.000₫</span>
            </div>

            <Link to="/payment" className="w-full block text-center px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition shadow-lg uppercase tracking-widest">
              THANH TOÁN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


