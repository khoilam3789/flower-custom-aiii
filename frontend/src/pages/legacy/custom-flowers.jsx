import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE, fetchJson } from '../../api';
import StepBar from '../../components/StepBar';

export default function Customhoa(){
  const FLOWER_STORAGE_KEY = 'flowerSelection';
  const backendUrl = API_BASE;
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState({});

  const restoreCart = (availableProducts) => {
    try {
      const raw = localStorage.getItem(FLOWER_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : { items: [] };
      const restoredCounts = {};
      availableProducts.forEach(p => restoredCounts[p._id] = 0);
      if (Array.isArray(parsed.items)) {
        parsed.items.forEach((item) => {
          if (restoredCounts[item.key] !== undefined) {
            restoredCounts[item.key] = Math.max(0, Number(item.quantity) || 0);
          }
        });
      }
      setCounts(restoredCounts);
    } catch (_) {}
  };

  useEffect(() => {
    const isBack = location.state?.back === true;

    if (!isBack) {
      // Bắt đầu phiên mới → xóa toàn bộ data cũ
      localStorage.removeItem('flowerSelection');
      localStorage.removeItem('leafSelection');
      localStorage.removeItem('bagSelection');
      localStorage.removeItem('aiGeneratedImage');
      localStorage.removeItem('aiGeneratedComboKey');
      localStorage.removeItem('aiGeneratedCacheVersion');
    }

    const fetchFlowers = async () => {
      try {
        const data = await fetchJson('/api/products?category=flower');
        setProducts(data);
        if (isBack) {
          // Quay lại từ trang lá → restore lựa chọn cũ
          restoreCart(data);
        } else {
          // Phiên mới → counts = 0
          const initCounts = {};
          data.forEach(p => initCounts[p._id] = 0);
          setCounts(initCounts);
        }
      } catch (e) {
        console.error("Lỗi lấy nguyên liệu hoa:", e);
      }
    };
    fetchFlowers();
  }, []);

  const increase = (id) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrease = (id) => {
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
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

  const subtotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

  const buildPayload = () => ({
    items: selectedItems.map((item) => ({
      key: item.key,
      label: item.label,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    })),
    subtotal,
    updatedAt: Date.now()
  });

  const persistSelection = () => {
    if (Object.keys(counts).length > 0) {
      localStorage.setItem(FLOWER_STORAGE_KEY, JSON.stringify(buildPayload()));
    }
  };

  useEffect(() => {
    persistSelection();
  }, [subtotal, counts]);

  const handleContinue = () => {
    persistSelection();
  };

  return (
    <div className="w-full min-h-screen bg-Color-3 flex flex-col font-['Geologica'] overflow-x-hidden">
      <StepBar currentStep={1} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 lg:p-12 max-w-[1280px] mx-auto w-full flex-grow">
        
        {/* Panel Chọn Hoa (Bên trái) */}
        <div className="w-full lg:w-[60%] bg-[#AF2E38] rounded-[20px] p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh] scrollbar-hide shadow-inner">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 w-full">
            {products.map((flower) => (
              <div 
                key={flower._id} 
                className="relative w-full overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:shadow-lg"
                style={{ aspectRatio: '260/350' }}
              >
                {/* Background base */}
                <img className="absolute top-0 w-full h-full object-cover z-0" src="/images/CustomizeHoa/nenhoa.png" alt="nen" />
                
                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col z-10 p-2 gap-1">
                   {/* Price */}
                   <div className="text-[11px] font-bold italic text-[#AF2E38] pl-1 z-20 shrink-0">
                     {new Intl.NumberFormat('vi-VN').format(flower.price)} VNĐ
                   </div>
                   
                   {/* Image */}
                   <div className="flex-1 min-h-0 flex justify-center items-center z-20 overflow-hidden">
                     <img className="object-contain w-[80%] h-[80%] transition-transform duration-300 hover:scale-110" src={flower.imageUrl} alt={flower.name} />
                   </div>
                   
                   {/* Bottom Content Group (Name, Desc, Buttons) pinned down */}
                   <div className="flex flex-col shrink-0 items-center z-20">
                     {/* Name */}
                     <div className="text-center text-[#3B73A9] text-[11px] sm:text-[13px] font-bold line-clamp-1 px-1 leading-snug">
                       {flower.name}
                     </div>
                     
                     {/* Description */}
                     <div className="text-[#444] text-[9px] sm:text-[11px] italic leading-tight text-center line-clamp-1 px-1 pb-1 hidden xs:block">
                       {flower.description}
                     </div>

                     {/* Buttons */}
                     <div className="flex items-center justify-center gap-2 pb-1">
                       <button onClick={(e) => { e.preventDefault(); decrease(flower._id); }} className="text-[#AF2E38] text-xl font-black w-6 h-6 flex items-center justify-center hover:bg-rose-50 rounded-full transition shadow-sm bg-white/50">-</button>
                       <span className="text-[#AF2E38] text-sm font-bold italic w-4 text-center">{counts[flower._id] || 0}</span>
                       <button onClick={(e) => { e.preventDefault(); increase(flower._id); }} className="text-[#AF2E38] text-xl font-black w-6 h-6 flex items-center justify-center hover:bg-rose-50 rounded-full transition shadow-sm bg-white/50">+</button>
                     </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Tạm tính (Bên phải) */}
        <div className="w-full lg:w-[40%] bg-white rounded-[10px] border border-[#AF2E38] flex flex-col overflow-hidden shadow-sm h-[400px] lg:h-auto">
          {/* List Items */}
          <div className="flex-grow overflow-y-auto scrollbar-hide p-4 md:p-6">
            {selectedItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-zinc-400 text-base font-light">
                Chưa có hoa nào được chọn
              </div>
            ) : (
              <div className="flex flex-col gap-3">
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
            <span className="text-xl md:text-3xl font-light">{new Intl.NumberFormat('vi-VN').format(subtotal)}đ</span>
          </div>
        </div>

      </div>

      {/* Continue Button */}
      <div className="flex justify-center md:justify-end px-4 md:px-12 pb-12 pt-4">
        <Link 
          to="/custom-leaves" 
          onClick={handleContinue} 
          className="bg-[#B8DAFF] text-[#AF2E38] text-xl md:text-2xl font-normal py-3 px-8 rounded-[10px] hover:bg-blue-200 transition-colors shadow-md w-full md:w-auto text-center"
        >
          TIẾP TỤC
        </Link>
      </div>

    </div>
  );
}
