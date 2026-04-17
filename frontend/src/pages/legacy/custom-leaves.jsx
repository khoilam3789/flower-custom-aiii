import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../api';

export default function Customleaves(){
  const FLOWER_STORAGE_KEY = 'flowerSelection';
  const LEAF_STORAGE_KEY = 'leafSelection';
  const backendUrl = API_BASE;
  
  const [products, setProducts] = useState([]);
  const [counts, setCounts] = useState({});
  const [flowerSubtotal, setFlowerSubtotal] = useState(0);
  const [flowerItems, setFlowerItems] = useState([]);

  useEffect(() => {
    // Lấy tổng tiền hoa và danh sách hoa đã chọn
    try {
      const raw = localStorage.getItem(FLOWER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setFlowerSubtotal(parsed.subtotal || 0);
        setFlowerItems(parsed.items || []);
      }
    } catch (e) {}

    // Fetch lá từ DB
    const fetchLeaves = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/products?category=leaf`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          restoreCart(data);
        }
      } catch (e) {
        console.error("Lỗi lấy nguyên liệu lá:", e);
      }
    };
    fetchLeaves();
  }, []);

  const restoreCart = (availableProducts) => {
    try {
      const raw = localStorage.getItem(LEAF_STORAGE_KEY);
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
    } catch (_error) {}
  };

  const toggleSelection = (id) => {
    setCounts((prev) => {
      // Nếu đang chọn rồi mà bấm lại thì hũy chọn
      if (prev[id] === 1) return {}; 
      // Nếu bấm chọn cái mới thì xoá cái cũ, chỉ giữ cái mới (mutually exclusive)
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

  const leafSubtotal = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalSubtotal = flowerSubtotal + leafSubtotal;

  const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`;

  const persistSelection = () => {
    const payload = {
      items: selectedItems.map((item) => ({
        key: item.key,
        label: item.label,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.lineTotal
      })),
      subtotal: leafSubtotal,
      updatedAt: Date.now()
    };
    localStorage.setItem(LEAF_STORAGE_KEY, JSON.stringify(payload));
    localStorage.removeItem('aiGeneratedImage');
    localStorage.removeItem('aiGeneratedComboKey');
    localStorage.removeItem('aiGeneratedCacheVersion');
  };

  useEffect(() => {
    persistSelection();
  }, [leafSubtotal, counts]);

  const handleContinue = () => {
    persistSelection();
  };

  return (
<div className="w-[1440px] h-[1000px] px-10 relative left-1/2 -translate-x-1/2 bg-Color-3 inline-flex flex-col justify-start items-center overflow-hidden">
  
  <div className="w-[525px] h-[532px] left-[816px] top-[280px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
    <div className="w-[477px] h-[340px] left-[24px] top-[26px] absolute overflow-y-auto overflow-x-hidden scrollbar-hide pr-3">
      {flowerItems.length === 0 && selectedItems.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center text-zinc-400 text-base font-light font-['Geologica'] leading-6">
          Chưa có gì được chọn
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Hiển thị hoa đã chọn từ trang trước */}
          {flowerItems.map((item) => (
            <div key={item.key} className="w-full px-4 py-3 bg-[#FAF9F5] rounded-lg flex items-center justify-between">
              <span className="text-[#AF2E38] text-lg font-normal font-['Geologica'] leading-6">x{item.quantity} {item.label}</span>
              <span className="text-[#AF2E38] text-lg font-semibold font-['Geologica'] leading-6">{formatPrice(item.lineTotal)}</span>
            </div>
          ))}
          {/* Hiển thị lá đã chọn */}
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
    <div className="w-40 h-10 left-[16px] top-[472px] absolute text-center justify-center text-white text-xl font-semibold font-['Geologica'] leading-10">Tạm tính (+Hoa)</div>
    <div className="w-52 h-10 left-[296px] top-[472px] absolute text-right justify-center text-white text-3xl font-light font-['Geologica'] leading-10">{formatPrice(totalSubtotal)}</div>
  </div>

  <div className="w-[623px] h-[621px] left-[120px] top-[280px] absolute bg-[#AF2E38] rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-y-auto overflow-x-hidden scrollbar-hide p-6">
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 w-full">
      {products.map((leaf) => (
         <div key={leaf._id} className="relative w-[256px] min-w-[256px] h-[320px] flex-none flex flex-col items-center" style={{ overflow: 'hidden' }}>
            {/* Background base */}
            <img className="absolute top-0 w-[256px] h-[320px] drop-shadow-md z-0" src="/images/Customizela/nenhoa.png" alt="nen" />
            
            {/* Inner Content - natural top-to-bottom flow */}
            <div className="absolute inset-0 flex flex-col z-10 pointer-events-none" style={{ padding: '32px 24px 24px 24px', gap: '6px', overflow: 'hidden' }}>
               {/* Price */}
               <div className="pointer-events-auto" style={{ fontSize: '11px', fontWeight: '700', fontStyle: 'italic', color: '#AF2E38', paddingLeft: '20px' }}>
                 {new Intl.NumberFormat('vi-VN').format(leaf.price)} VNĐ/lá
               </div>
               
               {/* Image */}
               <div className="flex justify-center items-center pointer-events-auto" style={{ height: '130px' }}>
                 <img className="object-contain hover:scale-105 transition" style={{ height: '125px', width: 'auto' }} src={leaf.imageUrl} alt={leaf.name} />
               </div>
               
               {/* Name */}
               <div className="text-center pointer-events-auto" style={{ color: '#3B73A9', fontSize: '13px', fontWeight: '700', fontFamily: 'Geologica', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                 {leaf.name}
               </div>
               
               {/* Description */}
               <div style={{ color: '#444', fontSize: '10px', fontStyle: 'italic', fontFamily: 'Geologica', lineHeight: '1.3', wordBreak: 'break-all', overflowWrap: 'break-word', overflow: 'hidden', textAlign: 'center', maxHeight: '28px', width: '100%', boxSizing: 'border-box', padding: '0 28px' }}>
                 {leaf.description?.substring(0, 25)}{leaf.description?.length > 25 ? '...' : ''}
               </div>

               <div
                 onClick={() => toggleSelection(leaf._id)}
                 className="pointer-events-auto"
                 style={{
                   position: 'absolute', top: '52px', left: '62px',
                   width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer',
                   border: counts[leaf._id] ? '2px solid #3B73A9' : '2px solid #ccc',
                   background: 'white',
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   transition: 'all 0.2s',
                   boxShadow: counts[leaf._id] ? '0 0 0 3px rgba(59,115,169,0.15)' : 'none',
                   zIndex: 30
                 }}
               >
                 {counts[leaf._id] && (
                   <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B73A9' }}></div>
                 )}
               </div>
            </div>
         </div>
      ))}
    </div>
  </div>


  <div className="w-[1131px] h-28 left-[150px] top-[135px] absolute overflow-hidden">
    <div className="w-[982px] h-[1px] left-[70px] top-[47px] absolute bg-black"></div>
    {/* Bước 1: Hoa (Completed) */}
    <Link to="/custom-flowers" state={{ back: true }} className="absolute left-[50px] top-[27px]">
      <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
    </Link>
    <Link to="/custom-flowers" state={{ back: true }} className="absolute left-[39px] top-[75px]">
      <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Hoa</div>
    </Link>
    {/* Bước 2: Lá (active) */}
    <Link to="/custom-leaves" className="absolute left-[290px] top-[25px]">
      <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
    </Link>
    <Link to="/custom-leaves" className="absolute left-[281px] top-[75px]">
      <div className="w-16 h-6 text-center text-[#AF2E38] text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Lá</div>
    </Link>
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

  <Link to="/custom-bags" onClick={handleContinue} className="absolute" style={{ right: '60px', top: '830px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: '#B8DAFF', borderRadius: '10px', padding: '12px 28px', color: '#AF2E38', fontSize: '24px', fontFamily: 'Geologica', fontWeight: '400', whiteSpace: 'nowrap' }}>TIẾP TỤC</div>
  </Link>
  
</div>
  );
}
