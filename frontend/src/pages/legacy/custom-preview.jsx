import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE } from '../../api';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestPreviewWithRetry = async (url, payload, maxRetries = 1) => {
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return response;
    }

    const shouldRetry = response.status === 503 && attempt < maxRetries;
    if (!shouldRetry) {
      return response;
    }

    const retryAfterHeader = Number(response.headers.get("Retry-After"));
    const delayMs = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
      ? retryAfterHeader * 1000
      : 3000;

    console.warn(`Preview API quá tải, sẽ thử lại sau ${Math.round(delayMs / 1000)} giây...`);
    await sleep(delayMs);
  }

  return null;
};

export default function CustomPreview() {
  const backendUrl = API_BASE;
  const previewCacheVersion = 'preview-v2';
  
  const [aiImage, setAiImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalSubtotal, setTotalSubtotal] = useState(0);
  const [previewError, setPreviewError] = useState("");

  const location = useLocation();

  useEffect(() => {
    // 1. Calculate combined subtotal for displaying "Tạm tính"
    let subtotal = 0;
    const selectionKeys = ['flowerSelection', 'leafSelection', 'bagSelection'];
    selectionKeys.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        subtotal += Number(parsed?.subtotal) || 0;
      } catch (_e) {
        // Ignore malformed data from storage and keep remaining selections.
      }
    });
    setTotalSubtotal(subtotal);

    // 2. Prepare to fetch AI Preview or load from cache
      const fetchAIImage = async () => {
      setLoading(true);
      setPreviewError("");
      try {
        // Fetch all products to resolve IDs to ImageUrls
        const resProd = await fetch(`${backendUrl}/api/products`);
        if (!resProd.ok) throw new Error("Coud not fetch products");
        const allProducts = await resProd.json();

        const getItemsFromStorage = (storageKey) => {
          const raw = localStorage.getItem(storageKey);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          if (!parsed || !Array.isArray(parsed.items) || parsed.items.length === 0) return [];

          return parsed.items.reduce((acc, entry) => {
            const quantity = Math.max(0, Number(entry?.quantity) || 0);
            if (quantity <= 0) return acc;

            let resolvedUrl = entry?.imageUrl || null;
            if (!resolvedUrl && entry?.key) {
              const product = allProducts.find((p) => p._id === entry.key);
              resolvedUrl = product?.imageUrl || null;
            }

            if (resolvedUrl) {
              acc.push({
                key: entry?.key || "",
                label: String(entry?.label || "").trim(),
                imageUrl: resolvedUrl,
                quantity
              });
            }
            return acc;
          }, []);
        };

        const expandUrlsByQuantity = (items) =>
          items.flatMap((entry) => Array.from({ length: entry.quantity }).map(() => entry.imageUrl));

        const flowerItems = getItemsFromStorage('flowerSelection');
        const leafItems = getItemsFromStorage('leafSelection');
        const bagItems = getItemsFromStorage('bagSelection');
        const flowerUrls = expandUrlsByQuantity(flowerItems);
        const leafUrls = expandUrlsByQuantity(leafItems);
        const bagUrls = expandUrlsByQuantity(bagItems);
        const bagUrl = bagUrls[0] || null;
        const bagItem = bagItems[0] || null;

        if (flowerUrls.length === 0) {
          console.warn("No flower selected, AI preview needs at least a flower.");
          setPreviewError("Chưa có dữ liệu hoa để tạo preview.");
          setLoading(false);
          return;
        }

        // Kiểm tra xem tổ hợp Hoa + Lá + Túi hiện tại đã được sinh ảnh trước đó chưa (Cache hit)
        const currentComboKey = [
          flowerItems.map((item) => `${item.key}:${item.quantity}`).join('|'),
          leafItems.map((item) => `${item.key}:${item.quantity}`).join('|'),
          bagItem ? `${bagItem.key}:${bagItem.quantity}` : ''
        ].join('__');
        const cachedComboKey = localStorage.getItem('aiGeneratedComboKey');
        const cachedImage = localStorage.getItem('aiGeneratedImage');
        const cachedVersion = localStorage.getItem('aiGeneratedCacheVersion');

        if (cachedImage && cachedComboKey === currentComboKey && cachedVersion === previewCacheVersion) {
            console.log("Combo chưa đổi, dùng lại ảnh AI cũ tự động.");
            setAiImage(cachedImage);
          setPreviewError("");
            setLoading(false);
            return;
        }

        // Call our AI Backend
        const resAi = await requestPreviewWithRetry(
          `${backendUrl}/api/ai/preview`,
          {
            flowerUrls,
            leafUrls,
            bagUrl,
            flowerItems,
            leafItems,
            bagItem,
            strictReference: true
          },
          1
        );

        if (resAi?.ok) {
          const aiData = await resAi.json();
          if (aiData.imageBase64) {
            setAiImage(aiData.imageBase64);
            setPreviewError("");
            localStorage.setItem('customPreviewImage', aiData.imageBase64);
            localStorage.setItem('aiGeneratedImage', aiData.imageBase64);
            localStorage.setItem('aiGeneratedComboKey', currentComboKey);
            localStorage.setItem('aiGeneratedCacheVersion', previewCacheVersion);
          }
        } else {
          const rawError = resAi ? await resAi.text() : "No response from preview API after retries";
          console.error("AI Generation failed:", rawError);
          setPreviewError("Không thể tạo preview lúc này. Vui lòng thử lại sau ít phút.");

          try {
            const parsed = JSON.parse(rawError);
            if (parsed?.message) {
              setPreviewError(parsed.message);
            }
          } catch (_parseError) {}
        }
      } catch (error) {
        console.error("Error setting up AI Preview:", error);
        setPreviewError("Không thể kết nối server để tạo preview.");
      }
      setLoading(false);
    };

    fetchAIImage();
  }, [backendUrl, location.state]);

  const placeHolder = "https://placehold.co/791x607?text=AI+is+generating...";

  return (
    <div className="w-full overflow-x-auto overflow-y-visible py-4 bg-Color-3">
      {/* Outer wrapper matching Figma size */}
      <div
        className="relative mx-auto overflow-hidden bg-Color-3"
        style={{ width: 1440, minWidth: 1440, height: 1400 }}
      >
        
        {/* Main Stamp Container for AI Image */}
        <div className="w-[971px] h-[636px] left-[266px] top-[278px] absolute bg-rose-700 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-red-600 overflow-hidden flex items-center justify-center">
            {loading ? (
               <div className="text-white text-3xl font-['Geologica'] flex flex-col items-center">
                 <svg className="animate-spin h-16 w-16 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 AI ĐANG KẾT HỢP DỮ LIỆU... VUI LÒNG CHỜ
               </div>
            ) : aiImage ? (
               <img className="w-full h-full object-contain rounded-[20px]" src={aiImage} alt="AI Bouquet Output" />
            ) : (
               <div className="text-white text-xl font-['Geologica'] pr-8 pl-8 text-center">
                 {previewError || "Chưa có dữ liệu Hoa để dựng hình AI."}<br/>Hãy quay lại chọn Hoa/Lá/Túi trước nhé.
               </div>
            )}
        </div>

        {/* Buttons */}
        <Link to="/custom-cards" className="w-48 h-12 left-[1241px] top-[1024px] absolute overflow-hidden block hover:opacity-80 transition cursor-pointer">
            <div className="w-48 h-12 left-0 top-0 absolute bg-blue-200 rounded-[10px]"></div>
            <div className="left-[40px] top-[11px] absolute text-center justify-center text-rose-700 text-2xl font-normal font-['Geologica'] leading-7">TIẾP TỤC</div>
        </Link>
        <Link to="/custom-bags" className="w-48 h-12 left-[45px] top-[1018px] absolute overflow-hidden block hover:opacity-80 transition cursor-pointer">
            <div className="w-48 h-12 left-0 top-0 absolute bg-blue-200 rounded-[10px]"></div>
            <div className="left-[37px] top-[11px] absolute text-center justify-center text-rose-700 text-2xl font-normal font-['Geologica'] leading-7">QUAY LẠI</div>
        </Link>

        {/* Subtotal Box */}
        <div className="w-[609px] h-28 left-[431px] top-[940px] absolute bg-red-200/20 rounded-[10px]"></div>
        <div className="w-40 h-10 left-[449px] top-[977px] absolute text-center justify-center text-white text-3xl font-semibold font-['Geologica'] leading-10">Tạm tính</div>
        <div className="w-52 h-10 left-[773px] top-[977px] absolute text-right justify-center text-[#AF2E38] font-bold text-3xl font-['Geologica'] leading-10">
          {new Intl.NumberFormat('vi-VN').format(totalSubtotal)}đ
        </div>

        {/* Progress Bar (Đồng bộ với custom-bags) */}
        <div className="w-[1131px] h-28 left-[150px] top-[135px] absolute overflow-hidden z-20">
          <div className="w-[982px] h-[1px] left-[70px] top-[47px] absolute bg-black"></div>
          {/* Bước 1: Hoa (Completed) */}
          <Link to="/custom-flowers" className="absolute left-[50px] top-[27px]">
            <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
          </Link>
          <Link to="/custom-flowers" className="absolute left-[39px] top-[75px]">
            <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Hoa</div>
          </Link>
          {/* Bước 2: Lá (Completed) */}
          <Link to="/custom-leaves" className="absolute left-[290px] top-[25px]">
            <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
          </Link>
          <Link to="/custom-leaves" className="absolute left-[281px] top-[75px]">
            <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Lá</div>
          </Link>
          {/* Bước 3: Túi (Completed) */}
          <Link to="/custom-bags" className="absolute left-[538px] top-[25px]">
            <div className="w-10 h-10 bg-[#AF2E38] rounded-full cursor-pointer"></div>
          </Link>
          <Link to="/custom-bags" className="absolute left-[526px] top-[75px]">
            <div className="w-16 h-6 text-center text-black text-2xl font-extralight font-['Geologica'] leading-9 cursor-pointer">Túi</div>
          </Link>
          {/* Bước 4: Xem trước (AI) ACTIVE */}
          <Link to="/custom-preview" className="absolute left-[620px] top-[15px] cursor-pointer z-20">
            <div className="w-16 h-16 bg-[#AF2E38] rounded-full flex items-center justify-center shadow-lg">
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
          <div className="w-24 h-6 left-[600px] top-[75px] absolute text-center justify-center text-[#AF2E38] text-xl font-bold font-['Geologica'] leading-9">Xem Trước</div>

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

      </div>
    </div>
  );
}
