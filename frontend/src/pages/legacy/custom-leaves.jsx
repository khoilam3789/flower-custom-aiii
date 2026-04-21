import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../api';
import StepBar from '../../components/StepBar';

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
    <div className="w-full min-h-screen bg-Color-3 flex flex-col font-['Geologica'] overflow-x-hidden">
      <StepBar currentStep={2} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 lg:p-12 max-w-[1280px] mx-auto w-full flex-grow">
        
        {/* Panel Chọn Lá (Bên trái) */}
        <div className="w-full lg:w-[60%] bg-[#AF2E38] rounded-[20px] p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh] scrollbar-hide shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {products.map((leaf) => (
              <div 
                key={leaf._id} 
                className="relative w-full max-w-[260px] aspect-[260/330] flex flex-col items-center overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:shadow-lg cursor-pointer"
                onClick={() => toggleSelection(leaf._id)}
              >
                {/* Background base */}
                <img className="absolute top-0 w-full h-full object-cover z-0" src="/images/CustomizeHoa/nenhoa.png" alt="nen" />
                
                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col z-10 p-4 gap-2">
                   {/* Price */}
                   <div className="text-[13px] font-bold italic text-[#AF2E38] pl-2 z-20">
                     {new Intl.NumberFormat('vi-VN').format(leaf.price)} VNĐ
                   </div>
                   
                   {/* Image */}
                   <div className="flex justify-center items-center h-[40%] md:h-[45%] z-20">
                     <img className="object-contain hover:scale-105 transition h-full" src={leaf.imageUrl} alt={leaf.name} />
                   </div>
                   
                   {/* Name */}
                   <div className="text-center text-[#3B73A9] text-base md:text-[17px] font-bold truncate px-2 z-20">
                     {leaf.name}
                   </div>
                   
                   {/* Description */}
                   <div className="text-[#444] text-xs italic leading-tight text-center line-clamp-2 px-2 z-20">
                     {leaf.description}
                   </div>

                   {/* Custom Checkbox */}
                   <div
                     onClick={(e) => {
                       e.stopPropagation();
                       toggleSelection(leaf._id);
                     }}
                     className="absolute top-[52px] left-[62px] w-[22px] h-[22px] rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 z-30"
                     style={{
                       border: counts[leaf._id] ? '2px solid #3B73A9' : '2px solid #ccc',
                       background: 'white',
                       boxShadow: counts[leaf._id] ? '0 0 0 3px rgba(59,115,169,0.15)' : 'none',
                     }}
                   >
                     {counts[leaf._id] === 1 && (
                       <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B73A9' }}></div>
                     )}
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
            {flowerItems.length === 0 && selectedItems.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-zinc-400 text-base font-light">
                Chưa có gì được chọn
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Hiển thị hoa đã chọn từ trang trước */}
                {flowerItems.map((item) => (
                  <div key={item.key} className="w-full px-4 py-3 bg-[#FAF9F5] rounded-lg flex items-center justify-between border border-rose-50 shadow-sm opacity-80">
                    <span className="text-[#AF2E38] text-base md:text-lg font-normal break-words max-w-[60%]">x{item.quantity} {item.label}</span>
                    <span className="text-[#AF2E38] text-base md:text-lg font-semibold whitespace-nowrap">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
                {/* Hiển thị lá đã chọn */}
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
            <span className="text-lg md:text-xl font-semibold">Tạm tính (+Hoa)</span>
            <span className="text-xl md:text-3xl font-light">{new Intl.NumberFormat('vi-VN').format(totalSubtotal)}đ</span>
          </div>
        </div>

      </div>

      {/* Continue Button */}
      <div className="flex justify-center md:justify-end px-4 md:px-12 pb-12 pt-4">
        <Link 
          to="/custom-bags" 
          onClick={handleContinue} 
          className="bg-[#B8DAFF] text-[#AF2E38] text-xl md:text-2xl font-normal py-3 px-8 rounded-[10px] hover:bg-blue-200 transition-colors shadow-md w-full md:w-auto text-center"
        >
          TIẾP TỤC
        </Link>
      </div>

    </div>
  );
}
