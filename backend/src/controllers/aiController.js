import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// Helper tải ảnh URL → base64 inlineData cho Gemini
const urlToGenerativePart = async (url) => {
  let finalUrl = url;
  try {
    const isLocal = url.startsWith('/');
    finalUrl = isLocal ? `http://localhost:5173${url}` : url;
    const response = await axios.get(finalUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    return {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: response.headers['content-type'] || 'image/png'
      },
    };
  } catch (error) {
    console.error("Lỗi lấy ảnh:", finalUrl, error.message);
    return null;
  }
};

export const generatePreview = async (req, res) => {
  try {
    const { flowerUrl, leafUrl, bagUrl } = req.body;

    if (!flowerUrl) {
      return res.status(400).json({ message: "Thiếu ảnh hoa." });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ message: "Thiếu GEMINI_API_KEY trên server." });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    // ── BƯỚC 1: Vision → tạo prompt (cascade fallback) ──
    const VISION_MODELS = [
      "gemini-2.0-flash-lite",   // nhẹ nhất, ít bị overload nhất
      "gemini-2.0-flash-001",    // ổn định, versioned
      "gemini-2.5-flash",        // mạnh hơn nhưng hay bị 503
    ];

    const promptInstructions = `You are a professional floral photographer. I'm providing images of: a flower (required), optional leaf/greenery, and an optional bag/vase.
Analyze the exact colors, shapes, and textures of each item provided.
Write ONE single detailed English text-to-image prompt for a hyper-realistic studio photograph of a beautiful bouquet.
The bouquet must use EXACTLY these specific flowers and leaves, arranged inside this specific bag/vase.
CRITICAL: The prompt MUST specify a "wide angle, zoomed out, full body shot" ensuring the ENTIRE bag/vase and ALL flowers are fully visible in the frame with plenty of negative space around them. Do not crop the image.
Style requirements: high-end commercial product photography, soft warm studio lighting, bokeh background, photorealistic 8K.
Return ONLY the prompt text, no quotes, no explanation.`;

    const imageParts = [];
    const fPart = await urlToGenerativePart(flowerUrl);
    if (fPart) imageParts.push(fPart);
    if (leafUrl) { const lPart = await urlToGenerativePart(leafUrl); if (lPart) imageParts.push(lPart); }
    if (bagUrl)  { const bPart = await urlToGenerativePart(bagUrl);  if (bPart) imageParts.push(bPart); }

    let generatedPrompt = null;
    for (const vModel of VISION_MODELS) {
      try {
        console.log(`🧠 Vision thử model: ${vModel}`);
        const visionModel = genAI.getGenerativeModel({ model: vModel });
        const visionResult = await visionModel.generateContent([promptInstructions, ...imageParts]);
        generatedPrompt = visionResult.response.text().trim();
        console.log(`✅ Vision OK (${vModel}):`, generatedPrompt.substring(0, 80) + "...");
        break;
      } catch (ve) {
        console.warn(`⚠️ Vision ${vModel} thất bại:`, ve.message.substring(0, 100));
      }
    }

    if (!generatedPrompt) {
      return res.status(503).json({ message: "Tất cả Vision model đang bận. Vui lòng thử lại sau 30 giây." });
    }

    // ── BƯỚC 2: sinh ảnh với các model có hỗ trợ image output ──
    let base64Image = null;

    // Thử 1: gemini-2.5-flash-image (hỗ trợ image generation, có trong ListModels)
    try {
      console.log("🎨 Thử gemini-2.5-flash-image...");
      const imgModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
      const imgResult = await imgModel.generateContent({
        contents: [{ role: "user", parts: [{ text: generatedPrompt }] }],
        generationConfig: { responseModalities: ["image", "text"] }
      });
      const imgPart = imgResult.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (imgPart) {
        base64Image = `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
        console.log("✅ gemini-2.5-flash-image thành công!");
      }
    } catch (e1) {
      console.warn("⚠️ gemini-2.5-flash-image thất bại:", e1.message);
    }

    // Thử 2: gemini-3.1-flash-image-preview (fallback)
    if (!base64Image) {
      try {
        console.log("🔄 Thử gemini-3.1-flash-image-preview...");
        const imgModel2 = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
        const imgResult2 = await imgModel2.generateContent({
          contents: [{ role: "user", parts: [{ text: generatedPrompt }] }],
          generationConfig: { responseModalities: ["image", "text"] }
        });
        const imgPart2 = imgResult2.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imgPart2) {
          base64Image = `data:${imgPart2.inlineData.mimeType};base64,${imgPart2.inlineData.data}`;
          console.log("✅ gemini-3.1-flash-image-preview thành công!");
        }
      } catch (e2) {
        console.warn("⚠️ gemini-3.1-flash-image-preview thất bại:", e2.message);
      }
    }

    // Thử 4: Pollinations AI (Miễn phí 100%, không cần API Key - Giải pháp cứu cánh cho luồng miễn phí)
    if (!base64Image) {
      try {
        console.log("🔄 Thử Pollinations AI (Free Open Source Image Gen)...");
        // Mã hoá prompt để đưa lên URL
        const encodedPrompt = encodeURIComponent(generatedPrompt);
        // Gọi Pollinations tạo ảnh tỷ lệ 1:1, không có logo (nologo=true)
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true`;
        
        const polliResp = await axios.get(pollinationsUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(polliResp.data, 'binary');
        
        base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        console.log("✅ Pollinations AI thành công rực rỡ!");
      } catch (e4) {
        console.warn("⚠️ Pollinations AI cũng thất bại:", e4.message);
      }
    }

    if (!base64Image) {
      return res.status(500).json({
        message: "Tất cả model sinh ảnh đều bị chặn hoặc quá tải ở Free Tier.",
        prompt: generatedPrompt,
        hint: "Kiểm tra quota hoặc enable billing tại https://ai.dev/rate-limit"
      });
    }

    res.json({ imageBase64: base64Image, prompt: generatedPrompt });

  } catch (error) {
    const details = error.response?.data || error.message;
    console.error("AI Error:", details);
    res.status(500).json({ message: "Lỗi tạo ảnh AI", details });
  }
};
