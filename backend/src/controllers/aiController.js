import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import AiConfig from "../models/AiConfig.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorStatus = (error) =>
  error?.status || error?.response?.status || error?.cause?.status || null;

const isTransientModelError = (error) => {
  const status = getErrorStatus(error);
  const message = String(error?.message || "").toLowerCase();

  if ([429, 500, 502, 503, 504].includes(status)) {
    return true;
  }

  return ["overloaded", "busy", "rate", "quota", "unavailable", "timed out"].some((token) =>
    message.includes(token)
  );
};

const ALLOWED_IMAGE_PROVIDERS = ["auto", "gemini-only", "pollinations-only"];

const maskApiKey = (key = "") => {
  if (!key) return "";
  if (key.length <= 8) return "********";
  return `${"*".repeat(Math.max(0, key.length - 4))}${key.slice(-4)}`;
};

const resolveAiConfig = async () => {
  try {
    const config = await AiConfig.findOne({ singletonKey: "default" }).lean();
    const provider = config?.imageProvider;
    const imageProvider = ALLOWED_IMAGE_PROVIDERS.includes(provider) ? provider : "auto";
    const geminiApiKey = String(config?.geminiApiKey || "").trim();
    return { imageProvider, geminiApiKey };
  } catch (_error) {
    return { imageProvider: "auto", geminiApiKey: "" };
  }
};

export const getAiSettings = async (_req, res) => {
  try {
    let config = await AiConfig.findOne({ singletonKey: "default" });
    if (!config) {
      config = await AiConfig.create({ singletonKey: "default", imageProvider: "auto", geminiApiKey: "" });
    }

    res.json({
      imageProvider: config.imageProvider,
      hasGeminiApiKey: Boolean(config.geminiApiKey),
      maskedGeminiApiKey: maskApiKey(config.geminiApiKey)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAiSettings = async (req, res) => {
  try {
    const nextProvider = String(req.body?.imageProvider || "").trim();
    if (!ALLOWED_IMAGE_PROVIDERS.includes(nextProvider)) {
      return res.status(400).json({
        message: "imageProvider không hợp lệ. Dùng: auto | gemini-only | pollinations-only"
      });
    }

    const patch = {
      singletonKey: "default",
      imageProvider: nextProvider
    };

    if (req.body?.clearGeminiApiKey === true) {
      patch.geminiApiKey = "";
    } else if (typeof req.body?.geminiApiKey === "string") {
      const nextApiKey = req.body.geminiApiKey.trim();
      if (nextApiKey) {
        patch.geminiApiKey = nextApiKey;
      }
    }

    const updated = await AiConfig.findOneAndUpdate(
      { singletonKey: "default" },
      patch,
      { upsert: true, new: true }
    );

    res.json({
      imageProvider: updated.imageProvider,
      hasGeminiApiKey: Boolean(updated.geminiApiKey),
      maskedGeminiApiKey: maskApiKey(updated.geminiApiKey)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper tải ảnh URL → base64 inlineData cho Gemini
const urlToGenerativePart = async (url) => {
  let finalUrl = url;
  try {
    const isLocal = url.startsWith('/');
    const frontendOrigin = process.env.CLIENT_ORIGIN
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5173");
    finalUrl = isLocal ? new URL(url, frontendOrigin).toString() : url;
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
    const {
      flowerUrl,
      leafUrl,
      bagUrl,
      flowerUrls: incomingFlowerUrls,
      leafUrls: incomingLeafUrls
    } = req.body;
    const { imageProvider, geminiApiKey } = await resolveAiConfig();

    const normalizeUrlList = (listValue, fallbackSingle) => {
      if (Array.isArray(listValue)) {
        return listValue
          .map((item) => String(item || "").trim())
          .filter(Boolean);
      }
      const single = String(fallbackSingle || "").trim();
      return single ? [single] : [];
    };

    const flowerUrls = normalizeUrlList(incomingFlowerUrls, flowerUrl);
    const leafUrls = normalizeUrlList(incomingLeafUrls, leafUrl);
    const trimmedBagUrl = String(bagUrl || "").trim();

    if (flowerUrls.length === 0) {
      return res.status(400).json({ message: "Thiếu ảnh hoa." });
    }

    const API_KEY = geminiApiKey || process.env.GEMINI_API_KEY;
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

    const promptInstructions = `You are a professional floral photographer.
I provide reference images in this order:
- first: flowers (can contain duplicates to indicate quantity)
- then: leaves/greenery (can contain duplicates to indicate quantity)
- last: optional bag/vase

Your task:
1) Analyze exact color, texture, petal/leaf shape, and silhouette of EACH reference.
2) Write ONE single detailed English prompt for a hyper-realistic studio photo.
3) The bouquet must match these references EXACTLY. Do not invent extra flower species, extra leaves, extra accessories, ribbons, cards, or fillers.
4) Preserve quantity impression: repeated references mean that item should appear more times.
5) Keep full bouquet and full bag/vase visible in frame (wide angle, zoomed out, no crop).
6) Neutral clean background, soft studio lighting, realistic product-photo style.

Return ONLY the prompt text, no explanation.`;

    const quantitySummary = [
      `Flowers image count: ${flowerUrls.length}`,
      `Leaves image count: ${leafUrls.length}`,
      `Has bag image: ${trimmedBagUrl ? "yes" : "no"}`
    ].join("\n");

    const imageParts = [];
    for (const url of flowerUrls.slice(0, 12)) {
      const fPart = await urlToGenerativePart(url);
      if (fPart) imageParts.push(fPart);
    }
    for (const url of leafUrls.slice(0, 8)) {
      const lPart = await urlToGenerativePart(url);
      if (lPart) imageParts.push(lPart);
    }
    if (trimmedBagUrl) {
      const bPart = await urlToGenerativePart(trimmedBagUrl);
      if (bPart) imageParts.push(bPart);
    }

    if (imageParts.length === 0) {
      return res.status(400).json({ message: "Không đọc được ảnh nguyên liệu từ payload." });
    }

    let generatedPrompt = null;
    let usedVisionModel = null;
    for (const vModel of VISION_MODELS) {
      const MAX_VISION_RETRIES = 2;
      const BASE_DELAY_MS = 1200;

      for (let attempt = 1; attempt <= MAX_VISION_RETRIES + 1; attempt += 1) {
        try {
          console.log(`🧠 Vision thử model: ${vModel} (lần ${attempt})`);
          const visionModel = genAI.getGenerativeModel({ model: vModel });
          const visionResult = await visionModel.generateContent([
            promptInstructions,
            quantitySummary,
            ...imageParts
          ]);
          generatedPrompt = visionResult.response.text().trim();
          usedVisionModel = vModel;
          console.log(`✅ Vision OK (${vModel}):`, generatedPrompt.substring(0, 80) + "...");
          break;
        } catch (ve) {
          const shortMessage = String(ve?.message || "Unknown error").substring(0, 140);
          const shouldRetry = isTransientModelError(ve) && attempt <= MAX_VISION_RETRIES;
          console.warn(`⚠️ Vision ${vModel} thất bại (lần ${attempt}):`, shortMessage);

          if (!shouldRetry) {
            break;
          }

          const backoffMs = BASE_DELAY_MS * attempt;
          console.log(`⏳ Retry Vision ${vModel} sau ${backoffMs}ms...`);
          await wait(backoffMs);
        }
      }

      if (generatedPrompt) {
        break;
      }
    }

    if (!generatedPrompt) {
      res.set("Retry-After", "30");
      return res.status(503).json({ message: "Tất cả Vision model đang bận. Vui lòng thử lại sau 30 giây." });
    }

    // ── BƯỚC 2: sinh ảnh với các model có hỗ trợ image output ──
    let base64Image = null;
    let usedImageModel = null;
    let usedImageBackend = null;
    const shouldTryGeminiImage = imageProvider !== "pollinations-only";
    const shouldTryPollinations = imageProvider !== "gemini-only";

    const generateWithImageModel = async (modelName) => {
      const MAX_IMAGE_RETRIES = 1;
      const BASE_DELAY_MS = 1000;

      for (let attempt = 1; attempt <= MAX_IMAGE_RETRIES + 1; attempt += 1) {
        try {
          console.log(`🎨 Thử ${modelName} (lần ${attempt})...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: generatedPrompt }] }],
            generationConfig: { responseModalities: ["image", "text"] }
          });

          const imgPart = result.response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
          if (imgPart?.inlineData?.data && imgPart?.inlineData?.mimeType) {
            console.log(`✅ ${modelName} thành công!`);
            usedImageModel = modelName;
            usedImageBackend = "gemini";
            return `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
          }

          throw new Error(`${modelName} không trả về image inlineData.`);
        } catch (error) {
          const shortMessage = String(error?.message || "Unknown error").substring(0, 140);
          const shouldRetry = isTransientModelError(error) && attempt <= MAX_IMAGE_RETRIES;
          console.warn(`⚠️ ${modelName} thất bại (lần ${attempt}):`, shortMessage);

          if (!shouldRetry) {
            break;
          }

          const backoffMs = BASE_DELAY_MS * attempt;
          console.log(`⏳ Retry ${modelName} sau ${backoffMs}ms...`);
          await wait(backoffMs);
        }
      }

      return null;
    };

    if (shouldTryGeminiImage) {
      // Thử 1: gemini-2.5-flash-image (hỗ trợ image generation, có trong ListModels)
      base64Image = await generateWithImageModel("gemini-2.5-flash-image");

      // Thử 2: gemini-3.1-flash-image-preview (fallback)
      if (!base64Image) {
        base64Image = await generateWithImageModel("gemini-3.1-flash-image-preview");
      }
    }

    // Thử 4: Pollinations AI (Miễn phí 100%, không cần API Key - Giải pháp cứu cánh cho luồng miễn phí)
    if (!base64Image && shouldTryPollinations) {
      try {
        console.log("🔄 Thử Pollinations AI (Free Open Source Image Gen)...");
        // Mã hoá prompt để đưa lên URL
        const encodedPrompt = encodeURIComponent(generatedPrompt);
        // Gọi Pollinations tạo ảnh tỷ lệ 1:1, không có logo (nologo=true)
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true`;
        
        const polliResp = await axios.get(pollinationsUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(polliResp.data, 'binary');
        
        base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        usedImageModel = "pollinations";
        usedImageBackend = "pollinations";
        console.log("✅ Pollinations AI thành công rực rỡ!");
      } catch (e4) {
        console.warn("⚠️ Pollinations AI cũng thất bại:", e4.message);
      }
    }

    if (!base64Image) {
      return res.status(500).json({
        message: "Tất cả model sinh ảnh đều bị chặn hoặc quá tải ở Free Tier.",
        prompt: generatedPrompt,
        provider: imageProvider,
        hint: "Kiểm tra quota hoặc enable billing tại https://ai.dev/rate-limit"
      });
    }

    res.json({
      imageBase64: base64Image,
      prompt: generatedPrompt,
      provider: imageProvider,
      usedVisionModel,
      usedImageModel,
      usedImageBackend,
      flowerCount: flowerUrls.length,
      leafCount: leafUrls.length,
      hasBag: Boolean(trimmedBagUrl)
    });

  } catch (error) {
    const details = error.response?.data || error.message;
    console.error("AI Error:", details);
    res.status(500).json({ message: "Lỗi tạo ảnh AI", details });
  }
};
