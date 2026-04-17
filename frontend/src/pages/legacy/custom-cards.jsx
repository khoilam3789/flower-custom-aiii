import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../../api';

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
      price: item.price,
      quantity: counts[item._id] || 0,
      lineTotal: (counts[item._id] || 0) * item.price
    }))
    .filter((item) => item.quantity > 0);

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
    persistSelection();
    navigate('/payment');
  };

  return (
    <div className="w-[1440px] h-[1200px] px-10 relative left-1/2 -translate-x-1/2 bg-Color-3 inline-flex flex-col justify-start items-center overflow-hidden">
      
      {/* Right Pane Summary */}
      <div className="w-[525px] h-[532px] left-[816px] top-[280px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
        <div className="w-[477px] h-[340px] left-[24px] top-[26px] absolute overflow-y-auto overflow-x-hidden scrollbar-hide pr-3">
          {previousItems.length === 0 && selectedItems.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-zinc-400 text-base font-light font-['Geologica'] leading-6">
              Chưa có gì được chọn
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Hiển thị các mục đã chọn từ trang trước */}
              {previousItems.map((item) => (
                <div key={item.key} className="w-full px-4 py-3 bg-[#FAF9F5] rounded-lg flex items-center justify-between">
                  <span className="text-[#AF2E38] text-lg font-normal font-['Geologica'] leading-6">x{item.quantity} {item.label}</span>
                  <span className="text-[#AF2E38] text-lg font-semibold font-['Geologica'] leading-6">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
              {/* Hiển thị thiệp đã chọn */}
              {selectedItems.map((item) => (
                <div key={item.key} className="w-full px-4 py-3 bg-[#FAF9F5] rounded-lg flex items-center justify-between">
                  <span className="text-[#AF2E38] text-lg font-normal font-['Geologica'] leading-6">x{item.quantity} {item.label}</span>
                  <span className="text-[#AF2E38] text-lg font-semibold font-['Geologica'] leading-6">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-[619px] h-36 left-0 top-[404px] absolute bg-[#AF2E38] rounded-[10px]" />
        <div className="w-40 h-10 left-[16px] top-[472px] absolute text-center justify-center text-white text-xl font-semibold font-['Geologica'] leading-10">Tạm tính</div>
        <div className="w-52 h-10 left-[296px] top-[472px] absolute text-right justify-center text-white text-3xl font-light font-['Geologica'] leading-10">{formatPrice(totalSubtotal)}</div>
      </div>

      <button onClick={handleContinue} className="w-80 h-24 left-[1000px] top-[830px] absolute overflow-hidden block z-10 cursor-pointer bg-transparent border-none">
        <div className="w-48 h-12 left-[152px] top-[24px] absolute bg-[#B8DAFF] rounded-[10px]" />
        <div className="left-[192px] top-[35px] absolute text-center justify-center text-[#AF2E38] text-2xl font-normal font-['Geologica'] leading-7 z-20">TIẾP TỤC</div>
      </button>

      {/* Left Pane Part 1: Top Cards Area */}
      <div className="w-[703px] h-[260px] left-[61px] top-[260px] absolute bg-[#AF2E38] rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-x-auto overflow-y-hidden scrollbar-hide py-4 px-4">
         <div className="flex gap-4 h-full items-center">
          {products.map((card) => (
             <div key={card._id} className="relative w-[180px] min-w-[180px] h-[220px] bg-white rounded-[10px] flex-none flex flex-col items-center shadow-md overflow-hidden">
                {/* Price */}
                <div className="pointer-events-auto absolute top-2 right-2 text-[#AF2E38] text-[11px] font-bold italic">
                  {new Intl.NumberFormat('vi-VN').format(card.price)}đ
                </div>
                
                {/* Radio Checkbox */}
                <div
                  onClick={() => toggleSelection(card._id)}
                  className="pointer-events-auto absolute top-2 left-2 w-[20px] h-[20px] rounded-full cursor-pointer flex items-center justify-center transition-all duration-200"
                  style={{
                    border: counts[card._id] ? '2px solid #3B73A9' : '2px solid #ccc',
                    background: 'white',
                    boxShadow: counts[card._id] ? '0 0 0 3px rgba(59,115,169,0.15)' : 'none'
                  }}
                >
                  {counts[card._id] && (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B73A9' }}></div>
                  )}
                </div>

                {/* Image */}
                <div className="flex justify-center items-center mt-8 h-[90px]">
                  <img className="object-contain h-[90px] w-auto hover:scale-105 transition" src={card.imageUrl} alt={card.name} />
                </div>
                
                {/* Name */}
                <div className="text-center mt-3 text-[#3B73A9] text-[13px] font-bold font-['Geologica'] truncate w-full px-2">
                  {card.name}
                </div>
                
                {/* Description */}
                <div className="text-center text-[#444] text-[10px] italic font-['Geologica'] px-3 mt-1 leading-[1.2] line-clamp-2">
                  {card.description}
                </div>
             </div>
          ))}
         </div>
      </div>

      {/* Left Pane Part 2: Custom Message Area */}
      <div className="w-[703px] h-[400px] left-[61px] top-[540px] absolute bg-[#AF2E38] rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden flex flex-col items-center">
        <div className="w-full text-center mt-4 mb-4 text-white text-3xl font-semibold font-['Geologica']">Thêm lời nhắn gửi</div>
        
        <div className="w-[638px] h-64 bg-white rounded-[20px] p-5 flex flex-col justify-between">
          <div className="flex flex-col gap-1 h-32">
            <span className="text-[#215E98] text-base font-black font-['Geologica']">Nội dung lời nhắn</span>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Viết lời nhắn gửi của bạn tại đây..."
              className="flex-1 bg-[#FCE5EB] rounded-[10px] p-3 text-neutral-600 font-['Geologica'] focus:outline-none resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2 h-auto">
            <span className="text-[#215E98] text-base font-black font-['Geologica']">Lời nhắn nhanh</span>
            <div className="flex flex-wrap gap-2">
              {["Congratuations!", "Happy Birthday!", "Anh yêu em!", "Happy Anniversary", "Đừng giận tớ nữa nhé!", "I miss you"].map((msg, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setMessage(prev => prev ? prev + "\n" + msg : msg)}
                   className="px-3 py-1.5 bg-white border border-[#f0c2cd] rounded-[10px] shadow-sm text-black text-[13px] font-bold font-['Geologica'] hover:bg-[#FCE5EB] transition cursor-pointer"
                 >
                   {msg}
                 </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Progress bar */}
      <div className="w-[1131px] h-28 left-[150px] top-[135px] absolute overflow-hidden pointer-events-none">
        <div className="w-[982px] h-[1px] left-[70px] top-[47px] absolute bg-black"></div>
        {/* Bước 1: Hoa (Completed) */}
        <Link to="/custom-flowers" className="absolute left-[50px] top-[27px] pointer-events-auto">
          <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
        </Link>
        <Link to="/custom-flowers" className="absolute left-[39px] top-[75px] pointer-events-auto">
          <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Hoa</div>
        </Link>
        {/* Bước 2: Lá (Completed) */}
        <Link to="/custom-leaves" className="absolute left-[290px] top-[27px] pointer-events-auto">
          <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
        </Link>
        <Link to="/custom-leaves" className="absolute left-[281px] top-[75px] pointer-events-auto">
          <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Lá</div>
        </Link>
        {/* Bước 3: Túi (Completed) */}
        <Link to="/custom-bags" className="absolute left-[538px] top-[27px] pointer-events-auto">
          <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
        </Link>
        <Link to="/custom-bags" className="absolute left-[526px] top-[75px] pointer-events-auto">
          <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Túi</div>
        </Link>
        {/* Bước 4: Xem trước (Completed) */}
        <Link to="/custom-preview" className="absolute left-[620px] top-[15px] pointer-events-auto">
          <div className="w-16 h-16 bg-[#AF2E38] rounded-full flex items-center justify-center cursor-pointer">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2"/>
              <ellipse cx="12" cy="6" rx="1.8" ry="3"/>
              <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(60 12 12)"/>
              <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(120 12 12)"/>
              <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(180 12 12)"/>
              <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(240 12 12)"/>
              <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(300 12 12)"/>
            </svg>
          </div>
        </Link>
        <Link to="/custom-preview" className="absolute left-[605px] top-[75px] pointer-events-auto">
          <div className="w-24 h-6 text-center text-black text-xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Xem Trước</div>
        </Link>
        {/* Bước 5: Thiệp (Active) */}
        <Link to="/custom-cards" className="absolute left-[785px] top-[27px] pointer-events-auto">
          <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
        </Link>
        <Link to="/custom-cards" className="absolute left-[770px] top-[75px] pointer-events-auto">
          <div className="w-16 h-6 text-center text-[#AF2E38] text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Thiệp</div>
        </Link>
        {/* Bước 6: Thanh toán */}
        <div className="absolute left-[1032px] top-[27px]">
          <div className="w-10 h-10 bg-[#B8DAFF] rounded-full"></div>
        </div>
        <div className="absolute left-[982px] top-[75px]">
          <div className="w-32 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Thanh toán</div>
        </div>
      </div>
    </div>
  );
}
