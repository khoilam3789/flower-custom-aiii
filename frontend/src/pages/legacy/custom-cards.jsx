import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../../api';
import StepBar from '../../components/StepBar';

export default function Customcards() {
  const FLOWER_STORAGE_KEY = 'flowerSelection';
  const LEAF_STORAGE_KEY = 'leafSelection';
  const BAG_STORAGE_KEY = 'bagSelection';
  const CARD_STORAGE_KEY = 'cardSelection';
  
  const backendUrl = API_BASE;
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState({});
  const [message, setMessage] = useState("");
  const [previousSubtotal, setPreviousSubtotal] = useState(0);
  const [previousItems, setPreviousItems] = useState([]);

  useEffect(() => {
    try {
      const flowerRaw = localStorage.getItem(FLOWER_STORAGE_KEY);
      const leafRaw = localStorage.getItem(LEAF_STORAGE_KEY);
      const bagRaw = localStorage.getItem(BAG_STORAGE_KEY);
      
      const flowerParsed = flowerRaw ? JSON.parse(flowerRaw) : { items: [], subtotal: 0 };
      const leafParsed = leafRaw ? JSON.parse(leafRaw) : { items: [], subtotal: 0 };
      const bagParsed = bagRaw ? JSON.parse(bagRaw) : { items: [], subtotal: 0 };
      
      const combined = [
        ...(flowerParsed.items || []), 
        ...(leafParsed.items || []),
        ...(bagParsed.items || [])
      ];
      setPreviousItems(combined);
      setPreviousSubtotal(
        (flowerParsed.subtotal || 0) + 
        (leafParsed.subtotal || 0) + 
        (bagParsed.subtotal || 0)
      );
    } catch (e) {}

    const fetchCards = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/products?category=card`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          restoreCart(data);
        }
      } catch (e) {
        console.error("Lỗi lấy thiệp:", e);
      }
    };
    fetchCards();
  }, []);

  const restoreCart = (availableProducts) => {
    try {
      const raw = localStorage.getItem(CARD_STORAGE_KEY);
      if (raw) {
         const parsed = JSON.parse(raw);
         const restoredCounts = {};
         availableProducts.forEach(p => restoredCounts[p._id] = 0);
         if (Array.isArray(parsed.items)) {
           parsed.items.forEach(item => {
             if (restoredCounts[item.key] !== undefined) {
               restoredCounts[item.key] = Math.max(0, Number(item.quantity) || 0);
             }
           });
         }
         setCounts(restoredCounts);
         if (parsed.message) {
           setMessage(parsed.message);
         }
      }
    } catch (e) {}
  };

  const toggleSelection = (id) => {
    setCounts(prev => {
      if (prev[id] === 1) return {}; 
      return { [id]: 1 };
    });
  };

  const selectedItems = products
    .map((item) => ({
      key: item._id,
      label: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: counts[item._id] || 0,
      lineTotal: (counts[item._id] || 0) * item.price
    }))
    .filter((item) => item.quantity > 0);

  const hasCardSelection = selectedItems.length > 0;

  const cardSubtotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalSubtotal = previousSubtotal + cardSubtotal;

  const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

  const persistSelection = () => {
    const payload = {
      items: selectedItems,
      subtotal: cardSubtotal,
      message: message,
      updatedAt: Date.now()
    };
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(payload));
  };

  useEffect(() => {
    persistSelection();
  }, [totalSubtotal, counts, message]);

  const handleContinue = () => {
    if (!hasCardSelection) {
      alert("Vui lòng chọn ít nhất một mẫu thiệp trước khi thanh toán.");
      return;
    }

    persistSelection();
    navigate('/payment');
  };

  return (
    <div className="w-full min-h-screen bg-Color-3 flex flex-col font-['Geologica'] overflow-x-hidden">
      <StepBar currentStep={5} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 lg:p-12 max-w-[1280px] mx-auto w-full flex-grow">
        
        {/* Panel Chọn Thiệp & Lời Nhắn (Bên trái) */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6">

          {/* Cards Section */}
          <div className="bg-[#AF2E38] rounded-[20px] p-4 md:p-6 overflow-x-auto scrollbar-hide shadow-inner flex gap-4 w-full">
            {products.map((card) => (
               <div
                 key={card._id}
                 className="relative w-[180px] min-w-[180px] h-[220px] bg-white rounded-[10px] flex-none flex flex-col items-center shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform"
                 onClick={() => toggleSelection(card._id)}
               >
                  {/* Price */}
                  <div className="pointer-events-auto absolute top-2 right-2 text-[#AF2E38] text-[11px] font-bold italic z-20">
                    {new Intl.NumberFormat('vi-VN').format(card.price)}đ
                  </div>
                  
                  {/* Radio Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(card._id);
                    }}
                    className="pointer-events-auto absolute top-2 left-2 w-[20px] h-[20px] rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 z-20"
                    style={{
                      border: counts[card._id] ? '2px solid #3B73A9' : '2px solid #ccc',
                      background: 'white',
                      boxShadow: counts[card._id] ? '0 0 0 3px rgba(59,115,169,0.15)' : 'none'
                    }}
                  >
                    {counts[card._id] === 1 && (
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B73A9' }}></div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="flex justify-center items-center mt-8 h-[90px] z-10 w-full px-2">
                    <img className="object-contain h-full w-auto hover:scale-105 transition" src={card.imageUrl} alt={card.name} />
                  </div>
                  
                  {/* Name */}
                  <div className="text-center mt-3 text-[#3B73A9] text-[13px] font-bold truncate w-full px-2 z-10">
                    {card.name}
                  </div>
                  
                  {/* Description */}
                  <div className="text-center text-[#444] text-[10px] italic px-3 mt-1 leading-[1.2] line-clamp-2 z-10 w-full">
                    {card.description}
                  </div>
               </div>
            ))}
          </div>

          {/* Message Section */}
          <div className="bg-[#AF2E38] rounded-[20px] p-4 md:p-6 shadow-inner flex flex-col items-center w-full">
            <h2 className="text-center text-white text-xl md:text-3xl font-semibold mb-6">Thêm lời nhắn gửi</h2>
            
            <div className="w-full bg-white rounded-[20px] p-4 flex flex-col md:flex-row gap-6 shadow-md">
              <div className="flex flex-col gap-2 flex-grow w-full md:w-1/2">
                <label className="text-[#215E98] text-base font-black">Nội dung lời nhắn</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết lời nhắn gửi của bạn tại đây..."
                  className="w-full h-32 md:h-full min-h-[120px] bg-[#FCE5EB] rounded-[10px] p-4 text-neutral-600 focus:outline-none resize-none shadow-inner"
                />
              </div>

              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <span className="text-[#215E98] text-base font-black">Lời nhắn nhanh</span>
                <div className="flex flex-wrap gap-2">
                  {["Congratuations!", "Happy Birthday!", "Anh yêu em!", "Happy Anniversary", "Đừng giận tớ nữa nhé!", "I miss you"].map((msg, idx) => (
                     <button 
                       key={idx}
                       onClick={() => setMessage(prev => prev ? prev + "\n" + msg : msg)}
                       className="px-3 py-2 md:py-1.5 bg-white border border-[#f0c2cd] rounded-[10px] shadow-sm text-black text-[13px] font-bold hover:bg-[#FCE5EB] hover:border-[#AF2E38] hover:text-[#AF2E38] transition-all cursor-pointer text-left"
                     >
                       {msg}
                     </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Panel Tạm tính (Bên phải) */}
        <div className="w-full lg:w-[40%] bg-white rounded-[10px] border border-[#AF2E38] flex flex-col overflow-hidden shadow-sm h-[400px] lg:h-auto">
          {/* List Items */}
          <div className="flex-grow overflow-y-auto scrollbar-hide p-4 md:p-6">
            {previousItems.length === 0 && selectedItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-zinc-400 text-base font-light">
                Chưa có gì được chọn
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Hiển thị các mục đã chọn từ trang trước */}
                {previousItems.map((item) => (
                  <div key={item.key} className="w-full px-4 py-3 bg-[#FAF9F5] rounded-lg flex items-center justify-between border border-rose-50 shadow-sm opacity-80">
                    <span className="text-[#AF2E38] text-base md:text-lg font-normal break-words max-w-[60%]">x{item.quantity} {item.label}</span>
                    <span className="text-[#AF2E38] text-base md:text-lg font-semibold whitespace-nowrap">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
                {/* Hiển thị thiệp đã chọn */}
                {selectedItems.map((item) => (
                  <div key={item.key} className="w-full px-4 py-3 bg-[#FAF9F5] rounded-lg flex items-center justify-between border border-rose-50 shadow-sm">
                    <span className="text-[#AF2E38] text-base md:text-lg font-normal break-words max-w-[60%]">x{item.quantity} {item.label}</span>
                    <span className="text-[#AF2E38] text-base md:text-lg font-semibold whitespace-nowrap">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Total Bar */}
          <div className="bg-[#AF2E38] p-4 md:p-6 text-white flex justify-between items-center rounded-b-lg">
            <span className="text-xl md:text-3xl font-semibold">Tạm tính</span>
            <span className="text-xl md:text-3xl font-light">{new Intl.NumberFormat('vi-VN').format(totalSubtotal)}đ</span>
          </div>
        </div>

      </div>

      {/* Continue Button */}
      <div className="flex justify-center md:justify-end px-4 md:px-12 pb-12 pt-4">
        <button
          onClick={handleContinue}
          disabled={!hasCardSelection}
          className={`bg-[#B8DAFF] text-[#AF2E38] text-xl md:text-2xl font-normal py-3 px-8 rounded-[10px] transition-all shadow-md w-full md:w-auto text-center ${
            hasCardSelection 
              ? "hover:bg-blue-200 cursor-pointer" 
              : "opacity-60 cursor-not-allowed"
          }`}
        >
          TIẾP TỤC
        </button>
      </div>

    </div>
  );
}
