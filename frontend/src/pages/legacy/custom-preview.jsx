import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from '../../api';
import StepBar from '../../components/StepBar';

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
  const [previewMeta, setPreviewMeta] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

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
      setPreviewMeta(null);
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
            setPreviewMeta({
              backend: aiData.usedImageBackend || "unknown",
              imageModel: aiData.usedImageModel || "unknown",
              visionModel: aiData.usedVisionModel || "unknown",
              signature: aiData.selectionSignature || ""
            });
            localStorage.setItem('customPreviewImage', aiData.imageBase64);
            localStorage.setItem('aiGeneratedImage', aiData.imageBase64);
            localStorage.setItem('aiGeneratedComboKey', currentComboKey);
            localStorage.setItem('aiGeneratedCacheVersion', previewCacheVersion);

            if ((aiData.usedImageBackend || "") !== "gemini") {
              console.warn("Preview đang chạy fallback backend:", aiData.usedImageBackend, aiData.usedImageModel);
            }
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
    <div className="w-full min-h-screen bg-Color-3 flex flex-col font-['Geologica']">
      <StepBar currentStep={4} />

      {/* Main Content Area */}
      <div className="flex flex-col gap-6 p-4 md:p-8 lg:p-12 max-w-[1280px] mx-auto w-full flex-grow items-center">
        
        {/* Main Stamp Container for AI Image */}
        <div className="w-full lg:w-[80%] max-w-[1000px] aspect-[16/10] bg-rose-700 rounded-[20px] outline outline-2 outline-offset-[-2px] outline-red-600 overflow-hidden flex flex-col items-center justify-center p-4 shadow-xl">
            {loading ? (
               <div className="text-white text-xl md:text-3xl font-['Geologica'] flex flex-col items-center text-center px-4">
                 <svg className="animate-spin h-12 w-12 md:h-16 md:w-16 text-white mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 AI ĐANG KẾT HỢP DỮ LIỆU... VUI LÒNG CHỜ
               </div>
            ) : aiImage ? (
               <img className="w-full h-full object-contain rounded-[10px]" src={aiImage} alt="AI Bouquet Output" />
            ) : (
               <div className="text-white text-lg md:text-xl font-['Geologica'] px-4 md:px-8 text-center bg-black/20 p-6 rounded-xl backdrop-blur-sm">
                 {previewError || "Chưa có dữ liệu Hoa để dựng hình AI."}<br/><span className="mt-2 block opacity-80">Hãy quay lại chọn Hoa/Lá/Túi trước nhé.</span>
               </div>
            )}
        </div>

        {previewMeta && (
          <div className="text-[11px] md:text-[12px] text-zinc-500 text-center font-['Geologica'] mt-[-10px]">
            AI backend: {previewMeta.backend} | Image model: {previewMeta.imageModel} | Vision model: {previewMeta.visionModel}
          </div>
        )}

        {/* Subtotal & Actions Bottom Bar */}
        <div className="w-full lg:w-[80%] max-w-[1000px] flex flex-col md:flex-row justify-between items-center gap-6 mt-4">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/custom-bags')}
            className="w-full md:w-auto min-w-[200px] order-3 md:order-1 px-8 py-3 bg-blue-100/80 hover:bg-blue-200 text-rose-700 text-xl font-semibold rounded-[10px] transition-colors shadow-sm text-center"
          >
            QUAY LẠI
          </button>

          {/* Subtotal Display */}
          <div className="w-full md:w-auto flex-grow order-1 md:order-2 bg-red-50/50 outline outline-1 outline-rose-200 rounded-[10px] p-4 flex justify-between items-center px-6 md:px-12 shadow-sm backdrop-blur-sm h-full min-h-[60px]">
            <span className="text-[#AF2E38] text-xl md:text-2xl font-bold">Tạm tính</span>
            <span className="text-[#AF2E38] text-2xl md:text-3xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(totalSubtotal)}đ
            </span>
          </div>

          {/* Continue Button */}
          <Link 
            to="/custom-cards" 
            className="w-full md:w-auto min-w-[200px] order-2 md:order-3 px-8 py-3 bg-blue-200 hover:bg-blue-300 text-rose-700 text-xl font-semibold rounded-[10px] transition-colors shadow-sm text-center"
          >
            TIẾP TỤC
          </Link>
          
        </div>

      </div>
    </div>
  );
}
