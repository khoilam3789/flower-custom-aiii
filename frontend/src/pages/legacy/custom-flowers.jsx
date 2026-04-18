import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE, fetchJson } from '../../api';

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
<div className="w-[1440px] h-[1000px] px-10 relative left-1/2 -translate-x-1/2 bg-Color-3 inline-flex flex-col justify-start items-center overflow-hidden">
  
  {/* Panel Tạm tính (Bên phải) */}
  <div className="w-[525px] h-[532px] left-[816px] top-[280px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
    <div className="w-[477px] h-[340px] left-[24px] top-[26px] absolute overflow-y-auto overflow-x-hidden scrollbar-hide pr-3">
      {selectedItems.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center text-zinc-400 text-base font-light font-['Geologica'] leading-6">
          Chưa có hoa nào được chọn
        </div>
      ) : (
        <div className="flex flex-col gap-3">
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
    <div className="w-40 h-10 left-[16px] top-[472px] absolute text-center justify-center text-white text-3xl font-semibold font-['Geologica'] leading-10">Tạm tính</div>
    <div className="w-52 h-10 left-[296px] top-[472px] absolute text-right justify-center text-white text-3xl font-light font-['Geologica'] leading-10">{new Intl.NumberFormat('vi-VN').format(subtotal)}</div>
  </div>

  {/* Panel Chọn Hoa (Bên trái) - Đã tái cấu trúc CSS */}
  <div className="w-[623px] h-[621px] left-[120px] top-[280px] absolute bg-[#AF2E38] rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-y-auto overflow-x-hidden scrollbar-hide scroll-smooth py-6 px-4">
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 w-full">
      {products.map((flower) => (
         <div key={flower._id} className="relative w-[256px] min-w-[256px] h-[320px] flex-none flex flex-col items-center" style={{ overflow: 'hidden' }}>
            {/* Background base */}
            <img className="absolute top-0 w-[256px] h-[320px] drop-shadow-md z-0" src="/images/CustomizeHoa/nenhoa.png" alt="nen" />
            
            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col z-10 pointer-events-none" style={{ padding: '24px 20px 20px 20px', gap: '8px', overflow: 'hidden' }}>
               {/* Price */}
               <div className="pointer-events-auto" style={{ fontSize: '12px', fontWeight: '700', fontStyle: 'italic', color: '#AF2E38', paddingLeft: '14px' }}>
                 {new Intl.NumberFormat('vi-VN').format(flower.price)} VNĐ/cành
               </div>
               
               {/* Image */}
               <div className="flex justify-center items-center pointer-events-auto" style={{ height: '152px' }}>
                 <img className="object-contain hover:scale-105 transition" style={{ height: '150px', width: 'auto' }} src={flower.imageUrl} alt={flower.name} />
               </div>
               
               {/* Name */}
               <div className="text-center pointer-events-auto" style={{ color: '#3B73A9', fontSize: '15px', fontWeight: '700', fontFamily: 'Geologica', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                 {flower.name}
               </div>
               
               {/* Description */}
               <div style={{ color: '#444', fontSize: '11px', fontStyle: 'italic', fontFamily: 'Geologica', lineHeight: '1.35', wordBreak: 'break-word', overflowWrap: 'break-word', overflow: 'hidden', textAlign: 'center', maxHeight: '42px', width: '100%', boxSizing: 'border-box', padding: '0 18px' }}>
                 {flower.description?.substring(0, 25)}{flower.description?.length > 25 ? '...' : ''}
               </div>

               {/* Buttons */}
               <div className="flex items-center justify-center gap-5 pointer-events-auto">
                 <button onClick={() => decrease(flower._id)} style={{ background: 'transparent', border: 'none', color: '#AF2E38', fontSize: '20px', fontWeight: '500', width: '30px', height: '30px', padding: 0, cursor: 'pointer' }}>-</button>
                 <span style={{ color: '#AF2E38', fontSize: '15px', fontWeight: '700', fontStyle: 'italic', width: '16px', textAlign: 'center' }}>{counts[flower._id] || 0}</span>
                 <button onClick={() => increase(flower._id)} style={{ background: 'transparent', border: 'none', color: '#AF2E38', fontSize: '20px', fontWeight: '500', width: '30px', height: '30px', padding: 0, cursor: 'pointer' }}>+</button>
               </div>
            </div>
         </div>
      ))}
    </div>
  </div>


  {/* Header Status Bar (Các bước điều hướng tĩnh) */}
  <div className="w-[1131px] h-28 left-[150px] top-[135px] absolute overflow-hidden">
    <div className="w-[982px] h-[1px] left-[70px] top-[47px] absolute bg-black"></div>
    {/* Bước 1: Hoa (active) */}
    <Link to="/custom-flowers" className="absolute left-[50px] top-[27px]">
      <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
    </Link>
    <Link to="/custom-flowers" className="absolute left-[39px] top-[75px]">
      <div className="w-16 h-6 text-center text-[#AF2E38] text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Hoa</div>
    </Link>
    {/* Bước 2: Lá */}
    <div className="absolute left-[290px] top-[25px]">
      <div className="w-10 h-10 bg-[#B8DAFF] rounded-full"></div>
    </div>
    <div className="absolute left-[281px] top-[75px]">
      <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Lá</div>
    </div>
    {/* Bước 3: Túi */}
    <div className="absolute left-[538px] top-[25px]">
      <div className="w-10 h-10 bg-[#B8DAFF] rounded-full"></div>
    </div>
    <div className="absolute left-[526px] top-[75px]">
      <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Túi</div>
    </div>
    {/* Bước 4: Xem trước (AI) */}
    <div className="absolute left-[620px] top-[15px] z-20">
      <div className="w-16 h-16 bg-[#B8DAFF] rounded-full flex items-center justify-center">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4A90C4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2"/>
          <ellipse cx="12" cy="6" rx="1.8" ry="3"/>
          <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(120 12 12)"/>
          <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(180 12 12)"/>
          <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(240 12 12)"/>
          <ellipse cx="12" cy="6" rx="1.8" ry="3" transform="rotate(300 12 12)"/>
        </svg>
      </div>
    </div>
    <div className="w-24 h-6 left-[600px] top-[75px] absolute text-center justify-center text-black text-xl font-extralight font-['Geologica'] leading-9">Xem Trước</div>
    {/* Bước 5: Thiệp */}
    <div className="absolute left-[785px] top-[25px]">
      <div className="w-10 h-10 bg-[#B8DAFF] rounded-full"></div>
    </div>
    <div className="absolute left-[770px] top-[75px]">
      <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Thiệp</div>
    </div>
    {/* Bước 6: Thanh toán */}
    <div className="absolute left-[1032px] top-[25px]">
      <div className="w-10 h-10 bg-[#B8DAFF] rounded-full"></div>
    </div>
    <div className="absolute left-[982px] top-[75px]">
      <div className="w-32 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Thanh toán</div>
    </div>
  </div>

  <Link to="/custom-leaves" onClick={handleContinue} className="absolute" style={{ right: '60px', top: '830px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: '#B8DAFF', borderRadius: '10px', padding: '12px 28px', color: '#AF2E38', fontSize: '24px', fontFamily: 'Geologica', fontWeight: '400', whiteSpace: 'nowrap' }}>TIẾP TỤC</div>
  </Link>
  
</div>
  );
}
