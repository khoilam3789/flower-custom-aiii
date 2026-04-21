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

const createStableSignature = (payload) => {
  const raw = JSON.stringify(payload || "");
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
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
      leafUrls: incomingLeafUrls,
      flowerItems: incomingFlowerItems,
      leafItems: incomingLeafItems,
      bagItem: incomingBagItem,
      strictReference
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
    const useStrictReference = strictReference !== false;

    const normalizeItemList = (items, fallbackUrls = []) => {
      if (!Array.isArray(items) || items.length === 0) {
        return fallbackUrls.map((url, index) => ({
          key: `fallback-${index + 1}`,
          label: `item-${index + 1}`,
          quantity: 1,
          imageUrl: url
        }));
      }

      return items
        .map((item, index) => {
          const imageUrl = String(item?.imageUrl || "").trim();
          const quantity = Math.max(1, Number(item?.quantity) || 1);
          return {
            key: String(item?.key || `item-${index + 1}`).trim(),
            label: String(item?.label || `item-${index + 1}`).trim(),
            quantity,
            imageUrl
          };
        })
        .filter((item) => item.imageUrl);
    };

    const normalizedFlowerItems = normalizeItemList(incomingFlowerItems, flowerUrls);
    const normalizedLeafItems = normalizeItemList(incomingLeafItems, leafUrls);
    const normalizedBagItem = incomingBagItem && String(incomingBagItem?.imageUrl || "").trim()
      ? {
          key: String(incomingBagItem?.key || "bag").trim(),
          label: String(incomingBagItem?.label || "bag").trim(),
          quantity: Math.max(1, Number(incomingBagItem?.quantity) || 1),
          imageUrl: String(incomingBagItem.imageUrl).trim()
        }
      : null;

    if (flowerUrls.length === 0) {
      return res.status(400).json({ message: "Thiếu ảnh hoa." });
    }

    const API_KEY = String(geminiApiKey || process.env.GEMINI_API_KEY || "").trim();
    const hasGeminiApiKey = Boolean(API_KEY);

    if (imageProvider === "gemini-only" && !hasGeminiApiKey) {
      return res.status(500).json({
        message: "Đang để gemini-only nhưng thiếu GEMINI_API_KEY. Hãy set API key hoặc đổi provider sang auto."
      });
    }

    const genAI = hasGeminiApiKey ? new GoogleGenerativeAI(API_KEY) : null;

    const formatItemSummaryLine = (item) =>
      `- ${item.label || item.key}: exactly ${item.quantity}`;

    const selectionSignature = createStableSignature({
      flowers: normalizedFlowerItems.map((item) => ({ key: item.key, quantity: item.quantity })),
      leaves: normalizedLeafItems.map((item) => ({ key: item.key, quantity: item.quantity })),
      bag: normalizedBagItem ? { key: normalizedBagItem.key, quantity: normalizedBagItem.quantity } : null,
      strictReference: useStrictReference
    });

    const referenceParts = [];

    for (const item of normalizedFlowerItems.slice(0, 12)) {
      const flowerPart = await urlToGenerativePart(item.imageUrl);
      if (!flowerPart) continue;
      referenceParts.push(flowerPart);
      referenceParts.push({
        text: `Flower reference: ${item.label}. Use exactly ${item.quantity} stems of this flower type.`
      });
    }

    for (const item of normalizedLeafItems.slice(0, 8)) {
      const leafPart = await urlToGenerativePart(item.imageUrl);
      if (!leafPart) continue;
      referenceParts.push(leafPart);
      referenceParts.push({
        text: `Leaf reference: ${item.label}. Use exactly ${item.quantity} stems/leaves of this greenery type.`
      });
    }

    if (normalizedBagItem?.imageUrl) {
      const bagPart = await urlToGenerativePart(normalizedBagItem.imageUrl);
      if (bagPart) {
        referenceParts.push(bagPart);
        referenceParts.push({
          text: `Bag/container reference: ${normalizedBagItem.label}. Match this container shape, color, and structure.`
        });
      }
    }

    if (referenceParts.length === 0) {
      return res.status(400).json({ message: "Không đọc được ảnh nguyên liệu từ payload." });
    }

    const usedVisionModel = "direct-reference-prompt";

    const finalImagePrompt = [
      "3D digital art render of a floral arrangement.",
      "Style: clean, polished, soft studio lighting, cinematic product-photo look.",
      "Use ONLY the provided references for flower species, leaves, and bag/container.",
      "Do not invent any extra species, fillers, ribbons, cards, props, or accessories.",
      "Keep the full bouquet and full bag visible in frame (zoomed out, no crop).",
      "Match bag reference exactly in shape, opening, handle/body proportions, and color tone.",
      "Flower exact counts:",
      ...(normalizedFlowerItems.length > 0 ? normalizedFlowerItems.map(formatItemSummaryLine) : ["- none"]),
      "Leaf exact counts:",
      ...(normalizedLeafItems.length > 0 ? normalizedLeafItems.map(formatItemSummaryLine) : ["- none"]),
      `Bag reference: ${normalizedBagItem ? normalizedBagItem.label : "none"}`,
      `Strict mode: ${useStrictReference ? "ON" : "OFF"}`,
      `Selection signature: ${selectionSignature}`
    ].join("\n");

    const imageGenerationParts = [
      { text: finalImagePrompt },
      ...referenceParts
    ];

    // ── BƯỚC 2: sinh ảnh với các model có hỗ trợ image output ──
    let base64Image = null;
    let usedImageModel = null;
    let usedImageBackend = null;
    const shouldTryGeminiImage = imageProvider !== "pollinations-only" && Boolean(genAI);
    const shouldTryPollinations = imageProvider !== "gemini-only" && !useStrictReference;

    const generateWithImageModel = async (modelName) => {
      const MAX_IMAGE_RETRIES = 1;
      const BASE_DELAY_MS = 1000;

      for (let attempt = 1; attempt <= MAX_IMAGE_RETRIES + 1; attempt += 1) {
        try {
          console.log(`🎨 Thử ${modelName} (lần ${attempt})...`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [{ role: "user", parts: imageGenerationParts }],
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
      // Model ảnh chính theo mẫu tham chiếu.
      base64Image = await generateWithImageModel("gemini-2.5-flash-image");
    }

    // Thử 4: Pollinations AI (Miễn phí 100%, không cần API Key - Giải pháp cứu cánh cho luồng miễn phí)
    if (!base64Image && shouldTryPollinations) {
      try {
        console.log("🔄 Thử Pollinations AI (Free Open Source Image Gen)...");
        // Mã hoá prompt để đưa lên URL
        const encodedPrompt = encodeURIComponent(finalImagePrompt);
        const pollinationsSeed = parseInt(selectionSignature.slice(0, 8), 16) || 1;
        // Gọi Pollinations tạo ảnh tỷ lệ 1:1, không có logo (nologo=true)
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${pollinationsSeed}&model=flux`;
        
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

    if (!base64Image && useStrictReference) {
      return res.status(503).json({
        message: "Gemini image model không khả dụng nên không thể tạo ảnh strict-reference lúc này.",
        provider: imageProvider,
        usedVisionModel,
        hint: "Kiểm tra GEMINI_API_KEY/quota/model availability và thử lại."
      });
    }

    if (!base64Image) {
      return res.status(500).json({
        message: "Tất cả model sinh ảnh đều bị chặn hoặc quá tải ở Free Tier.",
        prompt: finalImagePrompt,
        provider: imageProvider,
        hint: "Kiểm tra quota hoặc enable billing tại https://ai.dev/rate-limit"
      });
    }

    res.json({
      imageBase64: base64Image,
      prompt: finalImagePrompt,
      provider: imageProvider,
      usedVisionModel,
      usedImageModel,
      usedImageBackend,
      selectionSignature,
      flowerCount: flowerUrls.length,
      leafCount: leafUrls.length,
      hasBag: Boolean(trimmedBagUrl),
      strictReference: useStrictReference
    });

  } catch (error) {
    const details = error.response?.data || error.message;
    console.error("AI Error:", details);
    res.status(500).json({ message: "Lỗi tạo ảnh AI", details });
  }
};
