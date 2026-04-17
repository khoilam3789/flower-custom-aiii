import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Cart() {
  const { cartItems, removeFromCart, subTotalCart, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const shippingFee = cartItems.length > 0 ? 30000 : 0;
  const total = subTotalCart + shippingFee;

  const handleCheckout = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        alert("Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.");
        if (clearCart) clearCart();
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.message || "Thanh toán thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối khi thanh toán");
    }
  };

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
            <div className="col-span-1 text-center">STT</div>
            <div className="col-span-5 text-center">Chi tiết đơn tuỳ chọn</div>
            <div className="col-span-2 text-center">Số lượng</div>
            <div className="col-span-3 text-right">Thành tiền</div>
            <div className="col-span-1 text-right">Xóa</div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Giỏ hàng của bạn đang trống.</div>
          ) : (
            cartItems.map((item, index) => (
              <div key={item._id || index} className="flex flex-col md:grid md:grid-cols-12 items-center gap-6 py-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition rounded-xl px-2 md:px-0">
                <div className="md:hidden w-full text-left font-bold text-slate-500 text-sm uppercase">Sản phẩm #{index + 1}</div>
                
                <div className="hidden md:block col-span-1 font-semibold text-rose-700 text-center">#{index + 1}</div>
                
                <div className="col-span-5 flex flex-col items-center md:items-start text-sm text-slate-600">
                  <div className="font-bold text-slate-800 mb-2">Gói thiết kế tuỳ chọn</div>
                  {/* Hiển thị tóm tắt chi tiết hoặc ảnh placeholder nếu chưa có ảnh thực */}
                  <div className="w-full max-w-[120px] rounded-lg overflow-hidden border border-slate-200 shadow-sm relative pt-[100%] mx-auto md:mx-0">
                    <img src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=400&auto=format&fit=crop" className="absolute top-0 left-0 w-full h-full object-cover" alt="Bouquet" />
                  </div>
                </div>
                
                <div className="col-span-2 text-center flex justify-center uppercase font-bold text-slate-700">
                  x{item.totalQuantity}
                </div>

                <div className="col-span-3 flex md:justify-end font-bold text-rose-700 w-full md:w-auto">
                   {item.subTotal.toLocaleString()}₫
                </div>

                <div className="col-span-1 flex md:justify-end w-full md:w-auto h-full items-center">
                  <button onClick={() => removeFromCart(item._id || index)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition">Xóa</button>
                </div>
              </div>
            ))
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200 justify-end">
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
                <span className="font-semibold text-slate-800">{subTotalCart.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light">Phí vận chuyển</span>
                <span className="font-semibold text-slate-800">{shippingFee.toLocaleString()}₫</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mb-8 flex justify-between items-center">
               <span className="text-xl font-bold font-['Geologica'] text-slate-800 uppercase">Tổng cộng</span>
               <span className="text-2xl font-bold text-rose-700">{total.toLocaleString()}₫</span>
            </div>

            <button onClick={handleCheckout} className="w-full block text-center px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition shadow-lg uppercase tracking-widest cursor-pointer">
              THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


